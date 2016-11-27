module.exports = function getPollDataAndRender(uniqueId, path) {
const config = {
  "client": "pg",
  "connection": {
  "host": "127.0.0.1",
  "port": 5432,
  "database": "pd_db",
  "user": "precision",
  "password": "decision"
  }
}
const knex = require('knex')(config);

  function getAdminBool(uniqueId) {
    return knex.select('admin')
        .from('users')
        .where('unique_string', uniqueId);
  }

  function getIsSentBool(pollId) {
    return knex.select('isSent')
        .from('polls')
        .where('id', pollId);
  }

  function getOptionsByPollId(pollId) {
    return knex.select('question_text')
        .from('polls')
        .join('options', 'polls.id', '=', 'options.poll_id')
        .where('polls.id', pollId)
        .orderBy('options');
  }
  function getEmailsByPollId(pollId) {
    return knex.select('email')
        .from('polls')
        .join('users', 'polls.id', '=', 'users.poll_id')
        .where({
          'polls.id': pollId,
          'users.admin': false
        })
        .orderBy('email');
  }

  function getExpiry(pollId) {
    return knex.select('expire')
               .from('polls')
               .where('id', pollId);
  }

  function getQuestion(pollId) {
    return knex.select('question')
               .from('polls')
               .where('id', pollId);
  }

  function getAdminEmail(pollId) {
    return knex.select('email')
        .from('polls')
        .join('users', 'polls.id', '=', 'users.poll_id')
        .where({
          'polls.id': pollId,
          'users.admin': true
        })
        .orderBy('email');
  }


  // function getPollDataAndRender(uniqueId, path) {
    knex.select('poll_id')
        .from('users')
        .where('unique_string', uniqueId)
        .then((resolutions) => {
          const pollId = resolutions[0].poll_id;
          return Promise.all([
                      getOptionsByPollId(pollId),
                      getEmailsByPollId(pollId),
                      getIsSentBool(pollId),
                      getAdminBool(uniqueId),
                      getExpiry(pollId),
                      getQuestion(pollId),
                      getAdminEmail(pollId)
                ])
        })
        .then((resolutions) => {
          // console.log('this is res', resolutions);
          res.render(path, {
            options: resolutions[0],
            emails: resolutions[1],
            isSent: resolutions[2],
            admin: resolutions[3],
            expires: resolutions[4],
            question: resolutions[5],
            adminEmail: resolutions[6],
            uniqueId: uniqueId
            // if rank is null
          })
        })
        .catch((err)=> {
          console.log("That poll does not exist.", err);
          res.status(404).send('That poll does not exist.');
        })
      return;
    // }
  }
