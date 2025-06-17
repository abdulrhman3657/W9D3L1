import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import logger from './utils/logger';
import { dev, port } from './utils/helpers';
import listRoutes from './routes/list.routes';
import itemRoutes from './routes/item.routes';
import { OK, INTERNAL_SERVER_ERROR } from './utils/http-status';

// Load environment variables
dotenv.config();

const app: Express = express();

// Middleware

// allows a web page to access restricted resources from a server
app.use(cors());

// protect response headers
app.use(helmet());

// HTTP request logger
app.use(morgan('tiny', { stream: {write: (message) => logger.info(message.trim()) } }));

// convert req.body from text to json
app.use(express.json());

// parse URL-encoded form data in req.body
app.use(express.urlencoded({ extended: true }));

// list router
app.use('/api/lists', listRoutes);
// item router
app.use('/api/lists/:listId/items', itemRoutes);

// Basic route
app.get('/', (req: Request, res: Response) => {
  // display success json message to the user
  res.status(OK).json({ message: 'List & Items API - Welcome!' });
});

// Basic error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error:', err.message);
  res
    .status(INTERNAL_SERVER_ERROR)
    .json({
      success: false,
      message: 'Something went wrong!',
      error: dev ? err.message : undefined
    });
});

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
