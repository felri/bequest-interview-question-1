import express from "express";
import cors from "cors";
import crypto from "crypto";


let { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
});

const private_key = privateKey.export({
  type: 'pkcs1',
  format: 'pem',
});

const public_key = publicKey.export({
  type: 'spki',
  format: 'pem',
});

type Database = {
  data: string;
  signature: string;
  version: number;
};

const PORT = 8080;
const app = express();
const database = [
  { data: "Hello world", signature: "", version: 0 },
] as Database[];

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
  const latest = database[database.length - 1];
  res.json(latest);
});

app.get("/public-key", (req, res) => {
  res.json({ publicKey: public_key });
});

app.post("/", (req, res) => {
  const data = req.body.data;
  const signature = signData(data);
  database.push({ data, signature, version: database.length });
  res.json({ data, signature });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
