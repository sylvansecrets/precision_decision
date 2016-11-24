
exports.up = function(knex, Promise) {
  return addExpire()
    .catch((err) => console.log(err));

  function addExpire(){
    return knex.schema.table('polls', function(table){
      table.timestamp('expire')
    })
  }
};

exports.down = function(knex, Promise) {
  return removeExpire()
    .catch((err) => console.log(err));

  function removeExpire(){
    return knex.schema.table('polls', function(table){
      table.dropColumn('expire')
    })
  }
};
