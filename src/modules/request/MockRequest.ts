import { IRequestInfo } from '../../types';
import { IMatchPath } from '../../utils/types';
import { IRequest, IResponse } from '../server/types';
import { IMockRequest } from './types';

export default class MockRequest implements IMockRequest {
  private requestInfo: IRequestInfo;
  private matchPath: IMatchPath;

  constructor(requestInfo: IRequestInfo, matchPath: IMatchPath) {
    this.requestInfo = requestInfo;
    this.matchPath = matchPath;
  }

  matchRequest(request: IRequest): boolean {
    if (this.requestInfo.method !== request.method) return false;
    if (!this.matchPath.match(this.requestInfo.path, request.path)) return false;

    return true;
  }

  handleResponse(response: IResponse): void {
    // TODO: implement
  }
}
