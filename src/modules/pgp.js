import assert from 'assert';
import {generatePGPHash} from './crypto';
import RegEx from './regex';

// Note, ES6 import does not work with openpgp.key.readArmored() for some reason.
// import openpgp from 'openpgp';
const openpgp = require('openpgp');

// Returns a promise
const generateKeys = (email, password) => {
  assert(typeof email === 'string');
  assert(typeof password === 'string');
  assert(RegEx.email.test(email));

  return openpgp.generateKey({
    userIds: [{email}],
    numBits: 1024,
    passphrase: generatePGPHash(password),
  });
};

// Returns a promise
const encrypt = ({data, publicKeys}) => {
  assert(typeof data === 'string');
  assert(Array.isArray(publicKeys));
  assert(publicKeys.length > 0);
  assert(publicKeys.every(e => typeof e === 'string'));

  return openpgp.encrypt({
    data: data,     // input as String (or Uint8Array)
    publicKeys: publicKeys.map(key => openpgp.key.readArmored(key.toString()).keys[0]),
    // TODO: Consider signing the message
    // privateKeys: openpgp.key.readArmored(privateKey).keys // for signing (optional)
  });
};

// Returns a promise
const decrypt = ({ciphertext, privateKey, password}) => {
  assert(typeof ciphertext === 'string');
  assert(typeof privateKey === 'string');
  assert(typeof password === 'string');

  const privateKeyObject = openpgp.key.readArmored(privateKey).keys[0];
  privateKeyObject.decrypt(password);

  return openpgp.decrypt({
    message: openpgp.message.readArmored(ciphertext),
    privateKey: privateKeyObject,
    // TODO: Consider verifying the message
    // publicKeys: openpgp.key.readArmored(pubkey).keys,    // for verification (optional)
  });
};

export {generateKeys, encrypt, decrypt};
