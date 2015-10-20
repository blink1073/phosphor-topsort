/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';


import expect = require('expect.js');

import {
  TopSort
} from '../../lib/index';


// from stackoverflow:
// http://stackoverflow.com/questions/3115982/how-to-check-if-two-arrays-are-equal-with-javascript
function arraysEqual(a: any[], b: any[]): boolean {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}


describe('phosphor-topsort', () => {

  describe('topSort', () => {

    it('should correctly order a simple array', () => {
      var data = [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'd'],
        ['d', 'e']
      ];

      var ts = new TopSort(data);
      var result = ts.sort();
      var expected  = ['a','b','c','d','e'];

      expect(arraysEqual(result, expected)).to.be(true);

    });

    it('should correctly order with shuffled inputs', () => {
      var data = [
        ['d', 'e'],
        ['c', 'd'],
        ['a', 'b'],
        ['c', 'e'],
        ['b', 'c']
      ];

      var ts = new TopSort(data);
      var result = ts.sort();
      var expected = ['a','b','c','d','e'];

      expect(arraysEqual(result, expected)).to.be(true);

    });

    it('should return an approximate order when a cycle is present', () => {
      var data = [
        ['a', 'b'],
        ['b', 'c'],
        ['c', 'd'],
        ['c', 'b'],
        ['d', 'e']
      ];

      var ts = new TopSort(data);
      var result = ts.sort();

      expect(result.indexOf('a')).to.be(0);
      expect(result.indexOf('e')).to.be(4);
      expect(result.indexOf('b')).to.be
        .greaterThan(0)
        .lessThan(4);
      expect(result.indexOf('c')).to.be
        .greaterThan(0)
        .lessThan(4);
      expect(result.indexOf('d')).to.be
        .greaterThan(0)
        .lessThan(4);

    });

    it('should return a valid order in an under-constrained system', () => {
      var data = [
        ['a', 'b'],
        ['a', 'c'],
        ['a', 'd'],
        ['a', 'e']
      ];

      var ts = new TopSort(data);
      var result = ts.sort();

      expect(result.indexOf('a')).to.be(0);
      expect(result.indexOf('b')).to.be.greaterThan(0);
      expect(result.indexOf('c')).to.be.greaterThan(0);
      expect(result.indexOf('d')).to.be.greaterThan(0);
      expect(result.indexOf('e')).to.be.greaterThan(0);

    });

  });

});
