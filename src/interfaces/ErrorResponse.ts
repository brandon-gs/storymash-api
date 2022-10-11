import MessageResponse from "./MessageResponse";

export interface DefaultError extends MessageResponse {
  stack?: string;
}

export type DataValidationError = {
  validationErrors: Array<{
    path: (string | number)[];
    fieldname: string | number;
    message: string;
  }>;
};

type ErrorResponse = DefaultError | DataValidationError;

export default ErrorResponse;
