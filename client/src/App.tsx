import React, { useEffect, useState, useCallback } from "react";
import jsrsasign from "jsrsasign";

export const API_URL = "http://localhost:8080";

type Data = {
  data: string;
  signature: string;
  version?: number;
};

export function App() {
  const [data, setData] = useState<Data | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [tampered, setTampred] = useState<boolean>(false);

  const getPublicKey = useCallback(async (fetchData = true) => {
    const response = await fetch(`${API_URL}/public-key`);
    const { publicKey } = await response.json();
    setPublicKey(publicKey);
    if (fetchData) {
      getData();
    }
  }, []);

  useEffect(() => {
    getPublicKey();
  }, [getPublicKey]);

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData((old) => ({ ...old, data: e.target.value, signature: "" }));
  };

  const getData = async () => {
    const response = await fetch(API_URL);
    const { data, signature, version } = await response.json();
    setData({ data, signature, version });
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
      setTampred(false);
    } else {
      alert("Data is invalid");
      setTampred(true);
    }
  };

  const recover = async () => {
    getPublicKey(false);
    const currentVersion = Number(data?.version || 0);
    const response = await fetch(`${API_URL}/recover/${currentVersion}`);

    const { data: newData, signature, version } = await response.json();
    setData({ data: newData, signature, version });
    setTampred(false);
  };

  async function verifySignature(data, signature) {
    try {
      const sig = new jsrsasign.KJUR.crypto.Signature({ alg: "SHA1withRSA" });
      sig.init(publicKey as string);
      sig.updateString(data);
      return sig.verify(signature);
    } catch (error) {
      console.error("Verification failed:", error);
      return false;
    }
  }

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
      <div>DB Version: {data?.version}</div>

      <div>Server Public Key</div>
      <span style={{ fontSize: "16px" }}>
        You can change the public key to simulate tempering
      </span>
      <input
        style={{ fontSize: "20px", width: "500px" }}
        type="text"
        value={publicKey || ""}
        name="publicKey"
        onChange={(e) => setPublicKey(e.target.value)}
      />
      <div>Saved Data</div>
      <input
        style={{ fontSize: "30px" }}
        type="text"
        value={data?.data}
        name="data"
        onChange={handleDataChange}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button style={{ fontSize: "20px" }} onClick={updateData}>
          Update Data
        </button>
        <button
          style={{ fontSize: "20px" }}
          onClick={verifyData}
          disabled={!data?.data || !data?.signature}
        >
          Verify Data
        </button>
      </div>
      {tampered && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            textAlign: "center",
          }}
        >
          <div style={{ color: "red" }}>Data has been tampered with</div>
          <div style={{ color: "red" }}>Do not trust the data</div>
          <button style={{ fontSize: "20px" }} onClick={recover}>
            Recover Last Valid Data
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
