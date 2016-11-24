
exports.up = function(knex, Promise) {
  return addSent()
    .catch((err) => console.log(err));

  function addSent(){
    return knex.schema.table('polls', function(table){
      table.boolean('isSent')
    })
  }

};

exports.down = function(knex, Promise) {
  return deleteSent()
    .catch((err) => console.log(err));

  function deleteSent(){
    return knex.schema.table('polls', function(table){
      table.dropColumn('isSent')
    })
  }

};
