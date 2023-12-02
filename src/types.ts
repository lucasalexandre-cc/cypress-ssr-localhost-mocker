export interface IMockBackendRequestParams {
  port: number;
  routeMock: IRequestInfo;
  fixturePath?: string;
}

export interface IRequestInfo {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  bodyCheckFn?: (body: any) => boolean;
  headerCheckFn?: (header: any) => boolean;
  response: {
    statusCode: number;
    body?: any;
    headers?: Record<string, string>;
  };
}

export interface ISSRLocalhostMocker {
  init(...ports: number[]): Promise<void>;
  close(): Promise<void>;
  getMockBackendRequest(): ({ port, fixturePath, routeMock }: IMockBackendRequestParams) => void;
  getClearAllMocks(): ({ port }: { port: number }) => void;
}
