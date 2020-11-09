const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const notifier = require('node-notifier');

const SEVERITY_INFO = 'info';
const SEVERITY_WARNING = 'warning';
const SEVERITY_ERROR = 'error';

const basePath = path.resolve(__dirname, '..');  // C:\Dev\invia

console.log('basePath:', basePath);

const watchedDirs = [
   'web',
   'library'
];

const nfsDriveLetter = 'Z';

const getCurrentDirName = () => {
    const i = __dirname.lastIndexOf(path.sep);
    return __dirname.substr(i >= 0 ? i + 1 : 0);
};

let watcherReady = false;
let watchedFilesCount = 0;

const watchOptions = {
    cwd: basePath,
    ignored: ['**/.git/**', '**/node_modules/**', '**/.idea/**', 'web/assets/*/src/**', 'web/cache/**'],
    followSymlinks: false
};

const watcher = chokidar.watch(watchedDirs, watchOptions);
watcher.on('ready', () => {
    watcherReady = true;
    const msg = `Initial scan complete! Watching ${ Intl.NumberFormat().format(watchedFilesCount)} files.`;
    console.log(msg);
    notify(msg, SEVERITY_INFO);
});

watcher.on('all', (event, winRelPath) => {
    try {
        const winPath = path.resolve(basePath, winRelPath);
        console.log(event, winPath);

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

            case 'unlink':
            case 'unlinkDir':
                deleteFile(event, destPath);
                break;

            default:
                const msg = `Unsupported event '${event}'`;
                console.warn(msg);
                notify(msg, SEVERITY_WARNING);
                break;
        }
    }
    catch (err) {
        console.error(err);
        notify('Error: ' + err.toString(), SEVERITY_ERROR);
    }
});

const copyFile = (srcPath, destPath) => {
	fs.copyFile(srcPath, destPath, (err) => {
		if (err) {
            throw new Error(`File '${srcPath}' copy error: + ${err}`);
        } else {
            const msg = `File '${srcPath}' copied OK`;
            console.log(msg);
            //notify(msg, SEVERITY_INFO);
        }
	});
};

const deleteFile = (event, filename) => {
	fs.unlink(filename, (err) => {
		if (err) {
			throw new Error(`File '${filename}' delete error: ${err}`);
		} else {
			const msg = `${event} '${filename}'`;
			console.log(msg);
			//notify(msg, SEVERITY_INFO);
		}
	});
};

const notify = (msg, severity) => {
	severity = severity !== undefined ? severity : SEVERITY_INFO;

	const options = {
        title: 'invia-repo-sync',
        message: msg,
        icon: path.join(__dirname, 'invia-logo.png'),
        wait: false,
        //sound: 'ms-winsoundevent:Notification.Default',
        sound: severity !== SEVERITY_INFO,
    };

    // notifier.notify(options);
	// new notifier.NotificationCenter(options).notify();
	// new notifier.NotifySend(options).notify();
	// new notifier.WindowsToaster(options).notify(options);
	new notifier.WindowsBalloon(options).notify(options);
	// new notifier.Growl(options).notify(options);
};
