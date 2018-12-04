'use strict';

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },

},
    { timestamps: { createdAt: 'createdAt' } }
);

UserSchema.methods.serialize = function () {
    return {
        id: this._id,
        fullName: this.fullName,
        email: this.email,
        createdAt: this.createdAt,
    };
};

UserSchema.methods.validatePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function (password) {
    return bcrypt.hash(password, 10);
};

// NOTE: mongoose will normalize the collection name: 
// lowercase(pluralize('UserModel')) = 'UserModels'
// when doing mongoimport use --collection 'UserModels'
const UserModel = mongoose.model('UserModel', UserSchema);

module.exports = UserModel