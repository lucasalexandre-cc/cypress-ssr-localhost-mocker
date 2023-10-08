import MatchPath from './MatchPath';

describe('MatchPath', () => {
  it('should return false if path is a normal string and different', () => {
    const sut = new MatchPath();

    const result = sut.match('/test', '/test2');

    expect(result).toBe(false);
  });

  it('should return true if path is a normal string and equal', () => {
    const sut = new MatchPath();

    const result = sut.match('/test', '/test');

    expect(result).toBe(true);
  });

  it('should return false if path is a regex string and different', () => {
    const sut = new MatchPath();

    const result = sut.match('/test/.*/test', '/test/any/test2');

    expect(result).toBe(false);
  });

  it('should return true if path is a regex string and equal', () => {
    const sut = new MatchPath();

    const result = sut.match('/test/.*/test', '/test/any/test');

    expect(result).toBe(true);
  });
});
