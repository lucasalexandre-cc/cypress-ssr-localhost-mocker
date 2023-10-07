import { LocalhostServerFactory, LocalhostServer } from './modules/server/types-test-factory';
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

    it('should initialize all servers', async () => {
      const { sut, localhostServerFactory } = createSut();
      const localhostServer3000 = new LocalhostServer(3000);
      const localhostServer3001 = new LocalhostServer(3001);

      jest.spyOn(localhostServerFactory, 'create').mockReturnValueOnce(localhostServer3000).mockReturnValueOnce(localhostServer3001);

      const initSpy3000 = jest.spyOn(localhostServer3000, 'init');
      const initSpy3001 = jest.spyOn(localhostServer3001, 'init');

      await sut.init(3000, 3001);

      expect(initSpy3000).toHaveBeenCalledTimes(1);
      expect(initSpy3001).toHaveBeenCalledTimes(1);

      initSpy3000.mockReset();
      initSpy3001.mockReset();

      await sut.init(3000, 3001);

      expect(initSpy3000).toHaveBeenCalled();
      expect(initSpy3001).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should throw if try to close without init', async () => {
      const { sut } = createSut();

      await expect(sut.close()).rejects.toThrowError('SSRLocalhostMocker: trying to close without init');
    });
  });
});
