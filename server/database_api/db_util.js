"use strict";

const settings = require('./settings');

const knex = require('knex')(settings);

const Promise = require('bluebird');


// input object needs to contain:
//  timestamp: some sort of timestamp
//  emails: list of emails
//  options: array of objects of the form
//          {question_text: ... , question_embed: "" or link}
function addPoll(input_obj){
  const create_time = input_obj['timestamp'];
  const emails = input_obj['emails'];
  const options = input_obj['options'];

  insertPoll(create_time)
    .then(data => {
      console.log(data);
    })
}

function injectPoll(create_time){
    knex('polls')
    .returning('id')
    .insert({
      active: true,
      created_at: create_time
    })
  .then((rows)=>{
    console.log("Inserted poll with id ", rows);
  })
  .catch((err)=>{
    console.log("Unable to insert poll", err);
  })
}

function injectUser(email, admin_state, poll_id){
  knex('users')
      .returning('id')
      .insert({
        poll_id: poll_id,
        email: email,
        unique_string: generateRandomString(),
        admin: !!admin_state
      })
    .then((rows)=>{
      console.log("Inserted user with id ", rows);
    })
    .catch((err)=>{
      console.log("Unable to insert user", err);
    })
  }

function injectOption(option, poll_id){
   knex('options')
      .returning('id')
      .insert({
        poll_id: poll_id,
        question_text: option['question_text'],
        question_embed: option['question_embed']
      })
    .then((rows)=>{
      console.log("Inserted option with id ", rows);
    })
    .catch((err)=>{
      console.log("Unable to insert option", err);
    })
  }

function injectRanking(user_id, option_id, rank){
   knex('rankings')
    .returning('id')
    .insert({
      user_id: user_id,
      option_id: option_id,
      rank: rank
    })
  .then((rows)=>{
    console.log("Inserted ranking with id ", rows);
  })
  .catch((err)=>{
    console.log("Unable to insert ranking", err);
  })
}



const templateObj = {
  timestamp: '2011-02-21',
  emails: ['a@a', 'b@b', 'c@c'],
  options: [
    {question_text: 'butter', question_embed:""},
    {question_text: 'clarified butter', question_embed:""}
  ]
}



// generates a random alphanumeric string
function generateRandomString(num=16){
  return Math.random().toString(36).substr(2,num);
}

// injectPoll('2017-01-30');
// injectUser('z@z', 1, 3);
// injectOption({question_text: 'flank', question_embed:'http://i.imgur.com/a0RPhmK.jpg'}, 2);
// injectRanking(2,1,4);