const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const nodemailer = require('nodemailer');
const { ObjectId } = require('mongodb');

const formatDate = (date) => {
    const dateAmOrPm = date.getHours() / 12 >= 1 ? 'PM' : 'AM';

    let dateHour = date.getHours();
    if (dateHour === 0) dateHour = 12;
    else if (dateHour > 12) dateHour -= 12;

    let dateSecond = date.getSeconds().toString();
    if (dateSecond.length === 1) dateSecond = '0' + dateSecond;

    let dateMinute = date.getMinutes().toString();
    if (dateMinute.length === 1) dateMinute = '0' + dateMinute;

    return `${date.getFullYear()}/${date.getMonth()+1}/${date.getDate()+1} at ${dateHour}:${dateMinute}:${dateSecond} ${dateAmOrPm}`;
}

// @route GET /api/scheduling/listAppointments
// @desc Get a list of appointments for a trainer
// @access Public
router.post('/listAppointments', async (req, res) => {
    // Get the access token from the header
    const { authorization } = req.headers;
    const accessToken = authorization.split(' ')[1];
  
    let session = await Session.findOne({ accessToken: accessToken });
    // Check if a session with this trainer exists
    if (!session) {
        let err = 'Could not find the given accessToken!';
        res.status(401).json(err);
        return;
    }

    let email = session.email;
    const user = await User.findOne({ email: email });
    // Check if user exists
    if (!user) {
        let err = 'Could not find the given email!';
        res.status(401).send(err);
        return;
    }    


    const { profileId, isTrainer, filterStartTime, filterEndTime } = req.body;
console.log(profileId);
    // Build the filters for the appointments
    let filters = {};
    if (profileId) {
        const trainerProfile = await UserProfile.findById(profileId);
        // Check if trainer exists
        if (!trainerProfile) {
            let err = 'Could not find the given profileId!';
            res.status(401).send(err);
            return;
        }    
console.log(trainerProfile);
console.log(trainerProfile.muscleMassGoal);
console.log(trainerProfile.heightInches);
console.log(trainerProfile.gender);
console.log(trainerProfile.userId);
// filters.trainerId = trainerProfile.userId;
// console.log(filters.trainerId);
}
    if (isTrainer === 'true') {
        filters.trainerId = user._id.toString();
        // filters.customerId = {  $ne: '', };
    }
    else if (isTrainer === 'false') {
        filters.customerEmail = user.email;
    }
    if (filterStartTime && filterEndTime) {
        filters.startTime = {
            $gt: filterStartTime, 
            $lt: filterEndTime
        };
    }
    else if (filterStartTime) {
        filters.startTime = {
            $gt: filterStartTime
        };
    }
    console.log(filters);

    const appointments = await Appointment.find(filters);
    // console.log(appointments);
    // Check for an error
    if (!appointments) {
        let err = `Error finding appointments for ${email}!`;
        res.status(401).send(err);
        return;
    }

    res.status(200).json(appointments);
});

// Returns an error if the request body does not follow the restrictions below
const validateOpenAppointmentsRequest = async (req, trainerProfileId) => {
    const { timestamps, title, description, duration } = req.body;

    if (!timestamps) return 'You must pass an array of times!'
    if (!title) return 'You must pass a title!'
    if (!duration) return 'You must pass a duration!'


    if (timestamps.length%2 !== 0)
        return 'Each appointmentTime must have a matching endDay!';

    for (let i = 0; i < timestamps.length; i += 2) {
        const appointmentTimeDate = new Date(Number.parseInt(timestamps[i]));
        const endDayDate = new Date(Number.parseInt(timestamps[i+1]));

        if (!(endDayDate.getMinutes() !== 0 || endDayDate.getMinutes() !== 30) || endDayDate.getSeconds() !== 0)
            return 'endDay must have a time of XX:00:00 XM or XX:30:00 XM.';
        if (endDayDate.getHours() !== appointmentTimeDate.getHours() 
            || endDayDate.getMinutes() !== appointmentTimeDate.getMinutes()
            || endDayDate.getSeconds() !== appointmentTimeDate.getSeconds())
            return 'appointmentTime must have a time of XX:00:00 XM or XX:30:00 XM.'
        if (!(appointmentTimeDate <= endDayDate))
            return 'appointmentTime must be before endDay.'
        if (appointmentTimeDate.getDay() !== endDayDate.getDay())
            return 'appointmentTimeDate must be the same day of the week as endDayDate.'

        let appointmentExistsAlready = await Appointment.findOne({ trainerProfileId, startTime: appointmentTimeDate.getTime()});
        if (appointmentExistsAlready)
            return `The following appointments already exists: ${appointmentTimeDate}`
    }
}

// Returns an error if the request body does not follow the restrictions below
const createAppointmentsList = (trainerProfileId, req) => {
    const { timestamps, title, description, duration } = req.body;

    let appointmentsToOpen = [];
    for (let i = 0; i < timestamps.length; i += 2) {
        const appointmentTimeDate = new Date(Number.parseInt(timestamps[i]));
        const endDayDate = new Date(Number.parseInt(timestamps[i+1]));

        
        while (appointmentTimeDate < endDayDate) {
            appointmentsToOpen.push(new Appointment({
                title: title,
                description: description,
                duration: duration,
                trainerProfileId: trainerProfileId,
                startTime: appointmentTimeDate.getTime(),
                meetingLink: `https://zoom.us/j/${Math.floor(Math.random() * 99999999999)}`
            }));
            appointmentTimeDate.setDate(appointmentTimeDate.getDate() + 7);
        }
    }

    return appointmentsToOpen;
}

// @route POST /api/scheduling/openAppointments
// @desc Open a series of recurring appointments for scheduling
// @access Public
/*
    Request:
        - authorization: 'Bearer {accessToken}'
        - times: an array of unix timestamp pairs where even indecies are appointmentTimes, and odd indicies are the corresponding
                    endDays. 
            + endDay: A unix time in milliseconds representing the last date (excluded) in the series. 
                        This must have the same hours, minutes, and time as appointmentTime and must have a time of XX:00:00 XM or
                        XX:30:00 XM. 
            + appointmentTime: A unix time in milliseconds representing the appointment start time for the series of appointments.
                        This must have the same hours, minutes, and time as endDay and must have a time of XX:00:00 XM or
                        XX:30:00 XM. 
*/
router.post('/openAppointments', async (req, res) => {
    // Get the access token from the header
    const { authorization } = req.headers;
    const accessToken = authorization.split(' ')[1];
  
    let session = await Session.findOne({ accessToken: accessToken });
    // Check if a session with this trainer exists
    if (!session) {
        let err = 'Could not find the given accessToken!';
        res.status(401).json(err);
        return;
    }

    let email = session.email;
    
    const trainer = await User.findOne({ email });
    // Check if trainer exists and if they are a trainer
    if (!trainer) {
        let err = 'Could not find the given email!';
        res.status(401).send(err);
        return;
    }
    // Check if trainer is a trainer
    if (trainer.role !== 'trainer') {
        let err = 'You must be a trainer to open appointments!';
        res.status(401).send(err);
        return;
    }
    
    // Validate the requested appointments
    const validationErr = await validateOpenAppointmentsRequest(req, trainer.profile);
    if (validationErr) {
        let err = validationErr;
        res.status(401).send(err);
        return;
    }

    
    let appointmentsToOpen = createAppointmentsList(trainer.profile, req);

    let savedAppointments = await Appointment.insertMany(appointmentsToOpen);
    if(!savedAppointments) {
        let err = 'Could not save appointments to the database!';
        res.status(401).send(err);
        return;
    }

    res.status(200).json(savedAppointments);
});

// @route POST /api/scheduling/deleteAppointment
// @desc Remove an appointment from the database
// @access Public
router.post('/deleteAppointment', async (req, res) => {
    // Get the access token from the header
    const { authorization } = req.headers;
    const accessToken = authorization.split(' ')[1];
  
    let session = await Session.findOne({ accessToken: accessToken });
    // Check if a session with this trainer exists
    if (!session) {
        let err = 'Could not find the given accessToken!';
        res.status(401).json(err);
        return;
    }

    let email = session.email;
    const { appointmentId } = req.body; // get appointmentId from body
    
    const user = await User.findOne({ email: email });
    // Check if user exists
    if (!user) {
        let err = 'Could not find the given email!';
        res.status(401).send(err);
        return;
    }
    if (user.role !== 'trainer') {        
      let err = 'You must be a trainer to delete appointments!';
      res.status(401).send(err);
      return;
    }

    // Find the appointment to delete
    const deletedAppointment = await Appointment.findByIdAndDelete(appointmentId).exec();
    if (!deletedAppointment) {
        let err = 'Could not find the requested appointment!';
        res.status(401).send(err);
        return;
    }

    // Email the customer if the appointment was booked
    if (deletedAppointment.customerId) {
        const customer = await User.findOne({ _id: deletedAppointment.customerId });
        // Check if customer exists
        if (!customer)
            return;

        // async process from here to endif
        
        // Create a SMTP transporter to send mail to the trainer
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: `${process.env.SCHEDULING_EMAIL_ADDRESS}`,
                pass: `${process.env.SCHEDULING_EMAIL_PASSWORD}`
            }
        });

        // Configure the email
        const mailOptions = {
            from: `${process.env.SCHEDULING_EMAIL_ADDRESS}`,
            to: customer.email,
            subject: 'Appointment Cancellation',
            text:
            `Dear ${customer.name},\n\nYou are receiving this because ${user.name} canceled your appointment for`
            + ` ${formatDate(new Date(deletedAppointment.startTime))}. Please note you will need to`
            + ` schedule a new appointment with ${user.name} because of this cancellation.\n\n`
            + `Sincerely,\nThe Fitocity Team`
        };

        // Send the eamil
        transporter.sendMail(mailOptions, (err) => {
            if (err)
                console.error(err);
        });
    }


    res.status(200).json(deletedAppointment);
});

// @route POST /api/scheduling/cancelAppointment
// @desc Un-books a user from the requested appointment
// @access Public
router.post('/cancelAppointment', async (req, res) => {
    // Get the access token from the header
    const { authorization } = req.headers;
    const accessToken = authorization.split(' ')[1];
  
    let session = await Session.findOne({ accessToken: accessToken });
    // Check if a session with this trainer exists
    if (!session) {
        let err = 'Could not find the given accessToken!';
        res.status(401).json(err);
        return;
    }

    let email = session.email;
    const { appointmentId } = req.body; // get appointmentId from body
    
    const user = await User.findOne({ email: email });
    // Check if user exists
    if (!user) {
        let err = 'Could not find the given email!';
        res.status(401).send(err);
        return;
    }
    // Check if user is a user
    if (user.role !== 'user') {
        let err = 'You must be a user to cancel an appointment!';
        res.status(401).send(err);
        return;
    }


    const updateQuery = {
        customerId: '',
        customerEmail: ''
    };
    const canceledAppointment = await Appointment.findByIdAndUpdate(appointmentId, updateQuery).exec();
    if (!canceledAppointment) {
        let err = 'Could not find the requested appointment!';
        res.status(401).send(err);
        return;
    }

    // Email the trainer
    const trainer = await User.findOne({ _id: canceledAppointment.trainerId });
    // Check if trainer exists
    if (!trainer)
        return;

    // async process from here to endif
    
    // Create a SMTP transporter to send mail to the trainer
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: `${process.env.SCHEDULING_EMAIL_ADDRESS}`,
            pass: `${process.env.SCHEDULING_EMAIL_PASSWORD}`
        }
    });

    console.log(trainer.email);
    // Configure the email
    const mailOptions = {
        from: `${process.env.SCHEDULING_EMAIL_ADDRESS}`,
        to: trainer.email,
        subject: 'Appointment Cancellation',
        text:
        `Dear ${trainer.name},\n\nYou are receiving this because ${user.name} canceled their appointment for`
        + ` ${formatDate(new Date(canceledAppointment.startTime))}.\n\n`
        + `Sincerely,\nThe Fitocity Team`
    };

    // Send the eamil
    // transporter.sendMail(mailOptions, (err) => {
    //     if (err)
    //         console.error(err);
    // });

console.log(canceledAppointment);
    res.status(200).json(canceledAppointment);
});

// @route POST /api/scheduling/bookAppointment
// @desc Register a user for an appointment with a trainer
/*
  Request:
      - authorization: 'Bearer {accessToken}'
      - appointmentId: the id of the appointment
*/
// @access Public
router.post('/bookAppointment', async (req, res) => {
  // Get the access token from the header
  const { authorization } = req.headers;
  const accessToken = authorization.split(' ')[1];

  let session = await Session.findOne({ accessToken: accessToken });
  // Check if a session with this trainer exists
  if (!session) {
      let err = 'Could not find the given accessToken!';
      res.status(401).json(err);
      return;
  }

  let email = session.email;
  const { appointmentId } = req.body; // get startTime from body
  
  const user = await User.findOne({ email });
  // Check if user exists
  if (!user) {
      let err = 'Could not find the given email!';
      res.status(401).send(err);
      return;
  }
  // Check if user is a user
  if (user.role !== 'user') {
      let err = 'You must be a user to book appointments!';
      res.status(401).send(err);
      return;
  }
  

  let appointment = await Appointment.findById(appointmentId).exec();
  if (!appointment) {
    console.log(appointment);
      let err = 'Could not find the requested appointment!';
      res.status(401).send(err);
      return;
  }
  // Check if the appointment is already booked
  if (appointment.customerId !== '') {
      let err = 'The requested appointment has already been booked!';
      res.status(401).send(err);
      return;
  }

  // Change the customerId of the appointment (i.e. book the appointment)
  appointment.customerId = user._id;
  appointment.customerEmail = user.email;
  await appointment.save();

  res.status(200).json(appointment);
});

module.exports = router;

