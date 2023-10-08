import { IRequestInfo } from '../../types';

export interface ILocalhostServerFactory {
  create(port: number): ILocalhostServer;
}

export interface ILocalhostServer {
  init(): Promise<void>;
  close(): Promise<void>;
  getPort(): number;
  mockRequest(requestInfo: IRequestInfo): void;
  clearAllMocks(): void;
}

export interface IRequest {
  method: string;
  path: string;
  body: any;
  headers: any;
}

export interface IResponse {}
