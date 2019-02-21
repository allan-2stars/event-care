const Event = require('../../models/event');
const { transformEvent } = require('./merge');

module.exports = {
  // must be same name as type RootQuery name events
  events: () => {
    return Event.find()
      .populate('creator')
      .then(events => {
        return events.map(event => {
          return transformEvent(event);
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
      creator: '5c6cf8fb644f4631d8de21a9'
    });
    let createdEvent;
    // "return" the evnet, so the resolver will await for the completion
    // as async, otherwise, will run instantly, and get invalid result.
    return event
      .save()
      .then(result => {
        createdEvent = transformEvent(result);

        // return enriched document
        return User.findById('5c6cf8fb644f4631d8de21a9');
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
  }
};
