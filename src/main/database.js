'use strict';

const { app } = require('electron');
const path = require('path');
const { is } = require('electron-util');
const sqlite3 = require('sqlite3');

const dbVersion = 1;
const storagePath = is.development ? app.getAppPath() : app.getPath('userData');

const SQL_CREATE_SESSIONS = `
  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    created_at VARCHAR NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name VARCHAR NULL
  )
`;

const SQL_CREATE_SESSION_INSTANCES = `
  CREATE TABLE IF NOT EXISTS session_instances (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    created_at VARCHAR NOT NULL DEFAULT CURRENT_TIMESTAMP,
    events TEXT NOT NULL,
    aggregated TEXT NOT NULL,
    FOREIGN KEY(session_id) REFERENCES sessions(id)
  )
`;

const SQL_CREATE_DB_CONFIG = `
  CREATE TABLE IF NOT EXISTS db_config (
    id TEXT PRIMARY KEY,
    version INTEGER
  )
`;

class Database {
  constructor() {
    this.path = path.resolve(storagePath, 'entropia-tally-db.sqlite3');
    this.instance = new sqlite3.Database(this.path, error => {
      if (error) {
        throw error;
      }
    });
  }

  async init() {
    await this.run(SQL_CREATE_SESSIONS);
    await this.run(SQL_CREATE_SESSION_INSTANCES);
    await this.run(SQL_CREATE_DB_CONFIG);

    const row = await this.get('SELECT id, version FROM db_config');

    if (!row?.id) {
      await this.run(
        'INSERT INTO db_config(id, version) VALUES(?, ?)',
        ['version', dbVersion],
      );
    }
  }

  async get(query, values = []) {
    return new Promise((resolve, reject) => {
      this.instance.get(query, values, (error, row) => {
        if (error) {
          return reject(error);
        }

        return resolve(row);
      });
    });
  }

  async all(query, values = []) {
    return new Promise((resolve, reject) => {
      this.instance.all(query, values, (error, rows) => {
        if (error) {
          return reject(error);
        }

        return resolve(rows);
      });
    });
  }

  async run(query, values = []) {
    return new Promise((resolve, reject) => {
      this.instance.run(query, values, (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve(result);
      });
    });
  }
}

const instance = new Database();
instance.init();

module.exports = instance;
