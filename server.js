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
const writeToPoll         = require('./server/database_api/db_add_poll');
// const commitPollToDb = require('./server/database_api/db_add_poll');
// const commitEditsToDb = require('./server/database_api/db_edit_poll');

app.use(express.static("public"));
//app.use(express.static("views/partials"));
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

//                Routes
// ####################################

  // Landing Page // Create Poll Page
app.get('/', (req, res) => {
  res.render('pages/index');
});


  // Create Poll Page
// app.get('/polls/new', (req, res) => {
//   //always the same, empty skeleton
//   res.render('pages/new');
// });


// Creates new poll
app.post('/polls/create_new', (req, res) => {
  const input_object = createInputObject(req.body);
  writeToPoll.writePoll(input_object).then((unique_string) => {
    res.redirect(`/polls/${unique_string}`);
  });
});








// +------------------------------------------+
// |     Gets Poll.ejs and sends nec. data    |
// +------------------------------------------+
app.get('/polls/:id', (req, res) => {

  const uniqueId = req.params.id

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
  // function to get question
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



  function getDataForPollAndRender(uniqueId) {
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
                      getAdminEmail(pollId)
                ])
        })
        .then((resolutions) => {
          // console.log('this is res', resolutions);
          res.render('pages/poll', {
            options: resolutions[0],
            emails: resolutions[1],
            isSent: resolutions[2],
            admin: resolutions[3],
            expires: resolutions[4],
            question: resolutions[5],
            adminEmail: resolutions[6]
            // if rank is null
          })
        })
        .catch((err)=> {
          console.log("That poll does not exist.", err);
          res.status(404).send('That poll does not exist.');
        })
        return;
  }
  if(uniqueId)
  getDataForPollAndRender(uniqueId);
});






// +------------------------------------------+
// |            Gets Edit Page                |
// +------------------------------------------+
app.get('/polls/:id/edit', (req, res) => {
  const pollId = req.params.id

  function getOptionsByPollId(pollId) {
    return knex.select('question_text')
        .from('polls')
        .join('options', 'polls.id', '=', 'options.poll_id')
        .where('polls.id', pollId)
        .orderBy('options')
  }
  function getEmailsByPollId(pollId) {
    return knex.select('email')
        .from('polls')
        .join('users', 'polls.id', '=', 'users.poll_id')
        .where('polls.id', pollId)
        .orderBy('email')
  }
  optionPromise = getOptionsByPollId(pollId);
  emailPromise = getEmailsByPollId(pollId);
  Promise.all([optionPromise, emailPromise])
  .then((resolutions) => {
    console.log(resolutions);
    res.render('pages/poll', {
      questions: resolutions[0],
      emails: resolutions[1]
    })
  })
  .catch((err)=> {
    console.log("That poll does not exist.", err);
    res.status(404).res.send('That poll does not exist.');
  })
});



// +------------------------------------------+
// |        Commits Edits to Database         |
// +------------------------------------------+
app.post('/polls/:id/edit', (req, res) => {

});


  // Submits poll
app.post('/polls/:id/submit', (req,res) => {
  // Mailgun is initiated and poll links are sent
  // is_sent = true
});


//                Listen
// ####################################

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
})
