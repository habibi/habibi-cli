import fs from 'fs';

export default {
  app: JSON.parse(fs.readFileSync('.habibi.json').toString()),
  env: JSON.parse(fs.readFileSync('.habibi.env.json').toString()),
};
