import fs from 'fs';
import {generateRandomString} from './crypto';

const init = () => {
  if (fs.existsSync('.habibi.app.json') === false) {
    fs.writeFileSync('.habibi.app.json', JSON.stringify({
      projectId: generateRandomString(),
    }, null, 2) + '\n');
  }
};

export default init;
