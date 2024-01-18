import React, { useEffect, useState } from "react";
import { KJUR } from "jsrsasign";

const API_URL = "http://localhost:8080";

type Data = {
  data: string;
  signature: string;
};

function App() {
  const [data, setData] = useState<Data | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);

  const getPublicKey = React.useCallback(async () => {
    const response = await fetch(`${API_URL}/public-key`);
    const { publicKey } = await response.json();
    setPublicKey(publicKey);
    getData();
  }, []);

  useEffect(() => {
    getPublicKey();
  }, [getPublicKey]);

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((old) => ({ ...old, data: e.target.value, signature: "" }));
  };

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data, signature } = await response.json();
    setData({ data, signature });
  };

  const updateData = async () => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ data: data?.data }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    await getData();
  };

  const verifyData = async () => {
    if (!data?.data || !data?.signature) {
      alert("No data to verify");
      return;
    }

    if (!publicKey) {
      alert("No public key");
      return;
    }

    const isValid = await verifySignature(data.data, data.signature);

    if (isValid) {
      alert("Data is valid");
    } else {
      alert("Data is invalid");
    }
  };

  const verifySignature = (data, signature) => {
    try {
      const sig = new KJUR.crypto.Signature({ alg: "SHA256withRSA" });
      sig.init(publicKey);
      sig.updateString(data);

      return sig.verify(signature);
    } catch (e) {
      console.error("Verification error:", e);
      return false;
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        position: "absolute",
        padding: 0,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        fontSize: "30px",
      }}
    >
      <div>Server Public Key</div>
      <input
        style={{ fontSize: "20px", width: "500px" }}
        type="text"
        value={publicKey || ""}
        onChange={(e) => setPublicKey(e.target.value)}
      />
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data?.data}
        onChange={handleDataChange}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button style={{ fontSize: "20px" }} onClick={verifyData} disabled={!data?.data || !data?.signature}>
          Verify Data
        </button>
      </div>
    </div>
  );
}

export default App;
