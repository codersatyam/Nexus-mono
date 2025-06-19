const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const rTracer = require('cls-rtracer');
const dotenv = require("dotenv");
const generalConfigs = require('../config/general-config')
const connectDB = require('../domain/db')
const logger = require('../domain/logs')
const publicRoutes = require('../routes/public')



const initializeServer = async(port) => {
  try {
    await connectDB();
    logger.info('Database connected successfully.');
    const server = express();
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
