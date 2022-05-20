import { AbstractToFormControlPipe } from './abstract-to-form-control.pipe';

describe('AbstractToFormControlPipe', () => {
  it('create an instance', () => {
    const pipe = new AbstractToFormControlPipe();
    expect(pipe).toBeTruthy();
  });
});
