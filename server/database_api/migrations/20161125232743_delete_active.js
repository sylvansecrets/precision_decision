exports.up = function(knex, Promise) {
  return removeActive()
    .catch((err) => console.log(err));

  function removeActive(){
    return knex.schema.table('polls', function(table){
      table.dropColumn('active')
    })
  }
};

exports.down = function(knex, Promise) {
  return addActive()
    .catch((err) => console.log(err));

  function addActive(){
    return knex.schema.table('polls', function(table){
      table.boolean('active')
    })
  }
};
