"use strict";

const settings = require('./settings');

const knex = require('knex')(settings);

const Promise = require('bluebird');

// given a unique string (of either visitor or admin), retreive the current ranks


function readRanks(unique_string){
  return knex('users')
  .first('poll_id')
  .where('unique_string', unique_string)
  .then(function(poll_id){
    if (!poll_id){
      throw new Error ('not a user')
    } else {
      poll_id = poll_id['poll_id']
      return retreiveRanks(poll_id)
    }
  })
  .then((results) => {
    console.log(results['rows']);
    process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  })
}

function retreiveRanks(poll_id){
  // return knex('rankings')
  //   .join(
  //     knex('users')
  //       .select('id')
  //       .where('poll_id', poll_id),
  //       'users.id', '=', 'rankings.user_id'
  //     )
  return knex.raw(
    `SELECT 'user_id', 'rank' FROM (SELECT 'user_id' FROM users WHERE poll_id = ${poll_id}) AS approved_user INNER JOIN rankings ON ('rankings.user_id' = 'approved_user.id')`
    )
}

const addRank = require('./db_add_rank').addRank
addRank('17zu3myr41gqqiro', {1:2, 2:3, 3:1})
readRanks('17zu3myr41gqqiro');