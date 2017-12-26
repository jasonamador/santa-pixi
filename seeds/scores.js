
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('highscores').del()
    .then(function () {
      // Inserts seed entries
      return knex('highscores').insert([
        {score: 1000, name: 'Jason'},
        {score: 2000, name: 'Jason'},
        {score: 3000, name: 'Jason'},
        {score: 4000, name: 'Jason'},
        {score: 5000, name: 'Jason'},
        {score: 6000, name: 'Jason'},
        {score: 7000, name: 'Jason'},
        {score: 8000, name: 'Jason'},
        {score: 9000, name: 'Jason'},
        {score: 10000, name: 'Jason'},
      ]);
    });
};
