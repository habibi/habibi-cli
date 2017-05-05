import fs from 'fs';
import os from 'os';
import path from 'path';
import assert from 'assert';
import netrc from 'netrc';
import {generatePGPHash} from './crypto';

const habibiDir = path.join(os.homedir(), '.habibi');

const ensureHabibiConfigurationDirectory = () => {
  if (! fs.existsSync(habibiDir)) {
    fs.mkdirSync(habibiDir);
  }
};

// Returns a string
const getPrivateKey = () => {
  return fs.readFileSync(path.join(habibiDir, 'private-key')).toString();
};

const getPublicKey = () => {
  return fs.readFileSync(path.join(habibiDir, 'public-key')).toString();
};

const storePrivateKey = (privateKey) => {
  assert(typeof privateKey === 'string');

  ensureHabibiConfigurationDirectory();
  fs.writeFileSync(path.join(habibiDir, 'private-key'), privateKey);
};

const storePublicKey = (publicKeys) => {
  assert(typeof publicKeys === 'string');

  ensureHabibiConfigurationDirectory();
  fs.writeFileSync(path.join(habibiDir, 'public-key'), publicKeys);
};

// Returns a string
const getPgpPassphrase = () => {
  const netrcData = netrc() || {};
  netrcData['habibi.one'] = netrcData['habibi.one'] || {};
  return netrcData['habibi.one'].pgpPassphrase;
};

// Returns a string
const getApiToken = () => {
  const netrcData = netrc() || {};
  netrcData['habibi.one'] = netrcData['habibi.one'] || {};
  return netrcData['habibi.one'].password;
};

const storePgpPassphrase = (pgpPassphrase) => {
  const netrcData = netrc() || {};
  netrcData['habibi.one'] = netrcData['habibi.one'] || {};
  netrcData['habibi.one'].pgpPassphrase = generatePGPHash(pgpPassphrase);
  netrc.save(netrcData);
};

const storeApiToken = (password) => {
  const netrcData = netrc() || {};
  netrcData['habibi.one'] = netrcData['habibi.one'] || {};
  netrcData['habibi.one'].password = password;
  netrc.save(netrcData);
};

export {
  getPrivateKey,
  getPublicKey,
  storePrivateKey,
  storePublicKey,
  getPgpPassphrase,
  getApiToken,
  storePgpPassphrase,
  storeApiToken,
};
