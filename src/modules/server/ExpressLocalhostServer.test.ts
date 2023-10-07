/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from 'express';
import { MockRequest } from '../request/types-test-factory';
import ExpressLocalhostServer from './ExpressLocalhostServer';

function mockExpressListen(port, callback) {
  callback();
  return null;
}

describe('ExpressLocalhostServer', () => {
  describe('init', () => {
    it('should call express listen with correct params', async () => {
      const sut = new ExpressLocalhostServer(3000);
      const listenSpy = jest.spyOn(sut['app'], 'listen').mockImplementation(mockExpressListen);

      await sut.init();

      expect(listenSpy).toHaveBeenCalledTimes(1);
      expect(listenSpy).toHaveBeenCalledWith(3000, expect.any(Function));
    });

    it('should set serverOn to true', async () => {
      const sut = new ExpressLocalhostServer(3000);
      jest.spyOn(sut['app'], 'listen').mockImplementation(mockExpressListen);
      expect(sut['serverOn']).toBeFalsy();

      await sut.init();

      expect(sut['serverOn']).toBeTruthy();
    });

    it('should not call listen again if is called twice', async () => {
      const sut = new ExpressLocalhostServer(3000);
      const listenSpy = jest.spyOn(sut['app'], 'listen').mockImplementation(mockExpressListen);

      await sut.init();

      expect(listenSpy).toHaveBeenCalledTimes(1);
      listenSpy.mockReset();

      await sut.init();

      expect(listenSpy).not.toHaveBeenCalled();
    });

    // I'll test the private method handleRequest, and assume that init method is deliverying the responsability to this method
    it('should return 404 if no mock request is matched', async () => {
      const sut = new ExpressLocalhostServer(3000);
      jest.spyOn(sut['app'], 'listen').mockImplementation(mockExpressListen);

      await sut.init();

      const mockRequest01 = new MockRequest();
      const mockRequest02 = new MockRequest();
      const matchRequestSpy1 = jest.spyOn(mockRequest01, 'matchRequest').mockReturnValue(false);
      const matchRequestSpy2 = jest.spyOn(mockRequest02, 'matchRequest').mockReturnValue(false);
      sut['mockRequests'] = [mockRequest01, mockRequest02];

      const req = { url: '/test' } as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;

      sut['handleRequest']('GET', req, res);

      expect(matchRequestSpy1).toHaveBeenCalledWith(req);
      expect(matchRequestSpy2).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('should call handleResponse if mock request is matched', async () => {
      const sut = new ExpressLocalhostServer(3000);
      jest.spyOn(sut['app'], 'listen').mockImplementation(mockExpressListen);

      await sut.init();

      const mockRequest01 = new MockRequest();
      const mockRequest02 = new MockRequest();
      jest.spyOn(mockRequest01, 'matchRequest').mockReturnValue(true);
      jest.spyOn(mockRequest02, 'matchRequest').mockReturnValue(true);
      const handleResponseSpy01 = jest.spyOn(mockRequest01, 'handleResponse').mockImplementation(() => {});
      const handleResponseSpy02 = jest.spyOn(mockRequest02, 'handleResponse').mockImplementation(() => {});
      sut['mockRequests'] = [mockRequest01, mockRequest02];

      const req = { url: '/test' } as Request;
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() } as unknown as Response;

      sut['handleRequest']('GET', req, res);

      expect(handleResponseSpy01).toHaveBeenCalledTimes(1);
      expect(handleResponseSpy01).toHaveBeenCalledWith(res);
      expect(handleResponseSpy02).not.toHaveBeenCalled();
    });
  });
});
