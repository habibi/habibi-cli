import fs from 'fs';
import os from 'os';
import path from 'path';
import assert from 'assert';
import netrc from 'netrc';

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
  const netrcData = netrc();
  return netrcData['habibi.one'].pgpPassphrase;
};

// Returns a string
const getApiToken = () => {
  const netrcData = netrc();
  return netrcData['habibi.one'].password;
};

// const storePgpPassphrase = ({login, password, pgpPassphrase}) => {
//   const netrcData = netrc();
//
//   netrcData['habibi.one'] = {
//     login: login,
//     password: password,
//     pgpPassphrase: pgpPassphrase,
//   };
//   netrc.save(myNetrc);
// };

// const storeApiToken = () => {
//   const netrcData = netrc();
//   return netrcData['habibi.one'].password;
// };

export {
  getPrivateKey,
  getPublicKey,
  storePrivateKey,
  storePublicKey,
  getPgpPassphrase,
  getApiToken,
  // storePgpPassphrase,
  // storeApiToken,
};
