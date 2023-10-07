import { ISSRLocalhostMocker } from './types';
import { ILocalhostServer, ILocalhostServerFactory } from './modules/server/types';

export default class SSRLocalhostMocker implements ISSRLocalhostMocker {
  private servers: ILocalhostServer[];

  constructor(private localhostServerFactory: ILocalhostServerFactory) {}

  async init(...ports: number[]): Promise<void> {
    this.validatePorts(ports);

    if (!this.servers) {
      this.servers = ports.map((port) => this.localhostServerFactory.create(port));
    }
  }

  private validatePorts(ports: number[]): void {
    if (this.servers) {
      const portsAreDifferent = this.servers.some((server) => !ports.includes(server.getPort()));
      if (portsAreDifferent) throw new Error('SSRLocalhostMocker: trying to init with different ports');
    }
  }
}
