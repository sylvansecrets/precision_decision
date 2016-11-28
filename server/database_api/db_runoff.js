// const retreiveRank = require('./db_read_ranks');

// Finally, something that runs synchronously

// const sample_ranks = {
//   fehadsfa: {34: 3, 35: 2, 36: 0, 37: 1},
//   thjdkfaf: {34: 2, 35: 1, 31: 0, 37: 3},
//   pmndksku: {34: 0, 35: 1, 36: 2, 37: 3},
//   omhgtjnf: {34: 1, 35: 0, 36: 2, 37: 3},
//   weghjmop: {34: 3, 35: 2, 36: 0, 37: 1},
//   a: {34: 3, 35: 2, 36: 0, 37: 1},
//   b: {34: 1, 35: 2, 39: 1},
//   c: {21: 0},
//   d: {34: 2}
// }

function runoff(rank_obj){
  let tally = [];
  for (voter in rank_obj){
    tally.push(obj_to_arr(rank_obj[voter]))
  }
  return tally;
}

function obj_to_arr (option_rank){
  let objArr = [];
  let output = [];
  for (option in option_rank){
    objArr.push([option, option_rank[option]])
  }
  objArr.sort((a,b) => {
    return a[1] - b[1]
  })
  for (pair of objArr){
    output.push(pair[0])
  }
  return output;
}

function processVote(tally){
  let popular = [];
  for (pref of tally){
    popular.push(pref[0])
  }
  let round_result = table(popular);
  let winner = [];
  let winner_count = 0;
  let loser = [];
  let loser_count = Infinity;
  for (option in round_result){
    const result = round_result[option];
    if (result > winner_count){
      winner = [option]
      winner_count = result;
    } else {
      if (result === winner_count) {winner.push(option)}
    }
    if (result < loser_count){
      loser = [option];
      loser_count = result;
    } else {
      if (result === loser_count) {loser.push(option)}
    }
  }
  if (winner_count >= popular.length/2){
    return winner.length === 1 ? winner[0] : selectRandom(winner)
  } else {
    return processVote(pruneVote(tally, loser))
  }
}

function table(tally){
  return tally.reduce((acc, curr) => {
    acc[curr] ? acc[curr]+= 1 : acc[curr] = 1;
    return acc;
  }, {})
}

function selectRandom(arr){
  return arr[Math.floor(Math.random()*arr.length)]
}

function pruneVote(tally, loser){
  let delVote;
  loser.length === 1 ? delVote = loser[0] : delVote = selectRandom(loser);
  for (let i = 0; i < tally.length; i += 1){
    if (tally[i][0] === delVote){
      if (tally[i].length === 1){
        tally.splice(i, 1)
      } else {
        tally[i].shift();
      }
    }
  }
  return tally;
}

// console.log(table([1,2,3,6,8,1,2,2,3,3,3]));
// console.log(processVote(runoff(sample_ranks)));
// console.log(obj_to_arr(sample_ranks['a']));
// console.log(runoff(sample_ranks));

module.exports = function(rank_obj){
  return processVote(runoff(rank_obj));
}