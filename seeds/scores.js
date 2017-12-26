
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('highscores').del()
    .then(function () {
      // Inserts seed entries
      return knex('highscores').insert([
        {score: 500, name: 'Dasher'},
        {score: 1000, name: 'Dancer'},
        {score: 1500, name: 'Prancer'},
        {score: 2000, name: 'Vixen'},
        {score: 2500, name: 'Comet'},
        {score: 3000, name: 'Cupid'},
        {score: 3500, name: 'Donner'},
        {score: 4000, name: 'Blitzen'},
        {score: 4500, name: 'Rudolph'},
        {score: 5000, name: 'Santa'},
      ]);
    });
};
