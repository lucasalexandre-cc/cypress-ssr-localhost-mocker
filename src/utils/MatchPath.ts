import { IMatchPath } from './types';

export default class MatchPath implements IMatchPath {
  match(pathBase: string, pathToCheck: string): boolean {
    const regexPattern = new RegExp(pathBase + '$');

    return regexPattern.test(pathToCheck);
  }
}
