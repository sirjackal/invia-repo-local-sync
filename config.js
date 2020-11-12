const watchedDirs = [
	'web',
	'library',
	'mda-zend',
];

const ignored = [
	'**/.git/**',
	'**/node_modules/**',
	'**/.idea/**',
	'web/assets/*/src/**',
	'web/cache/**'
];

const nfsDriveLetter = 'Z';

module.exports = { watchedDirs, ignored, nfsDriveLetter };
