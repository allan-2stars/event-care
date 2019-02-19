const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');

const Event = require('./models/event');

const app = express();

app.use(bodyParser.json());
app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
    type Event {
      _id: ID!
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    type RootQuery{
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
    }
    
    schema{
            query:RootQuery
            mutation:RootMutation
        }
    `),
    rootValue: {
      // must be same name as type RootQuery name events
      events: () => {
        return Event.find()
          .then(events => {
            return events.map(event => {
              //return { ...event._doc, _id: event._doc._id.toString() };
              // mongoose has a special
              return { ...event._doc, _id: event._id };
            });
          })
          .catch(err => {
            throw err;
          });
      },
      createEvent: args => {
        const event = new Event({
          title: args.eventInput.title,
          description: args.eventInput.description,
          price: +args.eventInput.price,
          date: new Date(args.eventInput.date)
        });
        // "return" the evnet, so the resolver will await for the completion
        // as async, otherwise, will run instantly, and get invalid result.
        return event
          .save()
          .then(result => {
            console.log(result);
            // return enriched document
            return { ...result._doc };
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      }
    },

    // set this true, you have the graphql tool in browser
    graphiql: true
  })
);

// DB config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected!');
  })
  .catch(err => console.log('database connect error: ', err));

app.listen(3000);
