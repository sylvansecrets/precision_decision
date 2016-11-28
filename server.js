//##########################################################
//    SERVER SERVER SERVER SERVER SERVER SERVER SERVER
//##########################################################

//            Configuration
// ####################################

const express             = require('express');
const app                 = express();
const bodyParser          = require('body-parser');
const PORT                = process.env.PORT || 8080;
const config              = require('./config');
const knex                = require('knex')(config);
const createInputObject   = require('./public/scripts/create-input-object');
const mailGun             = require('./public/scripts/mailGun');
const writeToPoll         = require('./server/database_api/db_add_poll');
const saveEditedPoll      = require('./server/database_api/db_edit_poll');
const addRank             = require('./server/database_api/db_add_rank');
const readRanks           = require('./server/database_api/db_read_ranks');
const runoff              = require('./server/database_api/db_runoff');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

//##########################################################
//##########################################################
//##########################################################

// ############################################
// +------------------------------------------+
// |               GET INDEX                  |
// +------------------------------------------+
// ############################################
app.get('/', (req, res) => {
  res.render('pages/index');
});


// ############################################
// +------------------------------------------+
// |             SAVES POLL to DB             |
// +------------------------------------------+
// ############################################
app.post('/polls/create_new', (req, res) => {
  const input_object = createInputObject(req.body);
  writeToPoll.writePoll(input_object).then((unique_string) => {
    res.redirect(`/polls/${unique_string}`);
  });
});


// ############################################
// +------------------------------------------+
// |      GET POLL.ejs with UNIQUE_STRING     |
// +------------------------------------------+
// ############################################
app.get('/polls/:id', (req, res) => {
  const uniqueId = req.params.id
  const path = 'pages/poll'

  function getAdminBool(uniqueId) {
    return knex.select('admin')
        .from('users')
        .where('unique_string', uniqueId);
  }

  function getIsSentBool(pollId) {
    return knex.select('isSent')
        .from('polls')
        .where('id', pollId);
  }

  function getOptionsByPollId(pollId) {
    return knex.select('question_text')
        .from('polls')
        .join('options', 'polls.id', '=', 'options.poll_id')
        .where('polls.id', pollId)
        .orderBy('options');
  }
  function getEmailsByPollId(pollId) {
    return knex.select('email')
        .from('polls')
        .join('users', 'polls.id', '=', 'users.poll_id')
        .where({
          'polls.id': pollId,
          'users.admin': false
        })
        .orderBy('email');
  }

  function getExpiry(pollId) {
    return knex.select('expire')
               .from('polls')
               .where('id', pollId);
  }

  function getQuestion(pollId) {
    return knex.select('question')
               .from('polls')
               .where('id', pollId);
  }

  function getAdminEmail(pollId) {
    return knex.select('email')
                .from('polls')
                .join('users', 'polls.id', '=', 'users.poll_id')
                .where({
                  'polls.id': pollId,
                  'users.admin': true
                })
                .orderBy('email');
  }

  function getVotedOrNull(uniqueId) {
    return knex('rankings')
              .count('rank')
              .where('unique_string', uniqueId);
  }

  function getActive(pollId) {
    return knex.select('active')
              .from('polls')
              .where('id', pollId);
  }

  function getPollDataAndRender(uniqueId, path) {
    knex.select('poll_id')
        .from('users')
        .where('unique_string', uniqueId)
        .then((resolutions) => {
          const pollId = resolutions[0].poll_id;
          return Promise.all([
                      getOptionsByPollId(pollId),
                      getEmailsByPollId(pollId),
                      getIsSentBool(pollId),
                      getAdminBool(uniqueId),
                      getExpiry(pollId),
                      getQuestion(pollId),
                      getAdminEmail(pollId),
                      getVotedOrNull(uniqueId),
                      getActive(pollId)
                ])
        })
        .then((resolutions) => {
          res.render('pages/poll', {
            options: resolutions[0],
            emails: resolutions[1],
            isSent: resolutions[2],
            admin: resolutions[3],
            expires: resolutions[4],
            question: resolutions[5],
            adminEmail: resolutions[6],
            voted: resolutions[7],
            active: resolutions[8],
            uniqueId: uniqueId
            // if rank is null
          })
        })
        .catch((err)=> {
          console.log("That poll does not exist.", err);
          res.status(404).send('That poll does not exist.');
        })
        return;
    }
    getPollDataAndRender(uniqueId, path);
  });


// ############################################
// +------------------------------------------+
// |       SENDS POLL OUT TO UNIVERSE         |
// +------------------------------------------+
// ############################################
app.post('/polls/:id/send', (req, res) => {
  const uniqueId = req.params.id;
  function getEmailsByPollId(pollId) {
    return knex.select('email', 'unique_string')
        .from('polls')
        .join('users', 'polls.id', '=', 'users.poll_id')
        .where({
          'polls.id': pollId,
          'users.admin': false
        })
        .orderBy('email');
  }

  function updateIsSent(pollId) {
    return knex('polls')
      .where('id', pollId)
      .update({isSent: true});

  }

  knex.select('poll_id')
      .from('users')
      .where('unique_string', uniqueId)
      .then((resolutions) => {
        const pollId = resolutions[0].poll_id;
        return updateIsSent(pollId);
      })
      .then(() => {
        knex.select('poll_id')
            .from('users')
            .where('unique_string', uniqueId)
            .then((resolutions) => {
              const pollId = resolutions[0].poll_id;
              return getEmailsByPollId(pollId);
            })
            .then((resolutions) => {
              resolutions.forEach(function(voter) {
                email = voter.email;
                unique_string = voter.unique_string;
                const subject = 'Now here\'s a question...'
                const emailBody = `Follow this link to the poll: http://localhost:8080/polls/${unique_string}`
                mailGun(email, subject, emailBody);
              })
            })
      })
      .catch((error) => {
        console.log('there was an error: ', error);
      })
      res.redirect(`/polls/${uniqueId}`)
})


// ############################################
// +------------------------------------------+
// |            SUBMIT VOTE                   |
// +------------------------------------------+
// ############################################
app.post('/polls/:id/vote', (req,res) => {
  const uniqueId = req.params.id;
  const voteArray = req.body.options;
  const numOfOptions = req.body.options.length;

  function getOptionId(pollId, optionText) {
        return knex.first('id')
               .from('options')
               .where({ question_text: optionText,
                        poll_id: pollId
                     })
  }

  function rankPromise(unique_string, optionText, rank, pollId){
    return getOptionId(pollId, optionText)
      .then((optionId) => {
        optionId = optionId.id
        const voteObj = {};
        voteObj[optionId] = rank;
        console.log(unique_string, voteObj);
        addRank.addRank(unique_string, voteObj);
      })
  }

  knex.select('poll_id')
      .from('users')
      .where('unique_string', uniqueId)
      .then((resolutions) => {
        const pollId = resolutions[0].poll_id;
        let rankInserts = [];
        for(let i = 0; i < numOfOptions; i++) {
          rankInserts.push(rankPromise(uniqueId, voteArray[i], i, pollId))
          }
        return Promise.all(rankInserts);
      })
      .catch((error) => {
        console.log(error);
      })
      .then(() => {
        res.redirect(`/polls/${uniqueId}`);
      })
      .catch((error) => {
          console.log(error);
      })
});


// ############################################
// +------------------------------------------+
// |             CLOSE POLL                   |
// +------------------------------------------+
// ############################################
app.post('/polls/:id/close_poll', (req, res) => {
  const uniqueId = req.params.id;

  function getEmailsByPollId(pollId) {
    return knex.select('email', 'unique_string')
        .from('polls')
        .join('users', 'polls.id', '=', 'users.poll_id')
        .where('polls.id', pollId)
        .orderBy('email');
  }

  // when active is true -> poll is expired (bass ackward I know)
  function updateActive(pollId) {
    return knex('polls')
      .where('id', pollId)
      .update({active: true});
  }


  function getPollId(uniqueId) {
    return knex.select('poll_id')
               .from('users')
               .where('unique_string', uniqueId);
  }

  getPollId(uniqueId)
      .then((resolutions) => {
        return updateActive(resolutions[0].poll_id);
      })
      .then(() => {
        return readRanks(uniqueId);
      })
      .then((ranks_obj) => {
        return cleanRanks(ranks_obj);
      })
      .then((clean_obj) => {
        return runoff(clean_obj);
      })
      .then((winner) => {
        console.log("And the winner is", winner);
      })
      .then(() => {
        knex.select('poll_id')
            .from('users')
            .where('unique_string', uniqueId)
            .then((resolutions) => {
              const pollId = resolutions[0].poll_id;
              return getEmailsByPollId(pollId);
            })
            .then((resolutions) => {
              resolutions.forEach(function(voter) {
                email = voter.email;
                unique_string = voter.unique_string;
                const subject = 'Poll Results'
                const emailBody = `This is the winner:`
                mailGun(email, subject, emailBody);
              })
            })
      })
      .then(() => {
        res.redirect(`/polls/${uniqueId}`);
      })
      .catch((error) => {
        console.log(error);
      })
});


// ####################################
// ####################################
//                Listen

    app.listen(PORT, () => {
      console.log(`Listening on port: ${PORT}`);
    })

// ####################################
// ####################################
