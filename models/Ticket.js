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
    }
});

mongoose.index({mobileNumber: 1, startTime: 1}, {unique: true});

module.exports = Ticket = mongoose.model('Ticket', TicketSchema);

module.exports.isBooked = async (time) => {
    let res = await Ticket.find({startTime: time, expired: false});
    if(res.length < 20){
        return true;
    }
    else{
        return false;
    }
}

module.exports.bookTicket = (mobileNumber, name, startTime) => {
    let newTicket = new Ticket({
        name,
        mobileNumber,
        startTime,
        expired: false
    });
    return newTicket.save();
}

module.exports.getUserDetailsFromTicket = (id) => {
    return Ticket.findById(id).select({ "mobileNumber": 1, "name": 1});
}

module.exports.getAllTickets = (time) => {
    return Ticket.find({ startTime: time })
}