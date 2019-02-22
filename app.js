const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');

const graphQlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');
const isAuth = require('./middleware/is-auth');
const app = express();

app.use(bodyParser.json());

// set Headers for fixing problem of CORS policy
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});
app.use(isAuth);

app.use(
  '/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,

    // set this true, you have the graphql tool in browser
    graphiql: true
  })
);

// DB config
const db = require('./config/keys').mongoURI;
const PORT = require('./config/keys').PORT || 8000;
// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected!');
  })
  .catch(err => console.log('database connect error: ', err));

app.listen(PORT);
console.log(`Listing Port: ${PORT}`);
