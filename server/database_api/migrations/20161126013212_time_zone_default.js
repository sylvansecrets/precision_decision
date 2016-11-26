exports.up = function(knex, Promise) {
  return removeTime()
    .then(newTime)
    .catch((err) => console.log(err));



  function newTime(){
    return knex.schema.table('polls', function(table){
      table.timestamp('created_at', true).defaultTo(knex.fn.now());
    })
  }
  function removeTime(){
  return knex.schema.table('polls', function(table){
    table.dropColumn('created_at');
  })
}
};

exports.down = function(knex, Promise) {
  return removeTime()
    .then(revertTime)
    .catch((err) => console.log(err));

  function revertTime(){
    return knex.schema.table('polls', function(table){
      table.timestamp('created_at');
    })
  }
  function removeTime(){
  return knex.schema.table('polls', function(table){
    table.dropColumn('created_at');
  })
}
};

