import crypto from 'crypto';
import assert from 'assert';

// Note, ES6 import does not work with openpgp.key.readArmored() for some reason.
// import openpgp from 'openpgp';
const openpgp = require('openpgp');

const generateKeys = (email, passphrase) => {
  const salt = 'habibi-pgp';
  const hash = crypto.pbkdf2Sync(passphrase, salt, 100000, 512, 'sha512').toString('hex');

  const options = {
    userIds: [{email}],
    numBits: 1024,
    passphrase: hash,
  };

  // Returns a promise
  return openpgp.generateKey(options);
};

const encrypt = async ({data, publicKeys}) => {
  assert(typeof data === 'string');
  assert(publicKeys.length > 0);
  assert(Array.isArray(publicKeys));

  const options = {
    data: data,     // input as String (or Uint8Array)
    publicKeys: publicKeys.map(key => openpgp.key.readArmored(key.toString()).keys[0]),
    // TODO: Consider signing the message
    // privateKeys: openpgp.key.readArmored(privateKey).keys // for signing (optional)
  };

  // Returns a promise
  return openpgp.encrypt(options);
};

export {generateKeys, encrypt};
