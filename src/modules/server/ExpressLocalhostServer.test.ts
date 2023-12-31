/* eslint-disable @typescript-eslint/no-unused-vars */
import { Server } from 'http';
import { Request, Response } from 'express';
import { MockRequest, MockRequestFactory } from '../request/types-test-factory';
import ExpressLocalhostServer from './ExpressLocalhostServer';
import { IRequestInfo } from '../../types';

function mockExpressListen(port, callback) {
  callback();
  return {} as Server;
}

function createSut(port: number) {
  const mockRequestFactory = new MockRequestFactory();
  const sut = new ExpressLocalhostServer(port, mockRequestFactory);

  return {
    sut,
    mockRequestFactory,
  };
}

describe('ExpressLocalhostServer', () => {
  describe('init', () => {
    it('should call express listen with correct params', async () => {
      const { sut } = createSut(3000);
      const listenSpy = jest.spyOn(sut['app'], 'listen').mockImplementation(mockExpressListen);

      await sut.init();

      expect(listenSpy).toHaveBeenCalledTimes(1);
      expect(listenSpy).toHaveBeenCalledWith(3000, expect.any(Function));
    });

    it('should not call listen again if is called twice', async () => {
      const { sut } = createSut(3000);
      const listenSpy = jest.spyOn(sut['app'], 'listen').mockImplementation(mockExpressListen);

      await sut.init();

      expect(listenSpy).toHaveBeenCalledTimes(1);
      listenSpy.mockReset();

      await sut.init();

      expect(listenSpy).not.toHaveBeenCalled();
    });

    // I'll test the private method handleRequest, and assume that init method is deliverying the responsability to this method
    it('should return 404 if no mock request is matched', async () => {
      const { sut } = createSut(3000);
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
      const { sut } = createSut(3000);
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

  describe('close', () => {
    it('should do nothing if server is not on', async () => {
      const { sut } = createSut(3000);

      await sut.close();

      expect(sut['server']).toBeNull();
    });

    it('should call server close if server is on', async () => {
      const { sut } = createSut(3000);
      const closeFn = jest.fn().mockImplementation((callback) => {
        callback();
      });
      jest.spyOn(sut['app'], 'listen').mockImplementation((port, callback) => {
        callback();
        return { close: closeFn } as unknown as Server;
      });

      await sut.init();
      await sut.close();

      expect(closeFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('getPort', () => {
    it('should return port', () => {
      const { sut } = createSut(3000);

      const result = sut.getPort();

      expect(result).toBe(3000);
    });
  });

  describe('mockRequest', () => {
    it('should add mock request to mock requests array', () => {
      const { sut, mockRequestFactory } = createSut(3000);

      const mockRequestFactorySpy = jest.spyOn(mockRequestFactory, 'create');

      const requestInfo: IRequestInfo = { method: 'GET', path: '/', response: { statusCode: 200 } };
      sut.mockRequest(requestInfo);

      expect(mockRequestFactorySpy).toBeCalledWith(requestInfo);
      expect(sut['mockRequests']?.length).toBe(1);
    });
  });

  describe('clearAllMocks', () => {
    it('should empty mock request array', () => {
      const { sut } = createSut(3000);

      const requestInfo: IRequestInfo = { method: 'GET', path: '/', response: { statusCode: 200 } };
      sut.mockRequest(requestInfo);
      sut.mockRequest(requestInfo);
      sut.mockRequest(requestInfo);

      expect(sut['mockRequests']?.length).toBe(3);

      sut.clearAllMocks();

      expect(sut['mockRequests']?.length).toBe(0);
    });
  });
});
