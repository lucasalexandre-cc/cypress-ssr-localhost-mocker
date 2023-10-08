import { IRequestInfo } from '../../types';
import MatchPath from '../../utils/MatchPath';
import MockRequest from './MockRequest';
import { IMockRequest, IMockRequestFactory } from './types';

export default class MockRequestFactory implements IMockRequestFactory {
  create(requestInfo: IRequestInfo): IMockRequest {
    const matchPath = new MatchPath();
    return new MockRequest(requestInfo, matchPath);
  }
}
