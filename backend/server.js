const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/diabetes_management', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define Mongoose schema and model
const GlucoseReadingSchema = new mongoose.Schema({
  Pregnancies: Number,
  Glucose: Number,
  BloodPressure: Number,
  SkinThickness: Number,
  Insulin: Number,
  BMI: Number,
  DiabetesPedigreeFunction: Number,
  Age: Number,
  Outcome: Number,
  
});
const GlucoseReading = mongoose.model('GlucoseReading', GlucoseReadingSchema);

// Endpoint to add a new reading
app.post('/api/readings', async (req, res) => {
  try {
    const newReading = new GlucoseReading(req.body);
    await newReading.save();
    res.status(201).json(newReading);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Endpoint to get all readings
app.get('/api/readings', async (req, res) => {
  try {
    const readings = await GlucoseReading.find().sort('-date');
    res.json(readings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
