/* eslint-disable @typescript-eslint/no-unused-vars */

import { IRequestInfo } from '../../types';
import { IRequest, IResponse } from '../server/types';
import { IMockRequest, IMockRequestFactory } from './types';

export class MockRequest implements IMockRequest {
  matchRequest(request: IRequest): boolean {
    return;
  }
  handleResponse(response: IResponse): void {
    return;
  }
}

export class MockRequestFactory implements IMockRequestFactory {
  create(requestInfo: IRequestInfo): IMockRequest {
    return new MockRequest();
  }
}
