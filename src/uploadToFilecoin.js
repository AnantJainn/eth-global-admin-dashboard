import lighthouse from "@lighthouse-web3/sdk";

const API_KEY = process.env.REACT_APP_LIGHTHOUSE_API_KEY; // safer with env

/**
 * Uploads a file to Lighthouse/Filecoin/IPFS.
 * @param {File} file - A single File object from <input type="file">.
 * @returns {Promise<string>} The gateway URL for accessing the file.
 */
export async function uploadToFilecoin(file) {
  if (!file) {
    throw new Error("No file provided for upload");
  }
  console.log(API_KEY);
  console.log("Uploading file to Filecoin/IPFS:", file.name);

  // ✅ Pass as array: [file]
  const response = await lighthouse.upload([file], API_KEY);

  console.log("Lighthouse response:", response);

  if (!response?.data?.Hash) {
    throw new Error("Upload failed: no CID returned");
  }

  const cid = response.data.Hash;
  const url = `https://gateway.lighthouse.storage/ipfs/${cid}`;
  console.log("✅ Uploaded. Filecoin URL:", url);

  return url;
}
