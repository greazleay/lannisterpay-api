export class AppError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);

        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name || "Application Error";
        this.message = message || "Something went wrong";
        this.status = status || 500;
    }
}