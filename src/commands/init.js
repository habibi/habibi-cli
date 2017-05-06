import fs from 'fs';
import path from 'path';
import gql from 'graphql-tag';
import graphql from '../modules/graphql';
import {projectDir} from '../modules/filesystem';

const createProject = gql`
  mutation createProject {
    createProject
  }
`;

const init = async () => {
  if (projectDir && fs.existsSync(path.resolve(projectDir, '.habibi.json'))) {
    console.error('This project already have an .habibi.json file, will do nothing.');
    return;
  }

  const result = await graphql.mutate({
    mutation: createProject,
  });

  fs.writeFileSync('.habibi.json', JSON.stringify({
    projectId: result.data.createProject,
  }, null, 2) + '\n');
};

export default init;
