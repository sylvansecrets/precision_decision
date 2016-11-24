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

app.use(express.static("public"));
//app.use(express.static("views/partials"));
app.use(bodyParser.urlencoded({ extended: true }));

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


  // Sends initial poll data to db and loads preview
app.post('/polls/:id/preview', (req, res) => {
  // Adds poll to database, leaving is_sent = false
  // Creates all necessary unique IDs
  // redirects to get /polls/id/preview
});


  // Gets preview of poll with footer
app.get('/polls/:id/preview', (req, res) => {
  // retrieves poll and appends to DOM
  // and footer with two buttons: Send || Edit
});


  // Gets edit page
app.get('/polls/:id/edit', (req, res) => {
  // if is_sent = false
  // Retrieves poll and appends to DOM with /polls/new skeleton
});


  // Updates poll
app.post('/polls/:id/edit', (req, res) => {
  // if is_sent = false
  // Updates database
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

