//##########################################################
//    SERVER SERVER SERVER SERVER SERVER SERVER SERVER
//##########################################################

//            Configuration
// ####################################

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
const config = require('./config')
const knex = require('knex')(config);

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');


//                Routes
// ####################################

        //         Create Poll
        // ############################

  // Landing Page
app.get("/", (req, res) => {
  res.render('pages/index');
});

  // Create Poll
app.get('/new_poll', (req, res) => {
  // Render skeleton for poll
    //
});

  // Confirm Poll
app.get('new_poll/confirm', (req, res) => {

});


        //             Poll
        // ############################

  // Submit Poll after Confirmation
app.post('/new_poll/submit', (req, res) => {

});

  // View Poll as Voter
app.get('/poll/:poll_id/:unique_id', (req, res) => {

});

  // Submit or Update Vote
app.post('/poll/:poll_id/:unique_id', (req, res) => {

});



//                Listen
// ####################################

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
})
