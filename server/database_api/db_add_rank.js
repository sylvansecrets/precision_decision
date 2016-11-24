"use strict";

const settings = require('./settings');

const knex = require('knex')(settings);

const Promise = require('bluebird');

// unique_string, options:rank

const options_rank = {2: 4, 1: 2};
const st = 'x711wtbpk9mk1gh5'

function addRank(unique_string, options_rank){
  knex.transaction(function(t){
    knex('users')
      .transacting(t)
      .first('id')
      .where('unique_string', '=', unique_string)
    .then(function(user_id){
      user_id = user_id['id']
      let ranking_promise = [];
      for (let option in options_rank){
        ranking_promise.push(injectRank(user_id, option, options_rank[option], t));
      }
      return Promise.all(ranking_promise);
    })
    .then(t.commit)
    .catch((err)=>{
      t.rollback();
      console.log("transaction failed, \n", err)
    })
  })
  .then(function(){
    console.log("Success, added rank");
    process.exit();
  })
  .catch(function(err){console.log("Failure", err)})

}

function injectRank(user_id, option_id, rank, transact){
  return knex('rankings')
    .transacting(transact)
    .insert({
      user_id: user_id,
      option_id: option_id,
      rank: rank
      })
}

addRank(st, options_rank);
