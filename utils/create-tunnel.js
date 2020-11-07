const _ = require("lodash");
const logger = console;
const fs = require('fs');
const path = require('path');
const ngrok = require('ngrok')
const URI = require("urijs");

function createTunnel() {
  const credentials = fs.readFileSync(path.resolve(process.cwd(), 'credentials.json'), {encoding: 'UTF-8'})
  const hosts = () => {
    let value;
    try { value = JSON.parse(credentials) } catch (error) { }
    return value;
  }
  const hasRemoteHosts = _.some(hosts(), host => {
    return !/localhost/.test(host);
  });
  if (process.env.AC_LOCAL_BASE_URL || !hasRemoteHosts) {
    return Promise.resolve();
  }

  return Promise.resolve()
    .then(() => {
      // console.log('1 ----------------\n', process.env.PORT);

      const ngrokPromise = ngrok.connect({
        proto: "http",
        subdomain: 'omiologic',
        region: 'us'
        // addr: 3000 // TODO: make dynamic
      });
      if (!ngrokPromise) {
        return Promise.reject("You must update ngrok to >= 3.0");
      }
      return ngrokPromise;
    })
    .then(url => {
      // console.log('2 ----------------\n', url);
      const ltu = new URI(url);
      const lbu = new URI('http://localhost:3000'); // TODO: make dynamic
      lbu.protocol(ltu.protocol());
      lbu.host(ltu.host());
      process.env.AC_LOCAL_BASE_URL = lbu.toString();
      logger.info(`Local tunnel established at ${lbu.toString()}`);
      logger.info("Check http://127.0.0.1:4040 for tunnel status");
      // addon.emit("localtunnel_started");
      // addon.reloadDescriptor();
    })
    .catch(err => {
      logger.error("Failed to establish local tunnel");
      if (err.code === "MODULE_NOT_FOUND") {
        logger.error(
          "Make sure that ngrok is installed: npm install --save-dev ngrok"
        );
      }
      throw err && err.stack ? err : new Error(err);
    });
}

createTunnel();
