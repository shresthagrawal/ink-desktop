import chokidar from 'chokidar';
import createDebug from 'debug';
import { getById } from './store/project-store';

createDebug.enable('ProjectWatcher*');
const debug = createDebug('ProjectWatcher');

export class ProjectWatcher {
    constructor(projectId, onChange) {
        console.log(projectId, onChange);
        this.project = getById(projectId);
        this.watcher = chokidar.watch(this.project.path);
        debug('Watching', this.project.path);
        this.watcher.on('change', (dir) => {
            debug('Project Changed', dir);
            onChange();
        });
    }
    static async watch(projectId, onChange) {
        let watcher = new ProjectWatcher(projectId, onChange);
        this.instances.push(watcher);
        return watcher;
    }
    static async unwatchAll() {
        console.log(this.instances);
        this.instances.forEach(async (watcher) => {
            await watcher.close();
            debug('Unwatch', watcher);
        });
    }
}

ProjectWatcher.instances = [];
