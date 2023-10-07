import express, { Express, Request, Response } from 'express';

import { IRequestInfo } from '../../types';
import { ILocalhostServer } from './types';
import { IMockRequest } from '../request/types';

const methods = ['GET', 'POST', 'PUT', 'DELETE'];

export default class ExpressLocalhostServer implements ILocalhostServer {
  private serverOn: boolean = false;
  private app: Express;
  private mockRequests: IMockRequest[] = [];

  constructor(private port: number) {
    this.port = port;
    this.app = express();
  }

  init(): Promise<void> {
    if (this.serverOn) return;

    for (const method of methods) {
      this.app[method.toLowerCase()]('*', (req, res) => {
        this.handleRequest(method, req, res);
      });
    }

    return new Promise((resolve) => {
      this.app.listen(this.port, () => {
        this.serverOn = true;
        resolve();
      });
    });
  }

  close(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getPort(): number {
    throw new Error('Method not implemented.');
  }

  mockRequest(requestInfo: IRequestInfo): void {
    throw new Error('Method not implemented.');
  }

  clearAllMocks(): void {
    throw new Error('Method not implemented.');
  }

  private handleRequest(method: string, req: Request, res: Response) {
    const mockRequest = this.mockRequests.find((mockRequest) => mockRequest.matchRequest(req));

    if (!mockRequest) {
      res.status(404).send();
      return;
    }

    mockRequest.handleResponse(res);
  }
}
