// Basic Error Boundary implementation

// Define some basic error codes
export const ErrorCodes = {
    UNKNOWN: 'UNKNOWN',
    API_REQUEST_FAILED: 'API_REQUEST_FAILED',
    INVALID_DATA_FORMAT: 'INVALID_DATA_FORMAT',
    // Add other specific error codes as needed
};

// Define a custom application error class
export class ApplicationError extends Error {
    constructor(message, code = ErrorCodes.UNKNOWN, details = {}) {
        super(message);
        this.name = 'ApplicationError';
        this.code = code;
        this.details = details;
        // Maintain proper stack trace (if available)
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ApplicationError);
        }
    }
}

// You could add a more sophisticated error boundary component/handler here
// if using a framework like React, or enhance the error handling logic.