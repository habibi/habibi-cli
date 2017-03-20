import fs from 'fs';
import path from 'path';
import os from 'os';
import request from 'request-promise-native';

const [, , command = ''] = process.argv;

if (command.toLowerCase() !== 'push' && command.toLowerCase() !== 'pull') {
  // eslint-disable-next-line no-console
  console.error('Usage: habibi push|pull');
  process.exit(1);
}

const file = fs.readFileSync(path.resolve(os.homedir(), 'habibi'));
const [username, password] = file.toString().trim().split('\n').map(
  e => e.trim());

const options = {
  uri: 'http://localhost:3000/',
  headers: {
    username: username,
    password: password,
  },
};

request(options).then((html) => {
  console.log(html);
});
