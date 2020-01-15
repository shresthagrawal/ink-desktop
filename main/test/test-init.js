import assert from "mocha";
import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { copySync, remove } from "fs-extra";
import path from "path";

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

// Test resource directory
const resDir = "./main/test/res";
// Tmp directory created as an exact copy of the res directory before test
const tmpDir = "./main/test/tmp";

const projectA = "resource-test/project/a.als";

describe('Init', function() {
    describe ('Create Project', function() {
        before(async function() {
            // Create a copy of the sample files.
            // This is important as the parser modifies the origional file.
            copySync(resDir, tmpDir);
        });
        it('test', async function() {
            (1).should.eql(1);
        });
        after(function() {
            // Cleanup after test
            remove(tmpDir);
        });

    });
});
