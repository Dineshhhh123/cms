import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import User from '../models/user'; 
const app = express();

app.use(passport.initialize());


passport.use('google',
  new GoogleStrategy(
    {
      clientID: '456160802654-7fbksplkd8c4nnnurrtnom1ficei0sup.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: '/auth/google/callback', 
    },
    async (accessToken, refreshToken, profile: Profile, done) => {
      try {
        // Check if the user's email exists in your database
        const existingUser = await User.findOne({ where: { email: profile.emails?.[0].value } });

        if (existingUser) {
          return done(null, existingUser);
        } else {
          // User does not exist, create a new user based on the profile data
          const newUser = await User.create({
            email: profile.emails?.[0].value,
            // Set other properties as needed
          });

          return done(null, newUser);
        }
      } catch (error) {
        console.error('Error handling social login callback:', error);
        return done('Error handling social login callback:');
      }
    }
  )
);
