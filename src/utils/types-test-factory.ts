/* eslint-disable @typescript-eslint/no-unused-vars */
import { IMatchPath } from './types';

export class MatchPathTest implements IMatchPath {
  match(pathBase: string, pathToCheck: string): boolean {
    return true;
  }
}
