export interface ILocalhostServerFactory {
  create(port: number): ILocalhostServer;
}

export interface ILocalhostServer {
  init(): Promise<void>;
  close(): Promise<void>;
  getPort(): number;
}
