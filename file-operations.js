const path = require('path');
const fs = require('fs');
const { consoleError, consoleLog, consoleWarn, notify } = require('./console');

const createDirectory = (dirname) => {
	fs.mkdir(dirname, { recursive: true }, (err) => {
		if (err) {
			consoleError('createDirectory error', err);
			notify('Error: ' + err.toString(), SEVERITY_ERROR);
		} else {
			const msg = `Directory '${dirname}' created OK`;
			consoleLog(msg);
		}
	});
};

const copyFile = async (srcPath, destPath) => {
	await fs.mkdir(path.dirname(destPath), { recursive: true }, (err) => {
		if (err) {
			consoleError('copyFile error', err);
			notify('Error: ' + err.toString(), SEVERITY_ERROR);
		}
	});

	fs.copyFile(srcPath, destPath, (err) => {
		if (err) {
			//throw new Error(`File '${srcPath}' copy error: + ${err}`);
			consoleError('copyFile error', err);
			notify('Error: ' + err.toString(), SEVERITY_ERROR);
		} else {
			const msg = `File '${srcPath}' copied OK`;
			consoleLog(msg);
			//notify(msg, SEVERITY_INFO);
		}
	});
};

const deleteFile = async (filename) => {
	try {
		await fs.access(filename, fs.constants.W_OK);
	} catch (err) {
		consoleWarn(`File '${filename}' doesn't exist, so it can't be deleted`);
		return;
	}

	fs.unlink(filename, (err) => {
		if (err) {
			//throw new Error(`File '${filename}' delete error: ${err}`);
			consoleError('deleteFile error', err);
			notify('Error: ' + err.toString(), SEVERITY_ERROR);
		} else {
			const msg = `File '${filename}' deleted OK`;
			consoleLog(msg);
			//notify(msg, SEVERITY_INFO);
		}
	});
};

const deleteDirectory = async (dirname) => {
	try {
		await fs.access(dirname, fs.constants.W_OK);
	} catch (err) {
		consoleWarn(`Directory '${dirname}' doesn't exist, so it can't be deleted`);
		return;
	}

	fs.rmdir(dirname, { recursive: true }, (err) => {
		if (err) {
			//throw new Error(`File '${filename}' delete error: ${err}`);
			consoleError('deleteDirectory error', err);
			notify('Error: ' + err.toString(), SEVERITY_ERROR);
		} else {
			const msg = `Directory '${dirname}' deleted OK`;
			consoleLog(msg);
			//notify(msg, SEVERITY_INFO);
		}
	});
};

module.exports = { copyFile, createDirectory, deleteFile, deleteDirectory };
