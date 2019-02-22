// Datebase URI
exports.mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${
  process.env.MONGO_PASSWORD
}@cluster0-sxxsn.mongodb.net/${process.env.MONGO_DAFAULT_DATABASE}`;

// mongodb+srv://<USERNAME>:<PASSWORD>@cluster0-sxxsn.mongodb.net/<DATABASE>

// Secret Or Private Key
exports.secretOrPrivateKey = process.env.SECRET_OR_PRIVATE_KEY;
// Server Port
exports.PORT = process.env.PORT;
