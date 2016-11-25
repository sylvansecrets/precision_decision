
exports.up = function(knex, Promise) {
  return forceUnique()
    .then(swapForeign);

  function swapForeign(){
    return knex.schema.alterTable('rankings', function(t){
      t.dropColumn('user_id');
      t.text('unique_string');
      t.foreign('unique_string').references('users.unique_string');
    })
  }

  function forceUnique(){
    return knex.schema.alterTable('users', function(t){
      t.unique('unique_string');
    })
  }



};

exports.down = function(knex, Promise) {
  return reswapForeign()
    .then(unUnique);

  function reswapForeign(){
    return knex.schema.alterTable('rankings', function(t){
      t.dropColumn('unique_string');
      t.integer('user_id');
      t.foreign('user_id').references('users.id')
    })
  }

  function unUnique(){
    return knex.schema.alterTable('users', function(t){
      t.dropUnique('unique_string');
    })
  }

};
