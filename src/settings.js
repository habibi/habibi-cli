import fs from 'fs';

export default JSON.parse(fs.readFileSync('.habibi.json').toString());
