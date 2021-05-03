import { HttpParams } from '@angular/common/http';
import { httpParams, flattenObject } from './http-params';

const randomDate = () => new Date(1581061520554 * Math.random());

describe('httpParams', () => {

  it('should created', () => {
    // arrange
    const params = {};
    // act
    const result = httpParams(params);
    // assert
    expect(result instanceof HttpParams).toBeTruthy();
  });

  it('should have numbers', () => {
    // arrange
    const params = {
      num1: 1,
      num2: 2,
    };
    // act
    const result = new HttpParams({ fromString: httpParams(params).toString() });
    // assert
    expect(result.get('num1')).toBe('1');
  });

  it('should have strings', () => {
    // arrange
    const p1 = '1';
    const p2 = 'Вася';
    const params = {
      p1,
      p2,
    };
    // act
    const result = new HttpParams({ fromString: httpParams(params).toString() });
    // assert
    expect(result.get('p1')).toBe(p1);
    expect(result.get('p2')).toBe(p2);
  });

  it('should have dates', () => {
    // arrange
    const date1 = randomDate();
    const date2 = randomDate();
    const params = {
      date1,
      date2,
    };
    // act
    const result = new HttpParams({ fromString: httpParams(params).toString() });
    // assert
    expect(result.get('date1')).toBe(date1.toISOString());
    expect(result.get('date2')).toBe(date2.toISOString());
  });

  describe('flattenObject', () => {
    it('simple', () => {
      const obj = { a: 1 };
      const result = flattenObject(obj);
      expect(result).toEqual([['a', 1]]);
    });

    it('with array', () => {
      const obj = { a: 1, b: ['1', 2] };
      const result = flattenObject(obj);
      expect(result).toEqual([['a', 1], ['b', ['1', 2]]]);
    });

    it('with undefined', () => {
      const obj = { a: 1, b: undefined };
      const result = flattenObject(obj);
      expect(result).toEqual([['a', 1]]);
    });

    it('with zero', () => {
      const obj = { a: 0 };
      const result = flattenObject(obj);
      expect(result).toEqual([['a', 0]]);
    });

    it('with null', () => {
      const obj = { a: 1, b: null };
      const result = flattenObject(obj);
      expect(result).toEqual([['a', 1], ['b', null]]);
    });

    it('with nested object', () => {
      const obj = {
        a: 1, b: {
          x: 2,
        }
      };
      const result = flattenObject(obj);
      expect(result).toEqual([['a', 1], ['b.x', 2]]);
    });

    it('with nested object and undefined', () => {
      const obj = {
        a: 1,
        b: {
          x: 2,
          z: undefined,
        }
      };
      const result = flattenObject(obj);
      expect(result).toEqual([['a', 1], ['b.x', 2]]);
    });

    it('with 2-x nested object', () => {
      const obj = {
        a: 1,
        b: {
          x: 2,
        },
        c: {
          x: 3,
          d: {
            y: 5,
          }
        }
      };
      const result = flattenObject(obj);
      expect(result).toEqual([
        ['a', 1],
        ['b.x', 2],
        ['c.x', 3],
        ['c.d.y', 5],
      ]);
    });

    it('with complex key', () => {
      const obj = { 'df-fd,x+k': 1 };
      const result = flattenObject(obj);
      expect(result).toEqual([['df-fd,x+k', 1]]);
    });

    it('with digital key', () => {
      const obj = { 1: 1 };
      const result = flattenObject(obj);
      expect(result).toEqual([['1', 1]]);
    });
  });

  describe('httpParams', () => {
    it('simple', () => {
      const obj = { a: 1 };
      const result = httpParams(obj).toString();
      expect(result).toBe('a=1');
    });

    it('with array', () => {
      const obj = { a: 1, b: ['1', 2] };
      const result = httpParams(obj).toString();
      expect(result).toBe('a=1&b=1&b=2');
    });

    it('with undefined', () => {
      const obj = { a: 1, b: undefined };
      const result = httpParams(obj).toString();
      expect(result).toBe('a=1');
    });

    it('with null', () => {
      const obj = { a: 1, b: null };
      const result = httpParams(obj).toString();
      expect(result).toBe('a=1&b=');
    });

    it('with nested object', () => {
      const obj = {
        a: 1, b: {
          x: 2,
        }
      };
      const result = httpParams(obj).toString();
      expect(result).toBe('a=1&b.x=2');
    });

    it('with nested object and undefined', () => {
      const obj = {
        a: 1,
        b: {
          x: 2,
          z: undefined,
        }
      };
      const result = httpParams(obj).toString();
      expect(result).toBe('a=1&b.x=2');
    });

    it('with 2-x nested object', () => {
      const obj = {
        a: 1,
        b: {
          x: 2,
        },
        c: {
          x: 3,
          d: {
            y: 5,
          }
        }
      };
      const result = httpParams(obj).toString();
      expect(result).toBe('a=1&b.x=2&c.x=3&c.d.y=5');
    });

    it('with complex key', () => {
      const obj = { 'df-fd,x+k': 1 };
      const result = httpParams(obj).toString();
      expect(result).toBe('df-fd,x+k=1');
    });

    it('with digital key', () => {
      const obj = { 1: 1 };
      const result = httpParams(obj).toString();
      expect(result).toBe('1=1');
    });
  });
});
