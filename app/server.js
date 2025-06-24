const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const rTracer = require('cls-rtracer');
const dotenv = require("dotenv");
const cron = require('node-cron');

// Load environment variables from .env file
dotenv.config();

const generalConfigs = require('../config/general-config')
const connectDB = require('../domain/db')
const logger = require('../domain/logs')
const publicRoutes = require('../routes/public')

// Cron job function that runs every 3 seconds
const runCronJob = () => {
    const timestamp = new Date().toISOString();
    console.log(`🕐 [CRON JOB] ${timestamp} - Server is running and healthy!`);
    logger.info(`Cron job executed at: ${timestamp}`);
};

const initializeServer = async(port) => {
  try {
    await connectDB();
    logger.info('Database connected successfully.');
    const server = express();
    
    // Start cron job that runs every 3 seconds
    // cron.schedule('*/10 * * * * *', () => {
    //     runCronJob();
    // }, {
    //     scheduled: true,
    //     timezone: "Asia/Kolkata"
    // });
    
    // console.log('⏰ Cron job started - running every 5 seconds');
    
    // Request tracing
    server.use(
      rTracer.expressMiddleware({
        useHeader: true,
        headerName: "debug-ref-id",
      })
    );

    // // CORS configuration
    // server.use(cors({
    //   origin: ['https://www.crewkraft.in']
    // }));
    server.use(cors({ origin: "*" }));

    // Rate limiting
    server.use(rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
    }));

    // Apply general rate limiting to all routes
    // server.use(generalLimiter);

    // Body parsers
    server.use(express.urlencoded({ extended: true, limit: '10mb' })); // Adjust limit as needed
    server.use(express.json({ limit: '10mb' })); // Adjust limit as needed
    server.use(express.text({ type: '*/xml' }));

    server.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
      next(); // Pass control to the next middleware
  });
    // Route handlers
    server.use("/api/v1/", publicRoutes);
    server.use("/api/v1/health", (req, res) => {
      res.status(200).json({ message: 'Server is running and healthy!' });
    });

    // Error handling middleware
    server.use((err, req, res, next) => {
      logger.error('Unhandled error:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    });

    // Start server
    server.listen(port, () =>
      console.log(`Server instance listening @port: ${port}`)
    );

    return server;

  } catch (err) {
    logger.error("Unable to initialize server:", err);
    process.exit(1); // Exit with failure code
  }
};

// Initialize server with configuration
module.exports = initializeServer(generalConfigs.serverPort || 3000);
