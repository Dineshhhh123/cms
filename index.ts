import express from 'express';
import dotenv from 'dotenv';
import * as bodyParser from 'body-parser'
import { sequelize } from './src/db/config';
import crudRoutes from './src/routers/crudrouter';
import userRoutes from './src/routers/userrouter';
import orderRoutes from './src/routers/orderrouter';
import reportRoutes from './src/routers/reportrouter';
import superadminRoutes from './src/routers/superadminrouter';

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
