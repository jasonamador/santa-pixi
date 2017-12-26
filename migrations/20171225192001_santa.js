exports.up = function(knex, Promise) {
  return knex.schema.createTableIfNotExists('highscores', (highscores) => {
    highscores.increments();
    highscores.string('name');
    highscores.integer('score');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('highscores');
};
