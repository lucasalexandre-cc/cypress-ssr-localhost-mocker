/* eslint-disable @typescript-eslint/no-unused-vars */

import { IRequest, IResponse } from '../server/types';
import { IMockRequest } from './types';

export class MockRequest implements IMockRequest {
  matchRequest(request: IRequest): boolean {
    return;
  }
  handleResponse(response: IResponse): void {
    return;
  }
}
