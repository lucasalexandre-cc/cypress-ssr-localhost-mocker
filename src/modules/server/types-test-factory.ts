import { ILocalhostServerFactory, ILocalhostServer } from './types';

export class LocalhostServer implements ILocalhostServer {
  constructor(private port: number) {
    this.port = port;
  }

  async init(): Promise<void> {}
  async close(): Promise<void> {}

  getPort(): number {
    return this.port;
  }
}

export class LocalhostServerFactory implements ILocalhostServerFactory {
  create(port: number): ILocalhostServer {
    return new LocalhostServer(port);
  }
}
