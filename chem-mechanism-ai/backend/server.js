const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const reactionRoutes = require('./routes/reactionRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
}));

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'ChemMechanism AI backend is running',
  });
});

app.use('/api/reactions', reactionRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found — ${req.originalUrl}`,
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
