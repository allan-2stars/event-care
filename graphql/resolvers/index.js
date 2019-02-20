const bcrypt = require('bcrypt');

const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
// find all the event for every event Id
// eventIds is an array of Event ID
// below function, use async await method for fun.
// use try catch
const events = async eventIds => {
  // no need use 'return'
  // top most always returned.
  const events = await Event.find({ _id: { $in: eventIds } });
  try {
    //.then(events => {
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        date: readableDate(event._doc.date),
        // use function to drill deeper,
        // drill down to get rich data of the user for this event
        creator: user.bind(this, event.creator)
      };
    });
  } catch (err) {
    throw err;
  }
};

const singleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      _id: event.id,
      creator: user.bind(this, event.creator)
    };
  } catch (err) {
    throw err;
  }
};

// helper function to get the user id as can be used in GraphQL
const user = userId => {
  return User.findById(userId)
    .then(user => {
      return {
        ...user._doc,
        _id: user.id,
        // use function to drill deeper,
        // drill down to get rich data of the event for this user
        createdEvents: events.bind(this, user._doc.createdEvents)
      };
    })
    .catch(err => {
      throw err;
    });
};

// convert Date to readable format
const readableDate = date => {
  return new Date(date).toISOString();
};

module.exports = {
  // must be same name as type RootQuery name events
  events: () => {
    return Event.find()
      .populate('creator')
      .then(events => {
        return events.map(event => {
          //return { ...event._doc, _id: event._doc._id.toString() };
          // mongoose has a special
          return {
            ...event._doc,
            _id: event._id,
            date: readableDate(event._doc.date),
            // convert database object ID to string ID
            creator: user.bind(this, event._doc.creator)
          };
        });
      })
      .catch(err => {
        throw err;
      });
  },
  // use async function
  bookings: async () => {
    try {
      const bookings = await Booking.find();
      return bookings.map(booking => {
        return {
          ...booking._doc,
          _id: booking.id,
          user: user.bind(this, booking._doc.user),
          event: singleEvent.bind(this, booking._doc.event),
          createdAt: readableDate(booking._doc.createdAt),
          updatedAt: readableDate(booking._doc.updatedAt)
        };
      });
    } catch (err) {
      throw err;
    }
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
        createdEvent = {
          ...result._doc,
          _id: result.id,
          date: readableDate(event._doc.date),
          // date: event._doc.date,
          // enrich the creator for deeper data
          creator: user.bind(this, result._doc.creator)
        };
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
  },
  bookEvent: async args => {
    const fetchedEvent = await Event.findOne({ _id: args.eventId });
    const booking = new Booking({
      user: '5c6c8ed04d792b295cf1ef0a',
      event: fetchedEvent
    });
    const result = await booking.save();
    return {
      ...result._doc,
      _id: result.id,
      user: user.bind(this, result._doc.user),
      event: singleEvent.bind(this, result._doc.event),
      createdAt: readableDate(result._doc.createdAt),
      updatedAt: readableDate(result._doc.updatedAt)
    };
  }
};
