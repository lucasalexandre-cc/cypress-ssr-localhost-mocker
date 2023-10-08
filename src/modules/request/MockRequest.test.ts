/* eslint-disable @typescript-eslint/no-unused-vars */
import { IRequestInfo } from '../../types';
import MockRequest from './MockRequest';
import { MatchPathTest } from '../../utils/types-test-factory';
import { IResponse } from '../server/types';

function createSut(requestInfo: IRequestInfo) {
  const matchPath = new MatchPathTest();
  const sut = new MockRequest(requestInfo, matchPath);
  return { sut, matchPath };
}

function generateDefaultRequestInfo(): IRequestInfo {
  return { method: 'GET', path: '/', response: { statusCode: 200 } };
}

describe('MockRequest', () => {
  describe('matchRequest', () => {
    it('should return false if request method is different', () => {
      const requestInfo = generateDefaultRequestInfo();
      requestInfo.method = 'POST';

      const { sut } = createSut(requestInfo);

      const request = { method: 'GET', path: '/', body: {}, headers: {} };
      const result = sut.matchRequest(request);

      expect(result).toBe(false);
    });

    it('should return false if match path returns false', () => {
      const requestInfo = generateDefaultRequestInfo();
      requestInfo.path = '/test';
      requestInfo.method = 'GET';

      const { sut, matchPath } = createSut(requestInfo);

      const matchPathSpy = jest.spyOn(matchPath, 'match').mockReturnValueOnce(false);

      const request = { method: 'GET', path: '/', body: {}, headers: {} };
      const result = sut.matchRequest(request);

      expect(matchPathSpy).toHaveBeenCalledWith('/test', '/');
      expect(result).toBe(false);
    });

    it('should return false if has body function and its return false', () => {
      const requestInfo = generateDefaultRequestInfo();
      requestInfo.path = '/test';
      requestInfo.method = 'GET';
      const bodyCheckFn = jest.fn().mockReturnValueOnce(false);
      requestInfo.bodyCheckFn = bodyCheckFn;

      const { sut, matchPath } = createSut(requestInfo);
      jest.spyOn(matchPath, 'match').mockReturnValueOnce(true);

      const request = { method: 'GET', path: '/test', body: { test: true }, headers: {} };
      const result = sut.matchRequest(request);

      expect(result).toBe(false);
      expect(bodyCheckFn).toHaveBeenCalledWith(request.body);
    });

    it('should return false if has header function and its return false', () => {
      const requestInfo = generateDefaultRequestInfo();
      requestInfo.path = '/test';
      requestInfo.method = 'GET';
      const headerCheckFn = jest.fn().mockReturnValueOnce(false);
      requestInfo.headerCheckFn = headerCheckFn;

      const { sut, matchPath } = createSut(requestInfo);
      jest.spyOn(matchPath, 'match').mockReturnValueOnce(true);

      const request = { method: 'GET', path: '/test', body: {}, headers: { test: true } };
      const result = sut.matchRequest(request);

      expect(result).toBe(false);
      expect(headerCheckFn).toHaveBeenCalledWith(request.headers);
    });

    it('should return true if has body fn check and returns true', () => {
      const requestInfo = generateDefaultRequestInfo();
      requestInfo.path = '/test';
      requestInfo.method = 'GET';
      requestInfo.bodyCheckFn = () => true;

      const { sut, matchPath } = createSut(requestInfo);
      jest.spyOn(matchPath, 'match').mockReturnValueOnce(true);

      const request = { method: 'GET', path: '/test', body: { test: true }, headers: {} };
      const result = sut.matchRequest(request);

      expect(result).toBe(true);
    });

    it('should return true if has header function and its return true', () => {
      const requestInfo = generateDefaultRequestInfo();
      requestInfo.path = '/test';
      requestInfo.method = 'GET';
      requestInfo.headerCheckFn = () => true;

      const { sut, matchPath } = createSut(requestInfo);
      jest.spyOn(matchPath, 'match').mockReturnValueOnce(true);

      const request = { method: 'GET', path: '/test', body: {}, headers: { test: true } };
      const result = sut.matchRequest(request);

      expect(result).toBe(true);
    });

    it('should return true if do not pass header and body checkers fn', () => {
      const requestInfo = generateDefaultRequestInfo();
      requestInfo.path = '/test';
      requestInfo.method = 'GET';

      const { sut, matchPath } = createSut(requestInfo);
      jest.spyOn(matchPath, 'match').mockReturnValueOnce(true);

      const request = { method: 'GET', path: '/test', body: {}, headers: {} };
      const result = sut.matchRequest(request);

      expect(result).toBe(true);
    });
  });

  describe('handleResponse', () => {
    it('should return response status code informed', () => {
      const requestInfo = generateDefaultRequestInfo();
      requestInfo.response.statusCode = 500;

      const { sut } = createSut(requestInfo);
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      const response: IResponse = {
        status: statusMock,
        json: jsonMock,
      };
      statusMock.mockReturnValue(response);

      sut.handleResponse(response);

      expect(response.status).toHaveBeenCalledWith(500);
    });

    it('should send empty hash on response body if not informed', () => {
      const requestInfo = generateDefaultRequestInfo();
      requestInfo.response.body = undefined;

      const { sut } = createSut(requestInfo);
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      const response: IResponse = {
        status: statusMock,
        json: jsonMock,
      };
      statusMock.mockReturnValue(response);

      sut.handleResponse(response);

      expect(jsonMock).toHaveBeenCalledWith({});
    });

    it('should send informed hash on response body if informed', () => {
      const requestInfo = generateDefaultRequestInfo();
      requestInfo.response.body = { test: true };

      const { sut } = createSut(requestInfo);
      const statusMock = jest.fn();
      const jsonMock = jest.fn();
      const response: IResponse = {
        status: statusMock,
        json: jsonMock,
      };
      statusMock.mockReturnValue(response);

      sut.handleResponse(response);

      expect(jsonMock).toHaveBeenCalledWith({ test: true });
    });
  });
});
