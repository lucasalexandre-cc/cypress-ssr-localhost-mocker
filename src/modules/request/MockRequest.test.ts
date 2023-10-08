import { IRequestInfo } from '../../types';
import MockRequest from './MockRequest';

function createSut(requestInfo: IRequestInfo) {
  const sut = new MockRequest(requestInfo);
  return { sut };
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

      const request = { method: 'GET' };
      const result = sut.matchRequest(request);

      expect(result).toBe(false);
    });
  });
});
