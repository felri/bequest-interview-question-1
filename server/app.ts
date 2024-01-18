import express from "express";
import cors from "cors";
import jsrsasign from "jsrsasign";

interface DatabaseEntry {
  data: string;
  signature: string;
}

type Database = {
  [version: number]: DatabaseEntry;
};

const keypair = jsrsasign.KEYUTIL.generateKeypair("RSA", 2048);
const privateKey = jsrsasign.KEYUTIL.getPEM(keypair.prvKeyObj, "PKCS1PRV");
const publicKey = jsrsasign.KEYUTIL.getPEM(keypair.pubKeyObj);

const PORT = 8080;
const app = express();
const database = {
  0: {
    data: "Hello World!",
    signature: "",
  },
} as Database;

function hashAndSignData(data: string, privateKey: string) {
  const sig = new jsrsasign.KJUR.crypto.Signature({ alg: "SHA1withRSA" });
  sig.init(privateKey);
  sig.updateString(data);
  return sig.sign();
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  const { data, signature } = database[Object.keys(database).length - 1];
  const version = Object.keys(database).length - 1;
  res.json({ data, signature, version });
});

app.get("/public-key", (req, res) => {
  res.json({ publicKey });
});

app.post("/", (req, res) => {
  const data = req.body.data;
  const signature = hashAndSignData(data, privateKey);
  const version = Object.keys(database).length;
  database[version] = { data, signature };
  res.json({ data, signature, version });
});

app.get("/recover/:version", (req, res) => {
  try {
    const version = Number(req.params.version);
    if (!database[version]) {
      res.status(404).json({ error: "Version does not exist" });
      return;
    }

    const { data, signature } = database[version];
    res.json({ data, version, signature });
  } catch (error) {
    console.error("Error in /recover:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

database[0].signature = hashAndSignData(database[0].data, privateKey);
