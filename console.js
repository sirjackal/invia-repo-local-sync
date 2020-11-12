const notifier = require('node-notifier');
const path = require('path');

const SEVERITY_INFO = 'info';
const SEVERITY_WARNING = 'warning';
const SEVERITY_ERROR = 'error';

const padDatePart = (num) => {
	return num.toString().padStart(2, '0');
};

const getDateString = () => {
	const date = new Date();

	const Y = date.getFullYear().toString();
	const m = padDatePart(date.getMonth());
	const d = padDatePart(date.getDate());
	const H = padDatePart(date.getHours());
	const i = padDatePart(date.getMinutes());
	const s = padDatePart(date.getSeconds());

	return `[${Y}-${m}-${d} ${H}:${i}:${s}]`;
};

const consoleLog = (message, ...args) => {
	console.log.apply(null, [getDateString(), message].concat(args));
};

const consoleError = (message, ...args) => {
	console.error.apply(null, [getDateString(), message].concat(args));
};

const consoleWarn = (message, ...args) => {
	console.warn.apply(null, [getDateString(), message].concat(args));
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

module.exports = { consoleLog, consoleWarn, consoleError, notify, SEVERITY_ERROR, SEVERITY_INFO, SEVERITY_WARNING };
