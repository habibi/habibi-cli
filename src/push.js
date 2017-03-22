import request from 'request-promise-native';

const push = () => {
  const options = {
    method: 'post',
    uri: 'http://localhost:3000/push',
    headers: {
      Authorization: 'Bearer 9nIjKUoSvAUEUm2n1XZ9-db7StrtnAwBZImkRK7xFMV',
    },
  };

  request(options).then((html) => {
    // eslint-disable-next-line no-console
    console.log(html);
  });
};

export default push;
