const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
    mobileNumber: {
        type: String
    },
    name: {
        type: String
    },
    startTime: {
        type: Date
    },
    expired: {
        type: Boolean
    },
    createdOn: {
        type: String
    }
});

// Ensures that duplicate tickets are not added.
TicketSchema.index({mobileNumber: 1, startTime: 1}, {unique: true});

module.exports = Ticket = mongoose.model('Ticket', TicketSchema);

// Checks if 20 tickets are already booked.
module.exports.isBooked = async (time) => {
    let res = await Ticket.find({startTime: time, expired: false});
    if(res.length < 20){
        return true;
    }
    else{
        return false;
    }
}

// Adds the ticket in the db.
module.exports.bookTicket = (mobileNumber, name, startTime) => {
    let newTicket = new Ticket({
        name,
        mobileNumber,
        startTime,
        expired: false,
        createdOn: new Date()
    });
    return newTicket.save();
}

// Gets user details from ticket id.
module.exports.getUserDetailsFromTicket = (id) => {
    return Ticket.findById(id).select({ "mobileNumber": 1, "name": 1});
}

// Gets all tickets at the specified time.
module.exports.getAllTickets = (time) => {
    return Ticket.find({ startTime: time })
}

// Sets expired to true.
module.exports.setExpired = () => {
    let date = new Date().setHours(new Date().getHours() - 8);
    return Ticket.updateMany({ startTime: { $lte: date }}, { $set: { expired: true }});
}

// deletes the expired tickets.
module.exports.deleteExpired = () => {
    return Ticket.deleteMany({ expired: false});
}