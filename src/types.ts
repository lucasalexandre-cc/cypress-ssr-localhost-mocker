export interface ISSRLocalhostMocker {
  init(...ports: number[]): Promise<void>;
  close(): Promise<void>;
}
