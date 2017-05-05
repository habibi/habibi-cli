import fs from 'fs';
import path from 'path';
import findParentDir from 'find-parent-dir';

export default (() => {
  const dir = findParentDir.sync(process.cwd(), '.habibi.json');
  if (! dir) {
    return {};
  }
  const filePath = path.resolve(dir, '.habibi.json');
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath).toString());
  }
  return {};
})();
