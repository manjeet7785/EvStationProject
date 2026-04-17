const Express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const authRouter = require('./Router/AuthRouter');
const stationRouter = require('./Router/StationRouter');
const bookingRouter = require('./Router/BookingRouter');
const chatRouter = require('./Router/ChatRouter');
const adminRouter = require('./Router/AdminRouter');

const app = Express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://695b7b41948bf4afce44988c--unique-croissant-f5d379.netlify.app'
  ],
  credentials: true
}));

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/chat', chatRouter);
app.use('/api/auth', authRouter);
app.use('/api', stationRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/admin', adminRouter);


const Port = process.env.PORT || 4000;
const Mongo_URI = process.env.Mongo_URI;

app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});

async function main() {
  try {
    if (Mongo_URI) {
      await mongoose.connect(Mongo_URI);
      console.log('Connected to MongoDB');
    }
  } catch (error) {
    console.log(' MongoDB Connection Error:', error.message);
  }
}
main();
