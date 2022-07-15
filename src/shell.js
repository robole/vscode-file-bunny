const cp = require("child_process");

const exec = (cmd) =>
  new Promise((resolve, reject) => {
    cp.exec(cmd, (err, out) => {
      if (err) {
        return reject(err);
      }
      return resolve(out);
    });
  });

module.exports = {
  exec,
};
