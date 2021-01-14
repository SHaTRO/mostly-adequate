
import { hi, hello } from './greetings';

describe(`first class functions`, () => {
  it(`a simple "Hi"`, () => {
    expect(hi('Jane')).toEqual('Hi, Jane');
  });

  it(`a simple hello`, () => {
    expect(hello('Jane')).toEqual('Hello, Jane');
  });

  it(`a simple greeting`, () => {
    let greeting = hi;
    expect(greeting('Jane')).toEqual('Hi, Jane');
    greeting = hello;
    expect(greeting('Jane')).toEqual('Hello, Jane');
  });
});

describe(`getting ahead of ourselves`, () => {
  it(`higher order`, () => {
    // similar to the "httpGet" example in the book
    const greet = (name: string, f: (n: string) => string) => f(name);
    expect(greet('Jill', hi)).toEqual('Hi, Jill');
    expect(greet('Jill', hello)).toEqual('Hello, Jill');
  });

  it(`currying first order`, () => {
    // const greet = (name: string, f: (n: string) => string) => f(name);
    const greet = (name: string) => (f: (n: string) => string) => f(name);
    expect(greet('Jill')(hi)).toEqual('Hi, Jill');
    expect(greet('Jill')(hello)).toEqual('Hello, Jill');
    // curry the first order functions
    const greetJill = greet('Jill');
    expect(greetJill(hi)).toEqual('Hi, Jill');
    expect(greetJill(hello)).toEqual('Hello, Jill');
  });
});
