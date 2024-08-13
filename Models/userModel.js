const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
});

// Instance method for password comparison
userSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
};

// Static method for finding and validating user
userSchema.statics.findAndValidate = async function (username, password) {
    const user = await this.findOne({ username });
    if (!user) {
        return false;
    }
    const isValid = await user.comparePassword(password);
    return isValid ? user : false;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
