import assert from 'assert';
import netrc from 'netrc';
import {generatePGPHash} from './crypto';

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
  assert(typeof pgpPassphrase === 'string' || pgpPassphrase === null);

  if (typeof pgpPassphrase === 'string') {
    pgpPassphrase = generatePGPHash(pgpPassphrase);
  }

  const netrcData = netrc() || {};
  netrcData['habibi.one'] = netrcData['habibi.one'] || {};
  netrcData['habibi.one'].pgpPassphrase = pgpPassphrase;
  netrc.save(netrcData);
};

const storeApiToken = (password) => {
  assert(typeof password === 'string' || password === null);

  const netrcData = netrc() || {};
  netrcData['habibi.one'] = netrcData['habibi.one'] || {};
  netrcData['habibi.one'].password = password;
  netrc.save(netrcData);
};

export {getPgpPassphrase, getApiToken, storePgpPassphrase, storeApiToken};
