import crypto from 'crypto';
import openpgp from 'openpgp';

const generateKeys = (email, passphrase) => {
  const salt = 'habibi-pgp';
  const hash = crypto.pbkdf2Sync(passphrase, salt, 100000, 512, 'sha512')
    .toString('hex');

  const options = {
    userIds: [{email}],
    numBits: 1024,
    passphrase: hash,
  };

  // Returns a promise
  return openpgp.generateKey(options);
};

export {generateKeys};
