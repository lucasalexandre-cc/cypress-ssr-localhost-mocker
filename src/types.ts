export interface IRequestInfo {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  bodyCheckFn?: (body: any) => boolean;
  headers?: Record<string, string>;
  response: {
    statusCode: number;
    body?: string;
    headers?: Record<string, string>;
  };
}

export interface ISSRLocalhostMocker {
  init(...ports: number[]): Promise<void>;
  close(): Promise<void>;
  mockRequest(port: number, requestInfo: IRequestInfo): void;
  clearAllMocks(port: number): void;
}
