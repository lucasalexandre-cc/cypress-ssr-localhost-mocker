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

    const promies = this.servers.map((server) => server.init());
    await Promise.all(promies);
  }

  async close(): Promise<void> {
    if (!this.servers) throw new Error('SSRLocalhostMocker: trying to close without init');

    return;
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
