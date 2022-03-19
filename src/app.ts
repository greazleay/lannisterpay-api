import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import morgan from "morgan";
import cors, { CorsOptions } from "cors"
import helmet from "helmet";
import compression from "compression";

import initDB from "@configs/database";
import apiRouter from "@src/routes/v1/api";
import indexRouter from "@routes/index";

// Initialize DB
initDB();

const app = express();
const whitelist = ['http://localhost:3000', 'https://api-lnpy.herokuapp.com'];
const corsOptions: CorsOptions = {
    credentials: true,
    methods: ['GET', 'DELETE', 'OPTIONS', 'POST', 'PUT'],
    origin: (requestOrigin: string | undefined, callback) => {
        if (whitelist.indexOf(requestOrigin as string) !== -1 || !requestOrigin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};

app.use(morgan('dev'));
app.use(express.json({ limit: '16mb' }));
app.use(express.urlencoded({ limit: '16mb', extended: true }));
app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());

app.use('/', indexRouter);
app.use('/v1', apiRouter);

// Handle 404 errors
app.use((req: Request, res: Response, next) => {
    next(createHttpError(404, 'The requested resource was not found on this server!!!'));
});

// Error handler
app.use((err: { status: number; message: any; toString: () => any; }, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({ error: err.message || err.toString() });
})

export default app;
