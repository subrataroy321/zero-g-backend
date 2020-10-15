const db = require('./models');
const mongoose = require('mongoose');

// nukeUsers
db.User.deleteMany({}, (err, nukedUsers) => {
  if (err) return console.log('unable to nuke users:', err);
  console.log('successfully nuked users...');
});
