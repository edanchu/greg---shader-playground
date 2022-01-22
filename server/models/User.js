const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const findOrCreate = require('mongoose-findorcreate');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    index: {
      unique: true,
      partialFilterExpression: { email: { $type: 'string' } },
    },
  },
  name: { type: String, trim: true },
  password: { type: String, trim: true },
  googleId: {
    type: String,
    index: {
      unique: true,
      partialFilterExpression: { googleId: { $type: 'string' } },
    },
  },
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
});

UserSchema.plugin(findOrCreate);

UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  bcrypt.hash(this.password, 10, (err, hashedPassword) => {
    if (err) return next(err);
    this.password = hashedPassword;
    next();
  });
});

UserSchema.methods.comparePassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err);
    else {
      if (!isMatch) return cb(null, isMatch);
      return cb(null, this);
    }
  });
};

module.exports = mongoose.model('User', UserSchema);
