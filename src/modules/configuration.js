import assert from 'assert';
import netrc from 'netrc';

// Returns a string
const getPgpPassphrase = () => {
  const netrcData = netrc() || {};
  netrcData['habibi.one'] = netrcData['habibi.one'] || {};
  return netrcData['habibi.one']['pgp-passphrase'];
};

// Returns a string
const getApiToken = () => {
  const netrcData = netrc() || {};
  netrcData['habibi.one'] = netrcData['habibi.one'] || {};
  return netrcData['habibi.one'].password;
};

const storeCredentials = ({login, apiToken, pgpPassphrase}) => {
  assert(typeof apiToken === 'string' || apiToken === null);
  assert(typeof pgpPassphrase === 'string' || pgpPassphrase === null);
  assert(typeof login === 'string' || login === null);

  const netrcData = netrc() || {};
  netrcData['habibi.one'] = {
    'login': login,
    'password': apiToken,
    'pgp-passphrase': pgpPassphrase,
  };
  netrc.save(netrcData);
};

const removeCredentials = () => {
  const netrcData = netrc() || {};
  delete netrcData['habibi.one'];
  netrc.save(netrcData);
};

export {getPgpPassphrase, getApiToken, storeCredentials, removeCredentials};
