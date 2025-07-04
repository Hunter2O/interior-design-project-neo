// 📦 Updated Express Server with Nodemailer Email Sending Support
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/interior_designing', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ----- MODELS -----
const SignupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/
  },
  message: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Signup = mongoose.model('Signup', SignupSchema);

const ContactSchema = new mongoose.Schema({
  email: { type: String, required: true, match: /.+\@.+\..+/ },
  phone: { type: String, required: true },
  items: [
    {
      name: String,
      price: Number,
      quantity: Number
    }
  ],
  totalCost: { type: Number, required: true },
  submittedAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', ContactSchema);

const SelectionSchema = new mongoose.Schema({
  room: String,
  design: String,
  cost: Number
});
const Selection = mongoose.model('Selection', SelectionSchema);

// ----- Nodemailer Setup -----
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false  // ✅ Allow self-signed certs in dev
  }
});

// ----- ROUTES -----

app.get('/api/budget', async (req, res) => {
  try {
    const selections = await Selection.find();
    res.json(selections);
  } catch (err) {
    console.error('❌ GET /api/budget error:', err.message);
    res.status(500).json({ message: 'Error fetching budget data' });
  }
});

app.post('/api/select', async (req, res) => {
  const { room, design, cost } = req.body;

  if (!room || !design || typeof cost !== 'number') {
    return res.status(400).json({ message: 'Invalid selection data' });
  }

  try {
    await Selection.findOneAndUpdate(
      { room },
      { design, cost },
      { upsert: true, new: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('❌ POST /api/select error:', err.message);
    res.status(500).json({ message: 'Error saving selection' });
  }
});

// 🔹 Contact + Email Invoice
app.post('/api/submit', async (req, res) => {
  const { email, phone, items, totalCost } = req.body;

  if (!email || !phone || !Array.isArray(items) || typeof totalCost !== 'number') {
    return res.status(400).json({ message: 'Missing or invalid fields' });
  }

  try {
    const contact = new Contact({ email, phone, items, totalCost });
    const saved = await contact.save();
    console.log('✅ Contact saved:', saved);

    const itemsList = items
      .map(item => `<li>${item.name} ×${item.quantity} — ₹${item.price * item.quantity}</li>`)
      .join('');

    const invoiceHtml = `
      <h2>Thank you for your payment!</h2>
      <p>Here’s your invoice summary:</p>
      <ul>${itemsList}</ul>
      <p><strong>Total:</strong> ₹${totalCost}</p>
      <p>If you have questions, contact us at <a href="mailto:support@interiorsplanner.com">support@interiorsplanner.com</a></p>
    `;

    await transporter.sendMail({
      from: `"Interior Planner" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Interior Design Invoice',
      html: invoiceHtml
    });

    res.status(200).json({ message: 'Details submitted & email sent successfully' });
  } catch (err) {
    console.error('❌ POST /api/submit error:', err.message);
    res.status(500).json({ message: 'Failed to save contact or send email', error: err.message });
  }
});

// 🔹 Signup endpoint
app.post('/api/signup', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  try {
    const newSignup = new Signup({ name, email, message });
    const saved = await newSignup.save();
    console.log('✅ Signup saved:', saved);
    res.status(200).json({ message: 'Signup successful' });
  } catch (err) {
    console.error('❌ POST /api/signup error:', err.message);
    res.status(500).json({ message: 'Failed to submit signup' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
