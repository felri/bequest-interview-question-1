import express from "express";
import cors from "cors";
import crypto from "crypto";

let { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
});

const private_key = privateKey.export({
  type: "pkcs1",
  format: "pem",
});

const public_key = publicKey.export({
  type: "spki",
  format: "pem",
});

interface DatabaseEntry {
  data: string;
  signature: string;
}

type Database = {
  [version: number]: DatabaseEntry;
};

const PORT = 8080;
const app = express();
const database = {
  0: {
    data: "Hello World!",
    signature: "0",
  },
} as Database;

function signData(data: string): string {
  const hash = crypto.createHash("sha256").update(data).digest("hex");
  const sign = crypto.createSign("sha256");
  sign.update(hash);
  sign.end();
  const signature = sign.sign(private_key);
  return signature.toString("hex");
}

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  const { data, signature } = database[Object.keys(database).length - 1];
  const version = Object.keys(database).length - 1;
  res.json({ data, signature, version });
});

app.get("/public-key", (req, res) => {
  res.json({ publicKey: public_key });
});

app.post("/", (req, res) => {
  const data = req.body.data;
  const signature = signData(data);
  const version = Object.keys(database).length;
  database[version] = { data, signature };
  res.json({ data, signature, version });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
