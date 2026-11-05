import { isValidGithubUsername } from './github-username.validator';

describe('isValidGithubUsername', () => {
  it('accepts alphanumeric-or-hyphen usernames and rejects empty or other characters', () => {
    expect(isValidGithubUsername('User-123')).toBeTrue();
    expect(isValidGithubUsername('')).toBeFalse();
    expect(isValidGithubUsername('john_doe')).toBeFalse();
    expect(isValidGithubUsername('john.doe')).toBeFalse();
    expect(isValidGithubUsername('john@doe')).toBeFalse();
    expect(isValidGithubUsername(' john')).toBeFalse();
  });
});
