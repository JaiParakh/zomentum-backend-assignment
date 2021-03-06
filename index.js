const express = require('express');
const mongoose = require('mongoose');
const Agenda = require('agenda');
const Ticket = require('./models/Ticket');

const app = express();
app.use(express.json());

const agenda = new Agenda({db: {address: 'mongodb://localhost:27017/zomentum', collection: "tickets"}});

// An job is defined below 
agenda.define('set expired and delete', async job => {
    try{
        let expiredTickets = await Ticket.setExpired();
        console.log(`Number of tickets expired: ${expiredTickets.nModified}`);

        let deletedTickets = await Ticket.deleteExpired();
        console.log(`Number of tickets deleted: ${deletedTickets.deletedCount}`);
    }catch(err){
        console.log(err);
    }
});

// Runs every 2 hours to mark the expired flag and delete the expired tickets.
(async function(){
    await agenda.start();
    await agenda.every('2 hours', 'set expired and delete');
})();

// Middleware function to validate mongo Id.
function validateMongoId(req, res, next){
    let isValid = mongoose.Types.ObjectId.isValid(req.params.id);
    if(!isValid){
        return res.status(400).json({ success: false, msg: "Invalid mongoose Id."});
    }
    next();
}

// Books a ticket.
app.post('/bookticket', async (req, res) => {
    let timmings = req.body.timmings;
    let mobileNumber = req.body.mobileNumber;
    let name = req.body.name;

    //Checks if 20 tickets are already booked.
    let flag = await Ticket.isBooked(timmings);
    if(flag){
        try{
            let data = await Ticket.bookTicket(mobileNumber, name, timmings);
            return res.status(200).json({ success: true, msg: "Ticket Booked", data });
        }catch(err){
            res.status(400).json({ success: false, msg: "Ticket is already Booked/Error Occured" });
        }
    }else{
        return res.status(200).json({ success: false, msg: "All slots booked" });
    }
});

// Updates the ticket timmings by id.
app.patch('/updateticket/:id', validateMongoId, async (req, res) => {
    let id = req.params.id;
    let newTimmings = req.body.timmings;
    try{
        let updatedTicket = await Ticket.findByIdAndUpdate(id, { startTime: newTimmings }, {new: true });
        if(updatedTicket === null){
            return res.status(404).json({ success: false, msg: "Ticket not found" });
        }
        return res.status(200).json({ success: true, data: updatedTicket });
    }catch(err){
        return res.status(400).json({ success: false, msg: "Error Occured" });
    }
});

// Lists all tickets at the specified time.
app.get('/alltickets/:time', async (req, res) => {
    let timmings = req.params.time;
    try{
        let tickets = await Ticket.getAllTickets(timmings);
        if(tickets === null || tickets.length === 0){
            return res.status(404).json({ success: false, msg: "No Tickets Found" });
        }else{
            return res.status(200).json({ success: true, data: tickets });
        }
    }catch(err){
        return res.status(400).json({ success: false, msg: "Error Occured" });
    }
});

// Deletes the ticket with the specified id.
app.delete('/deleteticket/:id', validateMongoId, async (req, res) => {
    let id = req.params.id;
    try{
        await Ticket.findByIdAndDelete(id);
        return res.status(200).json({ success: true, msg: "Ticket deleted." });
    }catch(err){
        return res.status(400).json({ success: false, msg: "Error Occured" });
    }
});

// Get user details by ticket id.
app.get('/userdetails/:id', validateMongoId, async (req,res) => {
    let ticketId = req.params.id;
    try{
        let data = await Ticket.getUserDetailsFromTicket(ticketId);
        if(data !== null && data !== undefined){
            return res.status(200).json({ success: true, data });
        }
        else{
            return res.status(404).json( {success: false, msg: "User not found" });
        }
    }catch(err){
        return res.status(400).json({ success: false, msg: "Error Occured"})
    }
})

mongoose.connect('mongodb://localhost:27017/zomentum');

let port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`)
});

module.exports = app;