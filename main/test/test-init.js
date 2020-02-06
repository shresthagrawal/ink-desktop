import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { readFileSync } from 'fs';
import path from 'path';
import { copySync, remove } from 'fs-extra';
import { initInkFile } from '../../lib/ink-file';

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

// Test resource directory
const resDir = './main/test/res';
// Tmp directory created as an exact copy of the res directory before test
const tmpDir = './main/test/tmp';
const inkJson = {
  name: 'A',
  remoteUrl: '',
  tracks: [],
};

describe('Init', function() {
  describe('Init Ink File', function() {
    before(async function() {
      // Create a copy of the sample files.
      // This is important as the parser modifies the origional file.
      copySync(resDir, tmpDir);
    });
    it('Create Ink file when Path of the project is given', async function() {
      initInkFile('A', './main/test/tmp/project', '');
      let inkRaw = readFileSync('./main/test/tmp/project/ink.json');
      JSON.parse(inkRaw).should.eql(inkJson);
    });
    after(function() {
      // Cleanup after test
      remove(tmpDir);
    });
  });
});
