import { expect, test } from 'vitest';

type F = ()=>string;

const m = new Map<string,F>();

class User {
  name:string;
}

test('test', () => {
  const u = new User();
  u.name = 'test';
  const f = () => {
    console.log(u.name);
    return u.name;
  }
  m.set('test', f);
  u.name = 'test2';
  const f2 = m.get('test')!;
  expect(f2()).toBe('test2');
});
