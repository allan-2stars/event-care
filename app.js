const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Event = require('./models/event');
const User = require('./models/user');

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

    type User{
      _id:ID!
      email: String!
      password: String
    }

    input EventInput {
      title: String!
      description: String!
      price: Float!
      date: String!
    }

    input UserInput{
      email: String!
      password: String!
    }

    type RootQuery{
      events: [Event!]!
    }

    type RootMutation {
      createEvent(eventInput: EventInput): Event
      createUser(userInput: UserInput): User
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
          date: new Date(args.eventInput.date),
          creator: '5c6c8ed04d792b295cf1ef0a'
        });
        let createdEvent;
        // "return" the evnet, so the resolver will await for the completion
        // as async, otherwise, will run instantly, and get invalid result.
        return event
          .save()
          .then(result => {
            createdEvent = { ...result._doc, _id: result.id };
            // return enriched document
            return User.findById('5c6c8ed04d792b295cf1ef0a');
          })
          .then(user => {
            if (!user) {
              throw new Error('User not found.');
            }
            // "push" is a mongoose method,
            // input can be either whole object or the id
            user.createdEvents.push(event);
            return user.save();
          })
          .then(result => {
            return createdEvent;
          })
          .catch(err => {
            console.log(err);
            throw err;
          });
      },

      createUser: args => {
        const { email, password } = args.userInput;
        // use return to wait for the correct result
        return User.findOne({ email })
          .then(user => {
            if (user) {
              throw new Error('User existes.');
            }
            return bcrypt.hash(password, 12);
          })

          .then(hashedPassword => {
            const user = new User({
              email: email,
              password: hashedPassword
            });
            return user.save();
          })
          .then(result => {
            return { ...result._doc, password: null, _id: result.id };
          })
          .catch(err => {
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
