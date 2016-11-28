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
      // console.log('poll', poll_id)
      return retreiveRanks(poll_id)
    }
  })
  .then((results) => {
    // console.log(results['rows']);
    // process.exit();
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  })
}

function retreiveRanks(poll_id){
  return knex.raw(
    `select unique_string, option_id, rank from rankings where unique_string IN (select unique_string from users where poll_id = ${poll_id})`
    )
}

// const addRank = require('./db_add_rank').addRank
// readRanks('1912uf0h9z31a9f6');

function cleanRanks(rank_obj){
  let cleaned_obj = {};
  for (vote of rank_obj){
    let uid = vote.unique_string;
    let option = vote.option_id;
    let rank = vote.rank;
    if (cleaned_obj[uid]){
      cleaned_obj[uid][option] = rank
    } else {
      cleaned_obj[uid] = {option: rank}
    }
  }
  return cleaned_obj;
}

module.exports = {
  cleanRanks: cleanRanks,
  readRanks: readRanks
}
