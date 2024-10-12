import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import your CSS file

const InputField = ({ name, value, onChange }) => (
  <div className="input-group">
    <label htmlFor={name}>{name}</label>
    <input
      type="number"
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={name}
      required
    />
  </div>
);

function App() {
  const [readings, setReadings] = useState([]);
  const [newReading, setNewReading] = useState({
    Pregnancies: '',
    Glucose: '',
    BloodPressure: '',
    SkinThickness: '',
    Insulin: '',
    BMI: '',
    DiabetesPedigreeFunction: '',
    Age: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/readings');
      setReadings(response.data);
    } catch (error) {
      console.error('Error fetching readings:', error);
      setError('Failed to fetch readings. Please try again later.');
    }
  };

  const handleInputChange = (e) => {
    setNewReading({ ...newReading, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/readings', newReading);
      setNewReading({
        Pregnancies: '',
        Glucose: '',
        BloodPressure: '',
        SkinThickness: '',
        Insulin: '',
        BMI: '',
        DiabetesPedigreeFunction: '',
        Age: ''
      });
      fetchReadings();
    } catch (error) {
      console.error('Error adding reading:', error);
      setError('Failed to add reading. Please try again.');
    }
  };

  return (
    <div className="App">
      <h1>Diabetes data input </h1>
      
      <div className="card">
        <h2>Enter New Reading</h2>
        <form onSubmit={handleSubmit}>
          {Object.keys(newReading).map((key) => (
            <InputField
              key={key}
              name={key}
              value={newReading[key]}
              onChange={handleInputChange}
            />
          ))}
          <button type="submit" className="submit-btn">Add Reading</button>
        </form>
      </div>

      {error && (
        <div className="alert alert-danger">
          <h3>Error</h3>
          <p>{error}</p>
        </div>
      )}

      <div className="card reading-history">
        <h2>Reading History</h2>
        <ul>
          {readings.map((reading) => (
            <li key={reading._id}>
              {Object.entries(reading).map(([key, value]) =>
                key !== '_id' && key !== '__v' ? `${key}: ${value}, ` : ''
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
