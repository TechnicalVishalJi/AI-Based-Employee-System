const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Ensure dotenv.config() is called BEFORE using process.env.MONGO_URI
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Root endpoint for backend status
app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <title>PerfAI Backend</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; color: #1e293b; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                    .container { background: white; padding: 3rem; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); text-align: center; border-top: 4px solid #4f46e5; }
                    h1 { color: #4f46e5; margin-bottom: 0.5rem; }
                    p { color: #64748b; font-size: 1.1rem; }
                    .status { display: inline-block; padding: 0.25rem 0.75rem; background: #dcfce7; color: #166534; border-radius: 9999px; font-weight: 600; font-size: 0.875rem; margin-top: 1rem; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>🚀 PerfAI Backend API</h1>
                    <p>The system is operational and securely accepting requests.</p>
                    <div class="status">● Status: Active & Running</div>
                </div>
            </body>
        </html>
    `);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
