# Tamper Proof Data

Since the focus of this question is on the client-side, I have implemented the following steps

## Client

  A React component renders, then retrieves the public key and fetches the data.
  
  When a user updates the data, the updated data and its signature are fetched from the server.
  
  Upon clicking 'verify', React uses the public key to verify the data hash signature.
  
  If the signature is incorrect, the user is warned. The user can then request the latest database entry by version (though this is far from perfect).

## Server

Node.js generates a key pair.

When a request with new data comes in, the server signs the hash, bumps the database version, and pushes the data into the database array.

When a user asks for version N of the database, the server returns that specific version.

In a real-world scenario where external systems can be utilized, using a decentralized database like IPFS or Holochain to store each database version could be a viable option.

Additionally, using a smart contract to store the signed hash data is feasible. Then, anyone with the public key of the server could verify the locally generated signature against the one in the smart contract using Web3.js or a similar library.

## Tests

```bash
cd server
npm run test
```

```bash
cd client
npm run test
```

DEMO: 

https://github.com/r-muresan/bequest-interview-question-1/assets/56592364/f5678f24-b96f-4c8b-9a67-2c806d9b9085

At Bequest, we require that important user data is tamper proof. Otherwise, our system can incorrectly distribute assets if our internal server or database is breached. 

**1. How does the client ensure that their data has not been tampered with?**
<br />
**2. If the data has been tampered with, how can the client recover the lost data?**


Edit this repo to answer these two questions using any technologies you'd like, there any many possible solutions. Feel free to add comments.

### To run the apps:
```npm run start``` in both the frontend and backend

## To make a submission:
1. Clone the repo
2. Make a PR with your changes in your repo
3. Email your github repository to robert@bequest.finance
