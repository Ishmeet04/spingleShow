import express from 'express';
import { createBooking, getoccupiedSeats } from '../Control/Bookingscontrol.js';
import { requireAuth } from '@clerk/express';

const bookingRouter = express.Router();

bookingRouter.post('/create', requireAuth(), createBooking);
bookingRouter.get('/seats/:showId', getoccupiedSeats);

export default bookingRouter;