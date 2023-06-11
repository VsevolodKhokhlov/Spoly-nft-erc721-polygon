import CollectionConfigInterface from '../lib/CollectionConfigInterface'
import * as Networks from '../lib/Networks'
import * as Marketplaces from '../lib/Marketplaces'
import whitelistAddresses from './whitelist.json'

const CollectionConfig: CollectionConfigInterface = {
  testnet: Networks.polygonTestnet,
  mainnet: Networks.polygonMainnet,
  // yarn rename-contract NEW_CONTRACT_NAME
  contractName: 'SkullaPoly',
  tokenName: 'SPoly',
  tokenSymbol: 'SP',
  hiddenMetadataUri:
    'ipfs://QmRexaa4CEJHNf6B5hrAkWDnSgHc7eY9YvA12E1ByohkMt/hidden.json',
  maxSupply: 100,
  whitelistSale: {
    price: 0.05,
    maxMintAmountPerTx: 2
  },
  preSale: {
    price: 0.07,
    maxMintAmountPerTx: 4
  },
  publicSale: {
    price: 0.09,
    maxMintAmountPerTx: 10
  },
  contractAddress: '0xf8bf55a6bf9d3149984994c4430e0e4d1cad9e35',
  marketplaceIdentifier: 'skulla-poly',
  marketplaceConfig: Marketplaces.openSea,
  whitelistAddresses
}

export default CollectionConfig
