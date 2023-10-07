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
    it('should just create localhost servers if never create before', async () => {
      const { sut, localhostServerFactory } = createSut();

      const initSpy = jest.spyOn(localhostServerFactory, 'create');

      await sut.init(3000, 3001);

      expect(initSpy).toHaveBeenCalledTimes(2);
      expect(initSpy).toHaveBeenCalledWith(3000);
      expect(initSpy).toHaveBeenCalledWith(3001);

      initSpy.mockReset();

      await sut.init(3000, 3001);

      expect(initSpy).not.toHaveBeenCalled();
    });

    it('should throw if try to init with different ports', async () => {
      const { sut } = createSut();

      await sut.init(3000, 3001);

      await expect(sut.init(3000, 3002)).rejects.toThrowError('SSRLocalhostMocker: trying to init with different ports');
    });

    it('should throw if try to init with duplicated ports', async () => {
      const { sut } = createSut();

      await expect(sut.init(3000, 3000)).rejects.toThrowError('SSRLocalhostMocker: trying to init with duplicated ports');
    });
  });
});
