import chai from 'chai';
import { generateRules } from '../lib/git/ignore';
import { ignoreRules, projectType } from '../lib/parser';

chai.should();
const { expect } = chai;

describe('git ignore utilities', function () {
  describe('generateRules()', function () {
    it('generate rules according to the .gitignore format', function () {
      const expected = ignoreRules[projectType.abletonLive].join('\n');
      expect(generateRules([projectType.abletonLive])).to.deep.equal(expected);
    });
  });
});
