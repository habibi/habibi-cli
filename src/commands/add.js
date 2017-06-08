import fs from 'fs';
import path from 'path';
import graphql from '../modules/graphql';
import {encrypt} from '../modules/pgp';
import Settings from '../modules/settings';
import {projectDir} from '../modules/filesystem';
import UserError from '../modules/UserError';
import CURRENT_USER_QUERY from '../graphql/CurrentUser';
import CREATE_ENVIRONMENT_MUTATION from '../graphql/CreateEnvironment';

const push = async ({envName}) => {
  if (! envName) {
    throw new UserError('explain-usage-add');
  }

  try {
    const {data: {currentUser}} = await graphql.query({
      query: CURRENT_USER_QUERY,
    });

    const envFile = fs.readFileSync(path.resolve(projectDir, '.env'));
    const {data} = await encrypt({data: envFile.toString(), publicKeys: [currentUser.publicKey]});

    await graphql.mutate({
      mutation: CREATE_ENVIRONMENT_MUTATION,
      variables: {
        name: envName,
        projectId: Settings.projectId,
        data: data,
      },
    });

  } catch (e) {
    if (e.graphQLErrors) {
      throw new UserError(e.graphQLErrors[0].message);
    }
    throw e;
  }
};

export default push;
