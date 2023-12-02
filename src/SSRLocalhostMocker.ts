import fs from 'fs';
import { IMockBackendRequestParams, IRequestInfo, ISSRLocalhostMocker } from './types';
import { ILocalhostServer, ILocalhostServerFactory } from './modules/server/types';

export default class SSRLocalhostMocker implements ISSRLocalhostMocker {
  private servers: ILocalhostServer[];

  constructor(private localhostServerFactory: ILocalhostServerFactory) {}

  async init(...ports: number[]): Promise<void> {
    this.validatePorts(ports);

    if (!this.servers) {
      this.servers = ports.map((port) => this.localhostServerFactory.create(port));
    }

    const promies = this.servers.map((server) => server.init());
    await Promise.all(promies);
  }

  async close(): Promise<void> {
    if (!this.servers) throw new Error('SSRLocalhostMocker: trying to close without init');

    const promises = this.servers.map((server) => server.close());
    await Promise.all(promises);
  }

  getMockBackendRequest() {
    return ({ port, fixturePath, routeMock }: IMockBackendRequestParams) => {
      if (fixturePath) {
        const responseData = fs.readFileSync(`./cypress/fixtures/${fixturePath}.json`, 'utf8');
        routeMock.response.body = JSON.parse(responseData);
      }

      this.mockRequest(port, routeMock);
      return null;
    };
  }

  getClearAllMocks(): ({ port }: { port: number }) => void {
    return ({ port }: { port: number }) => {
      this.clearAllMocks(port);
      return null;
    };
  }

  private mockRequest(port: number, requestInfo: IRequestInfo): void {
    const server = this.servers?.find((server) => server.getPort() === port);
    if (!server) throw new Error('SSRLocalhostMocker: trying to mock request to a non initialized server');

    server.mockRequest(requestInfo);
  }

  private clearAllMocks(port: number): void {
    const server = this.servers?.find((server) => server.getPort() === port);
    if (!server) throw new Error('SSRLocalhostMocker: trying to clear all mock request from a non initialized server');

    server.clearAllMocks();
  }

  private validatePorts(ports: number[]): void {
    if (this.servers) {
      const portsAreDifferent = this.servers.some((server) => !ports.includes(server.getPort()));
      if (portsAreDifferent) throw new Error('SSRLocalhostMocker: trying to init with different ports');
    }

    const portsAreDuplicated = ports.some((port, index) => ports.indexOf(port) !== index);
    if (portsAreDuplicated) throw new Error('SSRLocalhostMocker: trying to init with duplicated ports');
  }
}
