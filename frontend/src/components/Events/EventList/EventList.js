import React from 'react';

import EventItem from './EventItem/EventItem';

import './EventList.css';

const eventList = props => {
  return props.events.map(event => (
    <EventItem
      key={event._id}
      eventId={event._id}
      title={event.title}
      userId={props.authUserId}
      creatorId={event.creator._id}
    />
  ));
};

export default eventList;
