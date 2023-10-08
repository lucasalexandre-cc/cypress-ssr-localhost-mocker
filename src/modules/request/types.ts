import { IRequestInfo } from '../../types';
import { IRequest, IResponse } from '../server/types';

export interface IMockRequest {
  matchRequest(request: IRequest): boolean;
  handleResponse(response: IResponse): void;
}

export interface IMockRequestFactory {
  create(requestInfo: IRequestInfo): IMockRequest;
}
