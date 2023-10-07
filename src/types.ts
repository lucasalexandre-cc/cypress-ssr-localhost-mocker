export interface ISSRLocalhostMocker {
  init(...ports: number[]): Promise<void>;
}
