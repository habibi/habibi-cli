import fs from 'fs';
import path from 'path';
import graphql from '../modules/graphql';
import {projectDir} from '../modules/filesystem';
import UserError from '../modules/UserError';
import CREATE_PROJECT_MUTATION from '../graphql/CreateProject';

const init = async () => {
  if (projectDir && fs.existsSync(path.resolve(projectDir, '.habibi.json'))) {
    throw new UserError('project-exists');
  }

  const result = await graphql.mutate({
    mutation: CREATE_PROJECT_MUTATION,
  });

  fs.writeFileSync('.habibi.json', JSON.stringify({
    projectId: result.data.createProject,
  }, null, 2) + '\n');
};

export default init;
