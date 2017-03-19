import fs from 'fs';
import path from 'path';
import os from 'os';

const file = fs.readFileSync(path.resolve(os.homedir(), 'habibi'));
const [username, password] = file.toString().trim().split('\n').map(e => e.trim());

console.log(username);
console.log(password);
