import { IRequest, IResponse } from '../server/types';

export interface IMockRequest {
  matchRequest(request: IRequest): boolean;
  handleResponse(response: IResponse): void;
}
