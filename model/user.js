var mongoose = require('mongoose'),
  bcrypt = require('bcrypt');


// User Schema
var userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true},
});

// Password verification
userSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Bcrypt middleware
userSchema.pre('save', function (next) {
  var user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});


// Seed a user
var User = mongoose.model('User', userSchema);

var user = new User({ username: 'bob', email: 'bob@example.com', password: 'secret' });
user.save(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('user: ' + user.username + " saved.");
  }
});


module.exports = User;