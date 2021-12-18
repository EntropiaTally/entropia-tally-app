'use strict';

const { app } = require('electron');
const { spawn } = require('child_process');
const path = require('path');
const { is, fixPathForAsarUnpack } = require('electron-util');
const EventEmitter = require('events');

const cliPath = path.resolve(app.getAppPath(), 'bin');
const name = 'entropia-tracker-cli';
const ext = (is.linux) ? 'unix' : 'exe';
const bin = fixPathForAsarUnpack(path.join(cliPath, `${name}.${ext}`));

class LogReader extends EventEmitter {
  constructor(file, avatarName = '') {
    super();
    this.file = file;
    this.avatarName = avatarName;
    this.tail = null;
    this.active = false;
    this.onData = this.onData.bind(this);
  }

  onTailClose(code) {
    console.error(`cli process exited with code ${code}`);
  }

  start() {
    const args = [
      'parse',
      '--watch',
    ];

    if (is.development) {
      args.push('-a');
      this.file = path.resolve(app.getAppPath(), 'chat.log');
    }

    args.push('-f', this.file, '-n', this.avatarName);

    this.tail = spawn(bin, args);
    this.tail.stdout.on('data', this.onData);
    this.tail.on('close', this.onTailClose);

    this.active = true;
    this.emit('logger-status-changed');
  }

  stop() {
    if (this.tail) {
      this.tail.kill();
      this.tail.removeListener('close', this.onTailClose);
    }

    this.active = false;
    this.emit('logger-status-changed');
  }

  onData(raw) {
    const lines = raw.toString().split(/\r?\n/).filter(line => Boolean(line));
    const lineCount = lines?.length || 1;
    let currentLine = 1;

    for (const line of lines) {
      try {
        const event = JSON.parse(line);
        this.emit('event', { data: event, lastLine: currentLine === lineCount });
      } catch (error) {
        console.error('Failed to parse event', error, 'Source:', line);
      }

      currentLine++;
    }
  }

  setLogFile(file) {
    this.file = file;
    if (this.active) {
      this.stop();
      this.start();
    }
  }

  setAvatarName(avatarName) {
    this.avatarName = avatarName;
    if (this.active) {
      this.stop();
      this.start();
    }
  }
}

module.exports = LogReader;
