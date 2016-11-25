//##########################################################
//    SERVER SERVER SERVER SERVER SERVER SERVER SERVER
//##########################################################

//            Configuration
// ####################################

const express     = require('express');
const app         = express();
const bodyParser  = require('body-parser');
const PORT        = process.env.PORT || 8080;
const config      = require('./config');
const knex        = require('knex')(config);
const commitPollToDb = require('./server/database_api/db_add_poll');
const commitEditsToDb = require('./server/database_api/db_edit_poll');

app.use(express.static("public"));
//app.use(express.static("views/partials"));
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');

//                Routes
// ####################################

  // Landing Page // Create Poll Page
app.get('/', (req, res) => {
  res.render('pages/index', {
    edit: false;
  });
});


  // Create Poll Page
// app.get('/polls/new', (req, res) => {
//   //always the same, empty skeleton
//   res.render('pages/new');
// });


  // Sends initial poll data to db and loads preview
app.post('/polls/:id/preview', (req, res) => {
  // Adds poll to database, leaving is_sent = false
  const poll
  commitPollToDb
  // Creates all necessary unique IDs
  // redirects to get /polls/id/preview
});

// +------------------------------------------+
// |     Gets preview of poll with footer     |
// +------------------------------------------+
app.get('/polls/:id/preview', (req, res) => {
  const pollId = req.params.id
  function getQuestionsByPollId(pollId) {
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
  questionPromise = getQuestionsByPollId(pollId);
  emailPromise = getEmailsByPollId(pollId);
  Promise.all([questionPromise, emailPromise])
  .then((resolutions) => {
    console.log(resolutions);
    res.render('pages/polls_preview', {
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
// |            Gets Edit Page                |
// +------------------------------------------+
app.get('/polls/:id/edit', (req, res) => {
  const pollId = req.params.id

  function getQuestionsByPollId(pollId) {
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
  questionPromise = getQuestionsByPollId(pollId);
  emailPromise = getEmailsByPollId(pollId);
  Promise.all([questionPromise, emailPromise])
  .then((resolutions) => {
    console.log(resolutions);
    res.render('pages/polls_edit', {
      questions: resolutions[0],
      emails: resolutions[1],
      edit: true;
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

