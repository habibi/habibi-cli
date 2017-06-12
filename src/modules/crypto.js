import crypto from 'crypto';
import assert from 'assert';

// Returns a string
const generateHash = (password, salt) => {
  assert(typeof password === 'string');
  assert(typeof salt === 'string');

  const digest = 'sha512';
  const availableDigests = crypto.getHashes();

  // Check that the system supports sha512
  assert(availableDigests.includes(digest));

  return base64url(crypto.pbkdf2Sync(password, salt, 100000, 512, digest));
};

// Generates an urlsafe base64 string with padding removed from a Buffer
const base64url = (buffer) => {
  assert(Buffer.isBuffer(buffer) === true);
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
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

export {generateHash, generateSignUpHash, generatePGPHash};
