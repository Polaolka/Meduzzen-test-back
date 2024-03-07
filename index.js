const Config = require('./config');
const app = require('./app');

const runningServer = async () => {
  console.log('Starting the server...');

  app.listen(Config.PORT, e => {
    if (!e) {
      return;
    }
    return console.log('Server Error:', e);
  });
  console.log(
    `Server is running! WEB HOST: http://localhost:${Config.PORT}/api/v0`
  );
};

runningServer();
