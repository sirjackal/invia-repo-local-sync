const chokidar = require('chokidar');
const path = require('path');
const { consoleLog, consoleWarn, consoleError, notify, SEVERITY_INFO, SEVERITY_WARNING, SEVERITY_ERROR } = require('./console');
const { copyFile, createDirectory, deleteFile, deleteDirectory } = require('./file-operations');
const { watchedDirs, ignored, nfsDriveLetter } = require('./config');

const basePath = path.resolve(__dirname, '..');  // C:\Dev\invia
consoleLog('basePath:', basePath);

let watcherReady = false;
let watchedFilesCount = 0;

const watchOptions = {
    cwd: basePath,
    ignored: ignored,
    followSymlinks: false
};

console.time('initialScan');
const watcher = chokidar.watch(watchedDirs, watchOptions);

watcher.on('ready', () => {
    watcherReady = true;
    const msg = `Initial scan complete! Watching ${ Intl.NumberFormat().format(watchedFilesCount)} files.`;
    consoleLog(msg);
    console.timeEnd('initialScan')
    notify(msg, SEVERITY_INFO);
});

watcher.on('all', (event, winRelPath) => {
    try {
        const winPath = path.resolve(basePath, winRelPath);
        consoleLog(event, winPath);

        if (event === 'add') {
        	watchedFilesCount++;
        }

        if (!watcherReady) {
            return;
        }

        const destPath = `${nfsDriveLetter}:\\${winRelPath}`;

        switch (event) {
            case 'add':
            case 'change':
                copyFile(winPath, destPath);
                break;

            case 'addDir':
            	createDirectory(destPath);
            	break;

            case 'unlink':
            	deleteFile(destPath);
            	break;

            case 'unlinkDir':
                deleteDirectory(destPath);
                break;

            default:
                const msg = `Unsupported event '${event}'`;
                consoleWarn(msg);
                notify(msg, SEVERITY_WARNING);
                break;
        }
    }
    catch (err) {
        consoleError(err);
        notify('Error: ' + err.toString(), SEVERITY_ERROR);
    }
});
