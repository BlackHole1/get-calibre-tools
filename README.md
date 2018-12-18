# get-calibre-tools

[![Github License](https://img.shields.io/github/license/BlackHole1/get-calibre-tools.svg?logo=appveyor&longCache=true&style=flat-square)](https://github.com/BlackHole1/get-calibre-tools) [![Github Stars](https://img.shields.io/github/stars/BlackHole1/get-calibre-tools.svg?logo=appveyor&longCache=true&style=flat-square)](https://github.com/BlackHole1/get-calibre-tools)

> Provide an API to get the calibre tool

This library is used to get the following tools:

* calibre
* calibre
* calibre-customize
* calibre-debug
* calibre-server
* calibre-smtp
* calibredb
* ebook-convert
* ebook-edit
* ebook-meta
* ebook-polish
* ebook-viewer
* fetch-ebook-metadata
* lrf2lrs
* lrfviewer
* lrs2lrf
* web2diskcalibre-customize
* calibre-debug
* calibre-server
* calibre-smtp
* calibredb
* ebook-convert
* ebook-edit
* ebook-meta
* ebook-polish
* ebook-viewer
* fetch-ebook-metadata
* lrf2lrs
* lrfviewer
* lrs2lrf
* web2disk

`get-calibre-tools` will search for calibre on your computer.

* In the mac, will find the `/Applications/calibre.app/Contents/console.app/Contents/MacOS/` directory.
* In the linux, will find the `/usr/bin/` directory
* In the windows, will find the `C:\Program Files (x86)\Calibre2\` directory. If not, it will also look up the registry field: `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\`

**If not, you will get an error and prompt you to set the path manually using the setPath method.**

## Use

### Under normal circumstances

```js
const getCalibreTools = require('get-calibre-tools');

getCalibreTools('ebook-meta')
  .catch(e => {
    console.log(e);
  })
  .then(path => {
    console.log(path) // => file path
  })
```

### File not found

```js
const getCalibreTools = require('get-calibre-tools');

getCalibreTools('ebook-meta')
  .catch(e => {
    console.log(e); // => [get-calibre-tools]: Did not find ebook-meta(.exe) file. Please use the setPath method to manually specify the path.
  })
  .then(path => {

  })
```

### use the `setPath` method to manually specify the path

The set path will be written to the local file for later value.

```js
getCalibreTools.setPath(`D:\Program Files\Calibre2\ebook-meta.exe`)
  .catch(e => {
    console.log(e);
  })
  .then(path => {
    console.log(path)
  });
```

### Clear configuration file

Clear the configuration file when the path in the configuration file has changed

#### Clear all configurations

```js
getCalibreTools.clearConfig()
  .catch(e => {
    console.log(e);
  })
  .then(() => {
    console.log('success');
  })
```

#### Clear the specified configuration

```shell
$ cat ~/.calibre-node/calibrePath.txt
calibredb=/Applications/calibre.app/Contents/console.app/Contents/MacOS/calibredb
ebook-meta=/Applications/calibre.app/Contents/console.app/Contents/MacOS/ebook-meta
ebook-edit=/Applications/calibre.app/Contents/console.app/Contents/MacOS/ebook-edit
```

```js
getCalibreTools.clearConfig('ebook-meta')
  .catch(e => {
    console.log(e);
  })
  .then(() => {
    console.log('success');
  });
```

```shell
$ cat ~/.calibre-node/calibrePath.txt
calibredb=/Applications/calibre.app/Contents/console.app/Contents/MacOS/calibredb
ebook-edit=/Applications/calibre.app/Contents/console.app/Contents/MacOS/ebook-edit
```
