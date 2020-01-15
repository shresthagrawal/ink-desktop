import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { readFileSync } from "fs";
import path from "path";
import { copySync, remove } from "fs-extra";
import { initInkFile } from "../lib/ink-file/ink-file";

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

// Test resource directory
const resDir = "./main/test/res";
// Tmp directory created as an exact copy of the res directory before test
const tmpDir = "./main/test/tmp";
const projectA = "project/a.als";
const inkJson = {
  "name": "A",
  "path": "/Users/shresthagrawal/Desktop/work/GitMusic/ink-electron/main/test/tmp/project",
  "remoteUrl": "",
  "tracks": []
} 

describe('Init', function() {
    describe ('Init Ink File', function() {
        before(async function() {
            // Create a copy of the sample files.
            // This is important as the parser modifies the origional file.
            copySync(resDir, tmpDir);
        });
        it('test', async function() {
            let projectDir = path.parse(path.resolve(tmpDir, projectA)).dir;
            initInkFile('A', projectDir, '');
            let inkRaw = readFileSync(path.join(projectDir, 'ink.json'));
            JSON.parse(inkRaw).should.eql(inkJson);
        });
        after(function() {
            // Cleanup after test
            remove(tmpDir);
        });

    });
});
