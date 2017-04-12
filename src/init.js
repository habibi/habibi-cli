import fs from 'fs';
import {generateRandomString} from './crypto';

const init = () => {
  if (fs.existsSync('.habibi.json') === false) {
    fs.writeFileSync('.habibi.json', JSON.stringify({
      appId: generateRandomString(),
    }, null, 2) + '\n');
  }
};

export default init;
