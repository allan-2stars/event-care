const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express();

app.use(bodyParser.json());
app.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
    type RootQuery{
      events: [String!]!
    }

    type RootMutation {
      createEvent(name: String): String
    }
    
    schema{
            query:RootQuery
            mutation:RootMutation
        }
    `),
    rootValue: {
      // must be same name as type RootQuery name events
      events: () => {
        return ['A', 'B', 'C'];
      },
      createEvent: args => {
        const eventName = args.name;
        return eventName;
      }
    },

    // set this true, you have the graphql tool in browser
    graphiql: true
  })
);

app.listen(3000);
