// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it } from 'vitest';
import { block as createBlock, mapArray } from '../packages/million';
import type { VElement } from '../packages/million';
import { MillionProps } from 'packages/types';

const fn = (props?: MillionProps): VElement => (
  <div>
    <h1>Hello</h1> World
    <p title="baz" className={props?.bar}>
      {props?.foo}
    </p>
  </div>
);

describe.concurrent('block', () => {
  it('should mount block', ({ expect }) => {
    const parent = document.createElement('div');
    const block = createBlock(fn);
    const arr = mapArray([block({ foo: 'foo', bar: 'bar' })]);
    arr.m(parent);
    expect(arr.t()).toEqual(parent);
  });
  it('should patch block', ({ expect }) => {
    const parent = document.createElement('div');
    const block = createBlock(fn);
    const arr = mapArray([block({ foo: 'foo', bar: 'bar' })]);
    arr.m(parent);
    arr.p(mapArray([block({ foo: 'bar', bar: 'foo' })]));
    expect(arr.t()?.outerHTML).toEqual(
      '<div><div><h1>Hello</h1> World<p title="baz" class="foo">bar</p></div></div>',
    );
    arr.p(
      mapArray([
        block({ foo: 'bar', bar: 'foo' }),
        block({ foo: 'bar', bar: 'foo' }),
      ]),
    );
    expect(arr.t()?.outerHTML).toEqual(
      '<div><div><h1>Hello</h1> World<p title="baz" class="foo">bar</p></div><div><h1>Hello</h1> World<p title="baz" class="foo">bar</p></div></div>',
    );
    arr.p(mapArray([]));
    expect(arr.t()?.outerHTML).toEqual('<div></div>');
  });
  it('should remove fragment', ({ expect }) => {
    const parent = document.createElement('div');
    const block = createBlock(fn);
    const arr = mapArray([block({ foo: 'foo', bar: 'bar' })]);
    arr.m(parent);
    arr.x();
    expect(arr.b).toEqual([]);
  });
});
