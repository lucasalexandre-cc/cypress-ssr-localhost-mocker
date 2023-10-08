import { IRequestInfo } from '../../types';
import MockRequest from './MockRequest';
import { MatchPathTest } from '../../utils/types-test-factory';

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

      const request = { method: 'GET', path: '/', body: {} };
      const result = sut.matchRequest(request);

      expect(result).toBe(false);
    });

    it('should return false if match path returns false', () => {
      const requestInfo = generateDefaultRequestInfo();
      requestInfo.path = '/test';
      requestInfo.method = 'GET';

      const { sut, matchPath } = createSut(requestInfo);

      const matchPathSpy = jest.spyOn(matchPath, 'match').mockReturnValueOnce(false);

      const request = { method: 'GET', path: '/', body: {} };
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

      const request = { method: 'GET', path: '/test', body: { test: true } };
      const result = sut.matchRequest(request);

      expect(result).toBe(false);
      expect(bodyCheckFn).toHaveBeenCalledWith(request.body);
    });
  });
});
