import prompt from 'prompt';

export default (schema) => {
  prompt.start();
  return new Promise((resolve, reject) => {
    prompt.get(schema, async (error, input) => {
      if (error) {
        reject(error);
      } else {
        resolve(input);
      }
    });
  });
};
