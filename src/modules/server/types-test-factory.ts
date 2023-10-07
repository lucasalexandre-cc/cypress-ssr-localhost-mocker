import { ILocalhostServerFactory, ILocalhostServer } from './types';

export class LocalhostServer implements ILocalhostServer {
  constructor(private port: number) {}

  async init(): Promise<void> {}
}

export class LocalhostServerFactory implements ILocalhostServerFactory {
  create(port: number): ILocalhostServer {
    return new LocalhostServer(port);
  }
}
