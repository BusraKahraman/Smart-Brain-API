const express = require('express');
const cors = require('cors');
const knex = require('knex');
const bcrypt = require('bcrypt');
require('dotenv').config();

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DB_URL,
    ssl: { rejectUnauthorized: false },
    port: process.env.PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

db.select('*')
  .from('users')
  .then((data) => {
    console.log(data);
  });

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('it is working!');
});

app.post('/signin', signin.handleSignIn(db, bcrypt));

app.post('/register', register.handleRegister(db, bcrypt));

app.get('/profile/:id', profile.handleProfile(db));

app.put('/image', image.handleImage(db));

app.post('/imageurl', image.handleApiCall);

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
