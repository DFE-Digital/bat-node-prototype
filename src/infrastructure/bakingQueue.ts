import Queue = require("bull");

const bakingQueue = new Queue(
  "baking cookies",
  `redis://${process.env.BAT_NODE_REDIS_HOST}:${process.env.BAT_NODE_REDIS_PORT}`
);

bakingQueue.process(({ data }, done) => {
  console.log("received baking job", data);
  console.log("cookies baking for 30 seconds");
  setTimeout(() => {
    console.log("cookies done baking!");
    done();
  }, 30000);
});

export default bakingQueue;
