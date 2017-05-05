import crypto from 'crypto';
import assert from 'assert';

// Returns a string
const generateHash = (password, salt) => {
  assert(typeof password === 'string');
  assert(typeof salt === 'string');

  return crypto.pbkdf2Sync(password, salt, 100000, 512, 'sha512').toString('hex');
};

// Returns a string
const generateSignUpHash = (password) => {
  assert(typeof password === 'string');

  const salt = 'habibi';
  return generateHash(password, salt);
};

// Returns a string
const generatePGPHash = (password) => {
  assert(typeof password === 'string');

  const salt = 'habibi-pgp';
  return generateHash(password, salt);
};

const generateRandomString = () => {
  return crypto.randomBytes(32).toString('hex');
};

export {generateHash, generateSignUpHash, generatePGPHash, generateRandomString};
