"use strict";

const settings = require('./settings');

const knex = require('knex')(settings);

const Promise = require('bluebird');


// //input_obj example
const input_obj = {
  send: true,
  timestamp: '2011-02-21',
  expire: '2017-01-01',
  emails: {
    admin: 'admin@ads.com',
    others: ['a@a', 'b@b', 'c@c']
  },
  options: [
    {question_text: 'butter', question_embed:"http://www.webexhibits.org/butter/i/full/iStock_000006937653Small.jpg"},
    {question_text: 'clarified butter', question_embed:"http://i.imgur.com/JXqLYYW.jpg"}
  ]
}

writePoll(input_obj);


// input object needs to contain:
//  timestamp: some sort of timestamp
//  send: whether this should be sent
//  emails: {
//    admin: admin_email
//    others: [other_emails]
// }
//  options: array of objects of the form
//          {question_text: ... , question_embed: "" or link}

function writePoll(input_obj){
  const emails = input_obj['emails'];
  const options = input_obj['options'];
  const create_time = input_obj['create_time'];
  const isSent = input_obj['send'];
  const expire = input_obj['expire'];
  knex.transaction(function(t){
      injectPoll(create_time, isSent, expire, t)
      .then(function(poll_id){
        console.log("new poll id", poll_id)

        let user_promise = [];

        emails['others'].forEach((email) => {
          user_promise.push(injectUser(email, false, poll_id, t))
        })

        user_promise.push(injectUser(emails['admin'], true, poll_id, t))

        let option_promise = [];

        options.forEach((option) => {
          option_promise.push(injectOption(option, poll_id, t))
        })

        return Promise.all(user_promise.concat(option_promise));
      })
      .then(t.commit)
      .catch((err)=>{
        t.rollback();
        console.log("transaction failed, \n", err)
      })
  })
  .then(function(){
    console.log("Success, added user");
    process.exit();
  })
  .catch(function(err){
    console.log("Failure", err);
    process.exit();
  })

}

function injectPoll(create_time, isSent, expire, transact){
  console.log("expire here", expire);
    return knex('polls')
      .transacting(transact)
      .returning('id')
      .insert({
          active: true,
          created_at: create_time,
          isSent: isSent,
          expire: expire
        });
}

function injectUser(email, admin_state, poll_id, transact){
  console.log(email, poll_id);
  return knex('users')
      .transacting(transact)
      .insert({
        poll_id: Number(poll_id[0]),
        email: email,
        unique_string: generateRandomString(),
        admin: !!admin_state
      })
  }

function injectOption(option, poll_id, transact){
   return knex('options')
      .transacting(transact)
      .insert({
        poll_id: Number(poll_id[0]),
        question_text: option['question_text'],
        question_embed: option['question_embed']
      })
  }

// generates a random alphanumeric string
function generateRandomString(num=16){
  return Math.random().toString(36).substr(2,num);
}
