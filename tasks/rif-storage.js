#!/usr/bin/env node

// # first time only
// ipfs init
//
// # by default, listens on http://localhost:5001/
// ipfs daemon

const fs = require('fs');
const path = require('path');

const rifStorage = require('@rsksmart/rif-storage');
const recursiveReaddir = require('recursive-readdir');
const pMap = require('p-map');

function getStorage() {
  const rifStorageInst = rifStorage.default(
    rifStorage.Provider.IPFS,
    {
      host: 'localhost',
      port: '5001',
      protocol: 'http',
    },
  );
  return rifStorageInst;
}

function fileToStorageData(filePath) {
  // NOTE use read streams instead of buffers to
  // avoid reading all contents into memory at once,
  // which is not a good idea for large dirs.
  return {
    data: fs.createReadStream(filePath, {
      flags: 'r',
      bufferSize: 64e3,
    }),
  };
}

async function readDirContents(dir) {
  const fileList = await recursiveReaddir(dir, []);
  console.log(fileList);
  const contentList = await pMap(
    fileList,
    fileToStorageData,
    { concurrency: 4 },
  );
  const dirContents = Object.assign(
    {},
    ...fileList.map(
      (filePath, idx) => {
        const relativeFilePath = path.relative(
          dir,
          filePath,
        );
        return { [relativeFilePath]: contentList[idx] };
      },
    ),
  );
  return dirContents;
}

async function printContents(ipfsCid) {
  const storage = getStorage();
  console.log('retrieving...', ipfsCid);
  const retrievedData = await storage.get(ipfsCid);
  console.log(retrievedData);
  return ipfsCid;
}

async function uploadToIpfs(dirContents) {
  console.log(dirContents);
  const storage = getStorage();
  const dirRootIpfsHash = await storage.put(dirContents);
  console.log('dirRootIpfsHash:' + dirRootIpfsHash);

  return dirRootIpfsHash;
}

async function pinToIpfs(ipfsHash) {
  const storage = getStorage();
  await storage.ipfs.pin.add(ipfsHash);
  const pins = await storage.ipfs.pin.ls();

  console.log('foundPin:');
  const foundPin = pins.find((pin) => (pin.hash === ipfsHash));
  console.log(foundPin);

  const ipfsCid = foundPin.hash
  return ipfsCid;
}

async function unpinFromIpfs(ipfsHash) {
  await storage.ipfs.pin.rm(ipfsHash);

  return ipfsHash;
}

module.exports = {
  getStorage,
  fileToStorageData,
  readDirContents,
  uploadToIpfs,
  pinToIpfs,
  unpinFromIpfs,
};

// NOTE not yet working, appears to return name that starts
// with `k2` instead of the expected `Qm`
// as specified in the docs.
//
// async function ipfsToIpns(ipfsCid) {
//   const storage = getStorage();
//   const {
//     name: ipnsHash,
//     value: ipfsHash
//   } = await storage.ipfs.name.publish(
//     ipfsCid,
//     { key: 'workshop-rsk-full-stack-dapp' }
//   );
//   console.log({
//     ipnsHash,
//     ipfsHash,
//   });
//
//   return ipnsHash;
// }

const dirPath = process.argv[2] || './client/';
readDirContents(dirPath)
  .then(uploadToIpfs)
  .then(printContents) // to demonstrate the previous step worked
  .then(pinToIpfs)
  .then(printContents) // to demonstrate the previous step worked
  // .then(ipfsToIpns)
  // .then(printContents) // to demonstrate the previous step worked
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
