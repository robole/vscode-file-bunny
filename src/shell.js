const cp = require("child_process");
const { clearInterval } = require("timers");

let process;

const exec = (cmd) =>
  new Promise((resolve, reject) => {
    process = cp.exec(cmd, (err, out) => {
      killProcess(process, 3000);
      if (err) {
        return reject(err);
      }
      return resolve(out);
    });
  });

module.exports = {
  exec,
};

const killProcess = (proc, delayMs) => {
  // start time
  let st = new Date();

  let interval = setInterval(() => {
    let time = new Date() - st;

    if (time > delayMs) {
      if (proc.killed === false) {
        console.log("process killed");
        proc.stdin.pause();
        proc.kill();
        console.log(proc);
      }

      clearInterval(interval);
      proc.exit();
    }

    console.log(proc);
  }, 1000);
};
