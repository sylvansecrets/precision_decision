"use strict";

const settings = require('./settings');

const knex = require('knex')(settings);

const Promise = require('bluebird');

function deletePoll(unique_string, input_obj){
  return knex('users')
  .first('poll_id')
  .where({
    'unique_string': unique_string,
    'admin': true})
  .then(function(poll_id){
    if (!poll_id){
      throw new Error ('not an admin')
    } else {
      poll_id = poll_id['poll_id']
      return vanishPoll(poll_id)
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

function vanishPoll(poll_id){
  return knex('polls')
    .where('id', poll_id)
    .update('expire', '1970-01-01')
}

module.exports  = {
  deletePoll: deletePoll;
}