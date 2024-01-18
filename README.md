# Tamper Proof Data

Because the question is to focus on the client, I've done the following: 

## Client

1 - react component renders -> get public key -> get data

2 - user updates data -> gets data and signature from server

3 - the user click verify -> react uses public key to verify the data hash signature 

4 - if signature is incorrect -> warn user -> user request latest db entry by the version (far from perfect)

## Server

1 - node generates key pair

2 - request with new data comes in -> sign the hash -> bump db version -> push data into the db array

3 - user asks for version N of the db -> server returns said version

In a real-world scenario where I can use external systems I could probably use a decentralized db like IPFS/holochain to store each db version.

I could also use a smart contract to store the signed hash data, then anyone with the public key of the server can verify the locally generated signature with the one in the smart contract via web3.js or some other lib.

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
