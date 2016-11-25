"use strict";

const settings = require('./settings');

const knex = require('knex')(settings);

const Promise = require('bluebird');

const add_poll = require('./db_add_poll')

// edit a poll

// //input_obj example
// const input_obj = {
//   send: true,
//   timestamp: '2011-02-21',
//   expire: '2017-01-01',
//   question: 'bet on the better butter',
//   emails: {
//     admin: 'admin@ads.com',
//     others: ['z@a', 'y@b', 'e@c']
//   },
//   options: [
//     {question_text: 'butter', question_embed:"http://www.webexhibits.org/butter/i/full/iStock_000006937653Small.jpg"},
//     {question_text: 'clarified butter', question_embed:"http://i.imgur.com/JXqLYYW.jpg"}
//   ]
// }

// let uid = '5uhnq0vd7hddzr0u';
// let ufid = '54r4g4s41kmy72vu';

// editPoll(ufid, input_obj);

// for admins only
function editPoll(unique_string, input_obj){
  knex('users')
  .first('poll_id')
  .where({
    'unique_string': unique_string,
    'admin': true})
  .then(function(poll_id){
    if (!poll_id){
      throw new Error ('not an admin')
    } else {
      return replacePoll(poll_id, input_obj)
    }
  })
  .then(() => {
    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  })
}

function replacePoll(poll_id, input_obj){
  poll_id = poll_id['poll_id'];
  const emails = input_obj['emails'];
  const options = input_obj['options'];
  const isSent = input_obj['send'];
  const expire = input_obj['expire'];
  const question = input_obj['question'];

  console.log(poll_id);

  return knex.transaction(function(t){
    ripPoll(poll_id, isSent, expire, question, t)
    .then(function(){

      let user_promise = [];

      emails['others'].forEach((email) => {
        user_promise.push(ripUser(email, false, poll_id, t))
      })

      let option_promise = [];

      options.forEach((option) => {
        option_promise.push(ripOption(option, poll_id, t))
      })

      // console.log(user_promise.length, option_promise.length)

      return Promise.all(user_promise.concat(option_promise));

    })
    .then(t.commit)
    .catch((err) => {
      t.rollback();
      console.log(`transaction for replacing poll ${poll_id} has failed`, err)
    })
  })

}

function ripPoll(poll_id, isSent, expire, question, transact){
  return knex('polls')
    .transacting(transact)
    .where('id', poll_id)
    .update({
      'isSent': isSent,
      'expire': expire,
      'question': question
    })
}

function ripUser(email, admin_state, poll_id, transact){
  console.log('email')
  return knex('users')
    .transacting(transact)
    .where({
      'poll_id': poll_id,
      'admin': false
      })
    .del()
    .then(function() {
      console.log(email, admin_state, poll_id, transact);
      return add_poll.injectUser(email, admin_state, poll_id, transact)
    })
    .then(console.log('ripUser done'))
}

function ripOption(option, poll_id, transact){
  return knex('options')
    .transacting(transact)
    .where('poll_id', poll_id)
    .del()
    .then(function() {
      console.log(option, poll_id);
      return add_poll.injectOption(option, poll_id, transact)
    })
}

// generates a random alphanumeric string
function generateRandomString(num=16){
  return Math.random().toString(36).substr(2,num);
}

module.exports = {
  editPoll: editPoll
}