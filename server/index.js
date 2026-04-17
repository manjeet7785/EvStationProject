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
const Port = process.env.PORT || 4000;
const Mongo_URI = process.env.Mongo_URI;
let isDbConnected = false;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://695b7b41948bf4afce44988c--unique-croissant-f5d379.netlify.app',
  process.env.CLIENT_URL
].filter(Boolean);

const isVercelPreview = (origin) => /https:\/\/.*\.vercel\.app$/i.test(origin || '');

const connectDB = async () => {
  if (isDbConnected) return;
  if (!Mongo_URI) {
    throw new Error('Mongo_URI is missing in environment variables');
  }

  await mongoose.connect(Mongo_URI);
  isDbConnected = true;
  console.log('Congratulations Connected to MongoDB');
};


app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || isVercelPreview(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error('CORS blocked for this origin'));
  },
  credentials: true
}));

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.log('MongoDB Connection Error:', error.message);
    res.status(500).json({ message: 'Database connection failed' });
  }
});


app.use('/api/chat', chatRouter);
app.use('/api/auth', authRouter);
app.use('/api', stationRouter);
app.use('/api/bookings', bookingRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => {
  res.status(200).json({ ok: true, message: 'Backend is running' });
});

if (require.main === module) {
  app.listen(Port, async () => {
    try {
      await connectDB();
    } catch (error) {
      console.log('MongoDB Connection Error:', error.message);
    }
    console.log(`Server running on port ${Port}`);
  });
}

module.exports = app;
