import { ethers } from 'ethers'

import { jsonObj } from './nft_abi.json'
let privKey = `0x7c433aaeddfb5385208957d7eb96fa1d8f54f5a8ef1fdee2f7d96ab40bd7a462`
let provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:7545')
let signers = new ethers.Signer()

console.log('signer', signers)
debugger
let jsonAbi = jsonObj.abi
let bytecode = jsonObj.data.bytecode

export const deployContract = async () => {
  debugger
  let factory = new ethers.ContractFactory(jsonAbi, bytecode, wallet)
  let contractObj = await factory.deploy()
  console.log('contractAddress=', contractObj.address)
  console.log('deploy txHash=', contractObj.deployTransaction.hash)
  await contractObj.deployed()
}
