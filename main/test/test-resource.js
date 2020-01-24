import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { readFileSync, existsSync } from "fs";
import path from "path";
import { copySync, remove } from "fs-extra";
import { manageResource } from "../../lib/resource";
import * as projectStore from '../../lib/store/project-store';
import { addProject } from "../../lib/project";

chai.use(chaiAsPromised);
chai.should();
const expect = chai.expect;

// Test resource directory
const resDir = "./main/test/res";
// Tmp directory created as an exact copy of the res directory before test
const tmpDir = "./main/test/tmp";

describe('Resource', function() {
    describe ('Manage Resource', function() {
        before(async function() {
            // Create a copy of the sample files.
            // This is important as the parser modifies the origional file.
            copySync(resDir, tmpDir);
            projectStore.init();
            await addProject(path.join(tmpDir, 'project/'))

        });
        it('When a new project is started', async function() {
            await manageResource('./main/test/tmp/project/');
            existsSync(path.join(tmpDir, 'project/resources')).should.eql(true);
        });
        after(function() {
            // Cleanup after test
            remove(tmpDir);
            projectStore.remove(path.join(tmpDir, 'project/'));
        });

    });
});
