exports.up = function(knex, Promise) {
  return createPolls()
    .then(createUsers)
    .then(createOptions)
    .then(createRankings);

  function createPolls(){
      return knex.schema.createTable('polls', function(table){
        table.increments();
        table.dateTime('created_at');
        table.boolean('active');
      })}

  function createUsers(){
      return knex.schema.createTable('users', function(table){
        table.increments();
        table.integer('poll_id');
        table.foreign('poll_id').references('polls.id');
        table.boolean('admin');
        table.text('unique_string');
        table.text('email');
      })}

  function createOptions(){
      return knex.schema.createTable('options', function(table){
        table.increments();
        table.integer('poll_id');
        table.foreign('poll_id').references('polls.id');
        table.text('question_text');
        table.text('question_embed')
      })}

  function createRankings(){
      return knex.schema.createTable('rankings', function(table){
        table.increments();
        table.integer('option_id');
        table.foreign('option_id').references('options.id');
        table.integer('user_id');
        table.foreign('user_id').references('users.id');
        table.integer('rank');
      })}
};

exports.down = function(knex, Promise) {
  return deleteRankings()
    .then(deleteOptions)
    .then(deleteUsers)
    .then(deletePolls)

  function deleteRankings(){
    return knex.schema.dropTable('rankings')
  }

  function deleteOptions(){
    return knex.schema.dropTable('options')
  }

  function deleteUsers(){
    return knex.schema.dropTable('users')
  }

  function deletePolls(){
    return knex.schema.dropTable('polls')
  }
};
