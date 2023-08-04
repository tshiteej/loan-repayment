const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const mongoServer = new MongoMemoryServer({
  instance: {
    port: 51401,
  },
});

dbConnect = async () => {
  await mongoServer.start();
  const uri = await mongoServer.getUri();
  console.log({ uri });
  const mongooseOpts = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  await mongoose.connect(uri, mongooseOpts);
};

dbDisconnect = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
};

module.exports = {
  dbConnect,
  dbDisconnect,
};
