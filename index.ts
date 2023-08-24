import express from 'express';
import dotenv from 'dotenv';
import * as bodyParser from 'body-parser'
import { sequelize } from './src/config/db';
import crudRoutes from './src/routers/crudrouter';
import userRoutes from './src/routers/userrouter';
import orderRoutes from './src/routers/orderrouter';
import reportRoutes from './src/routers/reportrouter';
import superadminRoutes from './src/routers/superadminrouter';
import User from './src/models/user';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
dotenv.config();

import passport from 'passport';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/', crudRoutes);
app.use('/', userRoutes);
app.use('/',orderRoutes);
app.use('/',reportRoutes);
app.use('/',superadminRoutes);

app.use(passport.initialize())

const port = process.env.PORT;
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    await sequelize.sync();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
  }
})();


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