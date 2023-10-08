import MockRequestFactory from '../request/MockRequestFactory';
import ExpressLocalhostServer from './ExpressLocalhostServer';
import { ILocalhostServerFactory } from './types';

export default class ExpressLocalhostServerFacory implements ILocalhostServerFactory {
  create(port: number): any {
    const mockRequestFactory = new MockRequestFactory();
    return new ExpressLocalhostServer(port, mockRequestFactory);
  }
}
