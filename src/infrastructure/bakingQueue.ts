import Queue = require("bull");

const bakingQueue = new Queue("baking cookies", process.env.REDIS_URL);

bakingQueue.process(({ data }, done) => {
  console.log("received baking job", data);
  console.log("cookies baking for 30 seconds");
  setTimeout(() => {
    console.log("cookies done baking!");
    done();
  }, 30000);
});

export default bakingQueue;
