const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'dummy',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy',
    callbackURL: (process.env.BACKEND_URL || 'http://localhost:5001') + "/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    const { id, displayName, emails } = profile;
    const email = emails[0].value;
    try {
        let user = await User.findOne({ googleId: id });
        if (!user) {
            user = await User.findOne({ email });
            if (user) {
                user.googleId = id;
                await user.save();
            } else {
                user = await User.create({ 
                    name: displayName, 
                    email, 
                    googleId: id,
                    role: email === 'shivavarma336@gmail.com' ? 'admin' : 'user'
                });
            }
        }
        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
}));
