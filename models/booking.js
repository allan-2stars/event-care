const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: 'Event'
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  // Below, Schema Options by mongoose
  {
    // add "created at", "updated at" field
    // for every entry in database
    timestamps: true
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
