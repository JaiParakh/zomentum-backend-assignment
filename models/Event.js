const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
    eventName: {
        type: String,
        required: true
    },
    eventTime: {
        type: Date,
        required: true
    },
    tickets: [{
        name: {
            type: String
        },
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Event'
        }
    }]
});

module.exports = Event = mongoose.model('Event', EventSchema);