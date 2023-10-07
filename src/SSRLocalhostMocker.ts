import { ISSRLocalhostMocker } from './types';
import { ILocalhostServer, ILocalhostServerFactory } from './modules/server/types';

export default class SSRLocalhostMocker implements ISSRLocalhostMocker {
  private servers: ILocalhostServer[];

  constructor(private localhostServerFactory: ILocalhostServerFactory) {}

  async init(...ports: number[]): Promise<void> {
    console.log(ports);
    // TODO: implement logic
  }
}
