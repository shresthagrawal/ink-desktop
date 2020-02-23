import chokidar from 'chokidar';
import { getById } from './store/project-store';

export class ProjectWatcher {
    constructor(projectId, onChange) {
        console.log(projectId, onChange);
        this.project = getById(projectId);
        this.watcher = chokidar.watch(this.project.path);
        this.watcher.on('change', (events, dir) => {
            onChange();
        });
    }
    static async watch(projectId, onChange) {
        if (!this.instances[projectId]) {
            let watcher = new ProjectWatcher(projectId, onChange);
            this.instances[projectId] = watcher;
        }
        return this.instances[projectId];
    }
    static async unwatchAll() {
        console.log(this.instances);
        this.instances.forEach(async (_, watcher) => {
            await watcher.close();
        });
    }
}

ProjectWatcher.instances = {};
