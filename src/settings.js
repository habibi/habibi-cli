import fs from 'fs';

export default {
  app: (() => {
    if (fs.existsSync('.habibi.json')) {
      return JSON.parse(fs.readFileSync('.habibi.json').toString());
    }
    return {};
  })(),
  env: (() => {
    if (fs.existsSync('.habibi.env.json')) {
      return JSON.parse(fs.readFileSync('.habibi.env.json').toString());
    }
    return {};
  })(),
};
