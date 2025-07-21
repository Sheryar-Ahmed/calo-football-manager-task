import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import routes from './routes';
import { allowedOrigins } from './constants/allowed-origins';

dotenv.config();

const app = express();
const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
};
// Middleware
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// Global error handler
// app.use(errorHandler);

export default app;
