const { existsSync, readFileSync, appendFile, mkdirSync, writeFile } = require('fs');
const { join, parse } = require('path');
const { platform, homedir } = require('os');
const Registry = require('winreg');

const _platform = platform();
const _darwin = (_platform === 'darwin');
const _windows = (_platform === 'win32');

const calibrePath = join(homedir(), '.calibre-node');
const calibreFilePath = join(calibrePath, 'calibrePath.txt');

if (!existsSync(calibrePath)) {
  try {
    mkdirSync(calibrePath);
  } catch (e) {
    return new Promise.reject(Error(`[get-calibre-tools]: Failed to create ${calibrePath} directory, try to create it manually and then run it again.`));
  }
}

const setPathTip = 'Please use the setPath method to manually specify the path';
const calibreList = [
  'calibre',
  'calibre-customize',
  'calibre-debug',
  'calibre-server',
  'calibre-smtp',
  'calibredb',
  'ebook-convert',
  'ebook-edit',
  'ebook-meta',
  'ebook-polish',
  'ebook-viewer',
  'fetch-ebook-metadata',
  'lrf2lrs',
  'lrfviewer',
  'lrs2lrf',
  'web2disk',
];

const getCalibreTools = async (toolName) => {
  return await new Promise(async (resolve, reject) => {
    if (!calibreList.includes(toolName)) {
      return reject(new Error(`[get-calibre-tools]: Make sure the files you want to get are in this list: ${calibreList.join(',')}`));
    }

    if (existsSync(calibreFilePath)) {
      try {
        const fileContent = readFileSync(calibreFilePath, 'utf8').toString();
        const regex = new RegExp(`^${toolName}=(.+)$`, 'm');
        const result = regex.exec(fileContent);
        if (result) {
          return resolve(result[1]);
        }
      } catch (e) {
        return reject(new Error(`[get-calibre-tools]: Failed to read ${calibreFilePath} file`));
      }
    }

    const winPath = join('C', 'Program Files (x86)', 'Calibre2', `${toolName}.exe`);
    const macPath = join('/', 'Applications', 'calibre.app', 'Contents', 'console.app', 'Contents', 'MacOS', toolName);
    const linuxPath = join('/', 'usr', 'bin', toolName);

    const fileOsPath = _windows
      ? winPath
      : _darwin
        ? macPath
        : linuxPath;

    const isExists = existsSync(fileOsPath);

    if (isExists) {
      getCalibreTools.setPath(fileOsPath);
      return resolve(fileOsPath);
    }

    if (_windows) {
      const regKey = new Registry({
        hive: Registry.HKLM,
        key:  `\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\${toolName}.exe`
      });

      regKey.keyExists((err, exists) => {
        if (err) {
          return reject(Error(`[get-calibre-tools]: Registry view failed. ${setPathTip}`));
        }
        if (!exists) {
          return reject(Error(`[get-calibre-tools]: The registry did not find the path. ${setPathTip}`));
        }

        regKey.values((err, items) => {
          if (err) {
            return reject(Error(`[get-calibre-tools]: Registry view failed. ${setPathTip}`));
          }

          let len = items.length;
          while (len--) {
            const key = items[len];
            const path = key.value;

            if (path.endsWith('.exe')) {
              getCalibreTools.setPath(path);
              return resolve(path);
            }
          }
          return reject(Error(`[get-calibre-tools]: Did not find ${toolName}.exe file. ${setPathTip}`));
        });
      });
    } else {
      return reject(Error(`[get-calibre-tools]: Did not find ${toolName} file. ${setPathTip}`));
    }
  });
};

getCalibreTools.__proto__.setPath = async (path) => {
  return await new Promise((resolve, reject) => {
    if (typeof path !== 'string') {
      return reject('[get-calibre-tools]: Path must be a string');
    }

    const { ext, name } = parse(path);

    if (_windows && ext !== '.exe') {
      return reject('[get-calibre-tools]: The suffix must be exe');
    }

    if (!calibreList.includes(name)) {
      return reject(`[get-calibre-tools]: Make sure the file you entered is in this list: ${calibreList.join(',')}`);
    }

    if (existsSync(path)) {
      appendFile(calibreFilePath, `${name}=${path}`, 'utf8', (err) => {
        if (err) {
          return reject(Error('[get-calibre-tools]: Failed to write to file'));
        } else {
          return resolve(path);
        }
      })
    }
  });
};

getCalibreTools.__proto__.clearConfig = () => {
  return new Promise((resolve, reject) => {
    writeFile(calibreFilePath, '', (err, ) => {
      if (err) {
        return reject(Error(`[get-calibre-tools]: Failed to clear the configuration file, try to manually clear or delete the ${calibreFilePath} file.`));
      } else {
        return resolve();
      }
    });
  });
};

module.exports = getCalibreTools;
