# get-calibre-tools

[![Github License](https://img.shields.io/github/license/BlackHole1/get-calibre-tools.svg?logo=appveyor&longCache=true&style=flat-square)](https://github.com/BlackHole1/get-calibre-tools) [![Github Stars](https://img.shields.io/github/stars/BlackHole1/get-calibre-tools.svg?logo=appveyor&longCache=true&style=flat-square)](https://github.com/BlackHole1/get-calibre-tools)

如果你使用到了这个项目，可以点击star支持一下。

[English document](https://github.com/BlackHole1/get-calibre-tools/blob/master/README.md)

> 提供一个获取calibre工具的api

这个库是用于获取以下工具的

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
* web2disk

`get-calibre-tools` 将会搜索你电脑中的calibre

* 在mac上，会查找 `/Applications/calibre.app/Contents/console.app/Contents/MacOS/` 目录。
* 在linux上，会查找 `/usr/bin/` 目录。
* 在windows上，会查找 `C:\Program Files (x86)\Calibre2\` 目录。 如果不存在, 它还将查找注册表字段: `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\`

**如果没有找到, 你将收到错误并提示您使用setPath方法手动设置路径。**

## 使用

### 正常情况下

```js
const getCalibreTools = require('get-calibre-tools');

getCalibreTools('ebook-meta')
  .catch(e => {
    console.log(e);
  })
  .then(path => {
    console.log(path) // => 文件路径
  })
```

### 文件没找到

设置好的路径，将会被写入本地文件中，方便以后取值。

```js
const getCalibreTools = require('get-calibre-tools');

getCalibreTools('ebook-meta')
  .catch(e => {
    console.log(e); // => [get-calibre-tools]: Did not find ebook-meta(.exe) file. Please use the setPath method to manually specify the path.
  })
  .then(path => {

  })
```

### 使用`setPath`方法手动设置路径

```js
getCalibreTools.setPath(`D:\Program Files\Calibre2\ebook-meta.exe`)
  .catch(e => {
    console.log(e);
  })
  .then(path => {
    console.log(path)
  })
```

### 清除配置文件

当路径不存在时，清除配置文件

#### 清除全部配置

```js
getCalibreTools.clearConfig()
  .catch(e => {
    console.log(e);
  })
  .then(() => {
    console.log('success');
  })
```

#### 清除指定配置字段

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

