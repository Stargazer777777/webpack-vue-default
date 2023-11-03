import axios, { AxiosError } from 'axios';
import type { AxiosRequestConfig } from 'axios';

export interface BkResponse<DataType = any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: DataType;
  msg: string;
  success: boolean;
}

export interface BkErrorResponse extends BkResponse {
  detail: string;
}

export interface HttpOption {
  noAlert?: true;
}

export class BkError extends Error {
  response: BkErrorResponse;
  constructor(bkErrorResponse: BkErrorResponse) {
    super();
    super.name = 'BkError';
    super.message = bkErrorResponse.msg || 'UnknownError';
    super.cause = bkErrorResponse.detail;
    this.response = bkErrorResponse;
  }
}

type ErrorHandleFunction = () => void;

class HttpTool {
  protected httpInstance = axios.create();

  constructor(baseUrl?: string) {
    if (baseUrl) {
      this.setBaseUrl(baseUrl);
    }
  }

  setBaseUrl(baseUrl: string) {
    this.httpInstance.defaults.baseURL = baseUrl;
  }

  setAuthorization(Authorization: string) {
    this.httpInstance.defaults.headers.common['Authorization'] = Authorization;
  }

  removeAuthorization() {
    delete this.httpInstance.defaults.headers.common['Authorization'];
  }

  protected getErrorResponse(err: AxiosError): BkErrorResponse {
    let errorResponse: BkErrorResponse = {
      data: null,
      detail: 'none',
      msg: 'UnknownError',
      success: false,
    };

    if (err.response?.data) {
      errorResponse = err.response.data as BkErrorResponse;
    }
    return errorResponse;
  }

  protected genBkError(errResponse: BkErrorResponse): BkError {
    const bkError = new BkError(errResponse);
    return bkError;
  }

  protected errHandler(err: AxiosError, httpOption?: HttpOption) {
    const statusCode = err.response?.status || 555;
    const errorResponse = this.getErrorResponse(err);
    const bkError = this.genBkError(errorResponse);

    switch (statusCode) {
      case 401:
        break;
      case 403:
        break;
      default:
        break;
    }

    if (!httpOption?.noAlert) {
      alert(errorResponse.msg);
    }
    throw bkError;
  }

  async send<DataType = any>(
    config: AxiosRequestConfig,
    httpOption?: HttpOption
  ): Promise<BkResponse> {
    try {
      const axiosResponse = await this.httpInstance<BkResponse>(config);
      return axiosResponse.data as BkResponse<DataType>;
    } catch (err) {
      if (err instanceof AxiosError) {
        throw this.errHandler(err, httpOption);
      } else {
        throw err;
      }
    }
  }
}

export const httpTool = new HttpTool(import.meta.env['HTTP_BASE']);
