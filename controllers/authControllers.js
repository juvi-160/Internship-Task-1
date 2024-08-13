const User = require('../Models/userModel');
const bcrypt = require('bcrypt');

const renderSignup = (req, res) => {
    res.render('signup', { user: req.session.user });
};

const signup = async (req, res) => {
    const { password, username, email, repassword } = req.body;
    if (password !== repassword) {
        console.log('Passwords do not match');
        return res.redirect('/signup');
    }
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash,
        email,
    });
    await user.save();
    req.session.user_id = user._id;
    req.session.username = user.username; // Store username in session
    req.session.welcome = true; // Set welcome flag
    res.redirect('/profile');
};

const renderLogin = (req, res) => {
    res.render('login', { user: req.session.user });
};

const login = async (req, res) => {
    const { username, password } = req.body;
    console.log('Attempting to login:', username);
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        console.log('Login successful:', foundUser.username);
        req.session.user_id = foundUser._id;
        req.session.user = foundUser; // Store user object in session
        res.redirect('/profile');
    } else {
        console.log('Login failed for user:', username);
        res.redirect('/login');
    }
};

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};

const renderProfile = (req, res) => {
    const welcome = req.session.welcome;
    req.session.welcome = false; // Reset welcome flag
    res.render('profile', { user: req.session.user, welcome });
};

const renderEditProfile = (req, res) => {
    res.render('editProfile', { user: req.session.user });
};

const editProfile = async (req, res) => {
    const { username, email, password } = req.body;
    const updates = { username, email };
    if (password) {
        const hash = await bcrypt.hash(password, 12);
        updates.password = hash;
    }
    await User.findByIdAndUpdate(req.session.user_id, updates);
    req.session.user = await User.findById(req.session.user_id); // Update session user data
    res.redirect('/profile');
};

const deleteProfile = async (req, res) => {
    await User.findByIdAndDelete(req.session.user_id);
    req.session.destroy();
    res.redirect('/signup');
};

module.exports = {
    renderSignup,
    signup,
    renderLogin,
    login,
    logout,
    renderProfile,
    renderEditProfile,
    editProfile,
    deleteProfile
};
