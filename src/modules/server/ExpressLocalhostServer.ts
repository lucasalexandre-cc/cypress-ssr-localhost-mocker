import { Server } from 'http';
import express, { Express, Request, Response } from 'express';

import { IRequestInfo } from '../../types';
import { ILocalhostServer } from './types';
import { IMockRequest, IMockRequestFactory } from '../request/types';

const methods = ['GET', 'POST', 'PUT', 'DELETE'];

export default class ExpressLocalhostServer implements ILocalhostServer {
  private server: Server | null = null;
  private app: Express;
  private mockRequests: IMockRequest[] = [];

  constructor(
    private port: number,
    private mockRequestFactory: IMockRequestFactory,
  ) {
    this.port = port;
    this.app = express();
  }

  init(): Promise<void> {
    if (this.server) return;

    for (const method of methods) {
      this.app[method.toLowerCase()]('*', (req, res) => {
        this.handleRequest(method, req, res);
      });
    }

    return new Promise((resolve) => {
      this.server = this.app.listen(this.port, () => {
        resolve();
      });
    });
  }

  close(): Promise<void> {
    return new Promise((resolve) => {
      if (this.server) {
        this.server.close(() => {
          console.log(`server closed on port ${this.port}`);
          this.server = null;
          resolve();
        });
      } else resolve();
    });
  }

  getPort(): number {
    return this.port;
  }

  mockRequest(requestInfo: IRequestInfo): void {
    const mockRequest = this.mockRequestFactory.create(requestInfo);
    this.mockRequests.push(mockRequest);
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
