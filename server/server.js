import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import contactRoutes from './routes/contact.js';
import householdRoutes from './routes/households.js';
import consultationRoutes from './routes/consultations.js';
import assistanceRoutes from './routes/assistances.js';
import weatherRoutes from './routes/weather.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Connection
connectDB();

// Middleware
app.use(cors({
  origin: ["http://localhost:5177", "http://localhost:5176", "http://localhost:5175", "http://localhost:5174", "http://localhost:5173", "http://127.0.0.1:5177", "http://127.0.0.1:5176", "http://127.0.0.1:5175"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve uploaded images
import path from 'path';
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Solar Aid API is running' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is healthy',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/households', householdRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/assistances', assistanceRoutes);
app.use('/api/weather', weatherRoutes);
// Admin routes (users, consultations, products management)
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
