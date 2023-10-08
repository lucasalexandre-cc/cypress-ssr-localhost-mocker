import { IRequestInfo } from '../../types';
import { IRequest, IResponse } from '../server/types';
import { IMockRequest } from './types';

export default class MockRequest implements IMockRequest {
  private requestInfo: IRequestInfo;

  constructor(requestInfo: IRequestInfo) {
    this.requestInfo = requestInfo;
  }

  matchRequest(request: IRequest): boolean {
    if (this.requestInfo.method !== request.method) return false;

    return true;
  }
  handleResponse(response: IResponse): void {
    // TODO: implement
  }
}
