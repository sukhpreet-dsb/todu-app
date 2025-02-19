export type RespType = ISuccessResponse | IErrorResponse;

interface ISuccessResponse {
  success: true;
  successMessage?: string;
  data?: any;
}

interface IErrorResponse {
  success: false;
  stack?: any;
  errorMessage: string;
}
