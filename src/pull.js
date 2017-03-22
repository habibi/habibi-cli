import request from 'request-promise-native';

const pull = () => {
  const options = {
    uri: 'http://localhost:3000/pull',
    headers: {
      Authorization: 'Bearer 9nIjKUoSvAUEUm2n1XZ9-db7StrtnAwBZImkRK7xFMV',
    },
  };

  request(options).then((html) => {
    // eslint-disable-next-line no-console
    console.log(html);
    // fs.writeFileSync('./.env', html);
  });
};

export default pull;
