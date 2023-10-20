import { UserIdToNamePipe } from './user-id-to-name.pipe';

describe('UserIdToNamePipe', () => {
  it('create an instance', () => {
    const pipe = new UserIdToNamePipe();
    expect(pipe).toBeTruthy();
  });
});
