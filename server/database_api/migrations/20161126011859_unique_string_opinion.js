exports.up = function(knex, Promise) {
  return addUnique()
    .catch((err) => console.log(err));

  function addUnique(){
    return knex.schema.alterTable('rankings', function(t){
      t.unique(['unique_string', 'option_id'])
    })
  }
};

exports.down = function(knex, Promise) {
  return removeUnique()
    .catch((err) => console.log(err));

  function removeUnique(){
    return knex.schema.alterTable('rankings', function(t){
      t.dropUnique('unique_string_option_id')
    })
  }

};
