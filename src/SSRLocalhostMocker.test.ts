import { LocalhostServerFactory } from './modules/server/types-test-factory';
import SSRLocalhostMocker from './SSRLocalhostMocker';

function createSut() {
  const localhostServerFactory = new LocalhostServerFactory();
  const sut = new SSRLocalhostMocker(localhostServerFactory);

  return {
    sut,
    localhostServerFactory,
  };
}

describe('SSRLocalhostMocker', () => {
  describe('init', () => {
    it('should create localhost servers if never create before', async () => {
      const { sut, localhostServerFactory } = createSut();

      const initSpy = jest.spyOn(localhostServerFactory, 'create');

      await sut.init(3000, 3001);

      expect(initSpy).toHaveBeenCalledTimes(2);
      expect(initSpy).toHaveBeenCalledWith(3000);
      expect(initSpy).toHaveBeenCalledWith(3001);
    });
  });
});