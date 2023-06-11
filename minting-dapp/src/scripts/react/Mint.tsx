import React from 'react'
import { ethers, BigNumber } from 'ethers'
import { ExternalProvider, Web3Provider } from '@ethersproject/providers'
import detectEthereumProvider from '@metamask/detect-provider'
import NftContractType from '../lib/NftContractType'
import CollectionConfig from '../../../../smart-contract/config/CollectionConfig'
import NetworkConfigInterface from '../../../../smart-contract/lib/NetworkConfigInterface'
import CollectionStatus from './CollectionStatus'
import MintWidget from './MintWidget'
import Whitelist from '../lib/Whitelist'

const ContractAbi = require('../../../../smart-contract/artifacts/contracts/' +
  CollectionConfig.contractName +
  '.sol/' +
  CollectionConfig.contractName +
  '.json').abi

interface Props {}

interface State {
  userAddress: string | null
  network: ethers.providers.Network | null
  networkConfig: NetworkConfigInterface
  totalSupply: number
  maxSupply: number
  maxMintAmountPerTx: number
  tokenPrice: BigNumber
  isPaused: boolean
  isWhitelistMintEnabled: boolean
  isUserInWhitelist: boolean
  merkleProofManualAddress: string
  merkleProofManualAddressFeedbackMessage: string | JSX.Element | null
  errorMessage: string | JSX.Element | null
}

const defaultState: State = {
  userAddress: null,
  network: null,
  networkConfig: CollectionConfig.mainnet,
  totalSupply: 0,
  maxSupply: 0,
  maxMintAmountPerTx: 0,
  tokenPrice: BigNumber.from(0),
  isPaused: true,
  isWhitelistMintEnabled: false,
  isUserInWhitelist: false,
  merkleProofManualAddress: '',
  merkleProofManualAddressFeedbackMessage: null,
  errorMessage: null
}

export default class Mint extends React.Component<Props, State> {
  provider!: Web3Provider

  contract!: NftContractType

  private merkleProofManualAddressInput!: HTMLInputElement

  constructor(props: Props) {
    super(props)

    this.state = defaultState
  }

  componentDidMount = async () => {
    const browserProvider = (await detectEthereumProvider()) as ExternalProvider

    if (browserProvider?.isMetaMask !== true) {
      this.setError(
        <>
          We were not able to detect <strong>MetaMask</strong>. We value{' '}
          <strong>privacy and security</strong> a lot so we limit the wallet
          options on the DAPP.
          <br />
          <br />
          But don't worry! <span className="emoji">😃</span> You can always
          interact with the smart-contract through{' '}
          <a href={this.generateContractUrl()} target="_blank">
            {this.state.networkConfig.blockExplorer.name}
          </a>{' '}
          and{' '}
          <strong>
            we do our best to provide you with the best user experience possible
          </strong>
          , even from there.
          <br />
          <br />
          You can also get your <strong>Whitelist Proof</strong> manually, using
          the tool below.
        </>
      )
    }

    this.provider = new ethers.providers.Web3Provider(browserProvider)

    this.registerWalletEvents(browserProvider)

    await this.initWallet()
  }

  async mintTokens(amount: number): Promise<void> {
    try {
      await this.contract.mint(amount, {
        value: this.state.tokenPrice.mul(amount)
      })
    } catch (e) {
      this.setError(e)
    }
  }

  async whitelistMintTokens(amount: number): Promise<void> {
    try {
      await this.contract.whitelistMint(
        amount,
        Whitelist.getProofForAddress(this.state.userAddress!),
        { value: this.state.tokenPrice.mul(amount) }
      )
    } catch (e) {
      this.setError(e)
    }
  }

  private isWalletConnected(): boolean {
    return this.state.userAddress !== null
  }

  private isContractReady(): boolean {
    return this.contract !== undefined
  }

  private isSoldOut(): boolean {
    return (
      this.state.maxSupply !== 0 &&
      this.state.totalSupply < this.state.maxSupply
    )
  }

  private isNotMainnet(): boolean {
    return (
      this.state.network !== null &&
      this.state.network.chainId !== CollectionConfig.mainnet.chainId
    )
  }

  private copyMerkleProofToClipboard(): void {
    const merkleProof = Whitelist.getRawProofForAddress(
      this.state.userAddress ?? this.state.merkleProofManualAddress
    )

    if (merkleProof.length < 1) {
      this.setState({
        merkleProofManualAddressFeedbackMessage:
          'The given address is not in the whitelist, please double-check.'
      })

      return
    }

    navigator.clipboard.writeText(merkleProof)

    this.setState({
      merkleProofManualAddressFeedbackMessage: (
        <>
          <strong>Congratulations!</strong> <span className="emoji">🎉</span>
          <br />
          Your Merkle Proof <strong>has been copied to the clipboard</strong>.
          You can paste it into{' '}
          <a href={this.generateContractUrl()} target="_blank">
            {this.state.networkConfig.blockExplorer.name}
          </a>{' '}
          to claim your tokens.
        </>
      )
    })
  }

  render() {
    return (
      <div className="h-screen center bg-bn">
        <div className="glass my-16 p-6 max-w-3xl rounded-lg shadow-md">
          {this.isNotMainnet() ? (
            <div className="text-center my-4">
              You are not connected to the main network.
              <span className="small">
                Current network: <strong>{this.state.network?.name}</strong>
              </span>
            </div>
          ) : null}
          {this.state.errorMessage ? (
            <div className="error">
              <p>{this.state.errorMessage}</p>
              <button onClick={() => this.setError()}>Close</button>
            </div>
          ) : null}
          {this.isWalletConnected() ? (
            <div>
              {this.isContractReady() ? (
                <>
                  <CollectionStatus
                    userAddress={this.state.userAddress}
                    maxSupply={this.state.maxSupply}
                    totalSupply={this.state.totalSupply}
                    isPaused={this.state.isPaused}
                    isWhitelistMintEnabled={this.state.isWhitelistMintEnabled}
                    isUserInWhitelist={this.state.isUserInWhitelist}
                  />
                  {this.state.totalSupply < this.state.maxSupply ? (
                    <MintWidget
                      networkConfig={this.state.networkConfig}
                      maxSupply={this.state.maxSupply}
                      totalSupply={this.state.totalSupply}
                      tokenPrice={this.state.tokenPrice}
                      maxMintAmountPerTx={this.state.maxMintAmountPerTx}
                      isPaused={this.state.isPaused}
                      isWhitelistMintEnabled={this.state.isWhitelistMintEnabled}
                      isUserInWhitelist={this.state.isUserInWhitelist}
                      mintTokens={(mintAmount) => this.mintTokens(mintAmount)}
                      whitelistMintTokens={(mintAmount) =>
                        this.whitelistMintTokens(mintAmount)
                      }
                    />
                  ) : (
                    <div className="collection-sold-out">
                      <h2>
                        Tokens have been <strong>sold out</strong>!{' '}
                        <span className="emoji">🥳</span>
                      </h2>
                      You can buy from our beloved holders on{' '}
                      <a href={this.generateMarketplaceUrl()} target="_blank">
                        {CollectionConfig.marketplaceConfig.name}
                      </a>
                      .
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center font-bold text-red-400">
                  <svg
                    className="animate-spin w-8 h-8 my-10 text-center mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Loading collection data...
                </div>
              )}
            </div>
          ) : null}
          {!this.isWalletConnected() || !this.isSoldOut() ? (
            <div className="flex flex-col justify-center items-center">
              {!this.isWalletConnected() ? (
                <button
                  className="text-gray-900 my-6 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700 mr-2 mb-2"
                  disabled={this.provider === undefined}
                  onClick={() => this.connectWallet()}
                >
                  <svg
                    className="w-6 h-5 mr-2 -ml-1"
                    viewBox="0 0 2405 2501"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {' '}
                    <g clip-path="url(#clip0_1512_1323)">
                      {' '}
                      <path
                        d="M2278.79 1730.86L2133.62 2221.69L1848.64 2143.76L2278.79 1730.86Z"
                        fill="#E4761B"
                        stroke="#E4761B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1848.64 2143.76L2123.51 1767.15L2278.79 1730.86L1848.64 2143.76Z"
                        fill="#E4761B"
                        stroke="#E4761B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M2065.2 1360.79L2278.79 1730.86L2123.51 1767.15L2065.2 1360.79ZM2065.2 1360.79L2202.64 1265.6L2278.79 1730.86L2065.2 1360.79Z"
                        fill="#F6851B"
                        stroke="#F6851B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1890.29 1081.17L2285.34 919.338L2265.7 1007.99L1890.29 1081.17ZM2253.21 1114.48L1890.29 1081.17L2265.7 1007.99L2253.21 1114.48Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M2253.21 1114.48L2202.64 1265.6L1890.29 1081.17L2253.21 1114.48ZM2332.34 956.82L2265.7 1007.99L2285.34 919.338L2332.34 956.82ZM2253.21 1114.48L2265.7 1007.99L2318.65 1052.01L2253.21 1114.48Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1542.24 2024.17L1641 2055.7L1848.64 2143.75L1542.24 2024.17Z"
                        fill="#E2761B"
                        stroke="#E2761B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M2202.64 1265.6L2253.21 1114.48L2296.64 1147.8L2202.64 1265.6ZM2202.64 1265.6L1792.71 1130.55L1890.29 1081.17L2202.64 1265.6Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1987.86 617.696L1890.29 1081.17L1792.71 1130.55L1987.86 617.696Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M2285.34 919.338L1890.29 1081.17L1987.86 617.696L2285.34 919.338Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1987.86 617.696L2400.16 570.1L2285.34 919.338L1987.86 617.696Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M2202.64 1265.6L2065.2 1360.79L1792.71 1130.55L2202.64 1265.6Z"
                        fill="#F6851B"
                        stroke="#F6851B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M2382.31 236.33L2400.16 570.1L1987.86 617.696L2382.31 236.33Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M2382.31 236.33L1558.3 835.45L1547.59 429.095L2382.31 236.33Z"
                        fill="#E2761B"
                        stroke="#E2761B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M934.789 380.309L1547.59 429.095L1558.3 835.449L934.789 380.309Z"
                        fill="#F6851B"
                        stroke="#F6851B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1792.71 1130.55L1558.3 835.449L1987.86 617.696L1792.71 1130.55Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1792.71 1130.55L2065.2 1360.79L1682.65 1403.04L1792.71 1130.55Z"
                        fill="#E4761B"
                        stroke="#E4761B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1682.65 1403.04L1558.3 835.449L1792.71 1130.55L1682.65 1403.04Z"
                        fill="#E4761B"
                        stroke="#E4761B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1987.86 617.696L1558.3 835.45L2382.31 236.33L1987.86 617.696Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M940.144 2134.24L1134.69 2337.11L869.939 2096.16L940.144 2134.24Z"
                        fill="#C0AD9E"
                        stroke="#C0AD9E"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1848.64 2143.75L1940.86 1793.33L2123.51 1767.15L1848.64 2143.75Z"
                        fill="#CD6116"
                        stroke="#CD6116"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M151.234 1157.92L487.978 803.917L194.666 1115.67L151.234 1157.92Z"
                        fill="#E2761B"
                        stroke="#E2761B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M2123.51 1767.15L1940.86 1793.33L2065.2 1360.79L2123.51 1767.15ZM1558.3 835.449L1230.48 824.74L934.789 380.309L1558.3 835.449Z"
                        fill="#F6851B"
                        stroke="#F6851B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M2065.2 1360.79L1940.86 1793.33L1930.74 1582.12L2065.2 1360.79Z"
                        fill="#E4751F"
                        stroke="#E4751F"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1682.65 1403.04L2065.2 1360.79L1930.74 1582.12L1682.65 1403.04Z"
                        fill="#CD6116"
                        stroke="#CD6116"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1230.48 824.74L1558.3 835.449L1682.65 1403.04L1230.48 824.74Z"
                        fill="#F6851B"
                        stroke="#F6851B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1230.48 824.74L345.784 6.08252L934.79 380.309L1230.48 824.74ZM934.195 2258.58L165.513 2496.56L12.0146 1910.53L934.195 2258.58Z"
                        fill="#E4761B"
                        stroke="#E4761B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M265.465 1304.27L555.803 1076.41L799.14 1132.93L265.465 1304.27Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M799.139 1132.93L555.803 1076.41L686.098 538.567L799.139 1132.93Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M194.666 1115.67L555.803 1076.41L265.465 1304.27L194.666 1115.67Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1930.74 1582.12L1780.81 1506.56L1682.65 1403.04L1930.74 1582.12Z"
                        fill="#CD6116"
                        stroke="#CD6116"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M194.666 1115.67L169.083 980.618L555.803 1076.41L194.666 1115.67Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1749.88 1676.72L1780.81 1506.56L1930.74 1582.12L1749.88 1676.72Z"
                        fill="#233447"
                        stroke="#233447"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1940.86 1793.33L1749.88 1676.72L1930.74 1582.12L1940.86 1793.33Z"
                        fill="#F6851B"
                        stroke="#F6851B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M555.803 1076.41L169.082 980.618L137.55 866.982L555.803 1076.41ZM686.098 538.567L555.803 1076.41L137.55 866.982L686.098 538.567ZM686.098 538.567L1230.48 824.74L799.139 1132.93L686.098 538.567Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M799.14 1132.93L1230.48 824.74L1422.65 1411.96L799.14 1132.93ZM1422.65 1411.96L826.508 1399.47L799.14 1132.93L1422.65 1411.96Z"
                        fill="#E4761B"
                        stroke="#E4761B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M265.465 1304.27L799.14 1132.93L826.508 1399.47L265.465 1304.27ZM1682.65 1403.04L1422.65 1411.96L1230.48 824.74L1682.65 1403.04Z"
                        fill="#F6851B"
                        stroke="#F6851B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1780.81 1506.56L1749.88 1676.72L1682.65 1403.04L1780.81 1506.56Z"
                        fill="#CD6116"
                        stroke="#CD6116"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M345.784 6.08252L1230.48 824.74L686.098 538.567L345.784 6.08252Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M12.0146 1910.53L758.088 1879.59L934.195 2258.58L12.0146 1910.53Z"
                        fill="#E4761B"
                        stroke="#E4761B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M934.194 2258.58L758.088 1879.59L1124.58 1861.75L934.194 2258.58Z"
                        fill="#CD6116"
                        stroke="#CD6116"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1749.88 1676.72L1940.86 1793.33L2046.16 2041.42L1749.88 1676.72ZM826.508 1399.47L12.0146 1910.53L265.465 1304.27L826.508 1399.47ZM758.088 1879.59L12.0146 1910.53L826.508 1399.47L758.088 1879.59ZM1682.65 1403.04L1731.43 1580.33L1495.83 1594.02L1682.65 1403.04ZM1495.83 1594.02L1422.65 1411.96L1682.65 1403.04L1495.83 1594.02Z"
                        fill="#F6851B"
                        stroke="#F6851B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1134.69 2337.11L934.194 2258.58L1631.48 2375.79L1134.69 2337.11Z"
                        fill="#C0AD9E"
                        stroke="#C0AD9E"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M265.465 1304.27L151.234 1157.91L194.666 1115.67L265.465 1304.27Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1710.61 2288.92L1631.48 2375.79L934.194 2258.58L1710.61 2288.92Z"
                        fill="#D7C1B3"
                        stroke="#D7C1B3"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1748.09 2075.93L934.194 2258.58L1124.58 1861.75L1748.09 2075.93Z"
                        fill="#E4761B"
                        stroke="#E4761B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M934.194 2258.58L1748.09 2075.93L1710.61 2288.92L934.194 2258.58Z"
                        fill="#D7C1B3"
                        stroke="#D7C1B3"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M137.55 866.982L110.777 409.462L686.098 538.567L137.55 866.982ZM194.665 1115.67L115.536 1035.35L169.082 980.618L194.665 1115.67Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1289.38 1529.76L1422.65 1411.96L1403.61 1699.92L1289.38 1529.76Z"
                        fill="#CD6116"
                        stroke="#CD6116"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1422.65 1411.96L1289.38 1529.76L1095.43 1630.31L1422.65 1411.96Z"
                        fill="#CD6116"
                        stroke="#CD6116"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M2046.16 2041.42L2009.87 2014.65L1749.88 1676.72L2046.16 2041.42Z"
                        fill="#F6851B"
                        stroke="#F6851B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1095.43 1630.31L826.508 1399.47L1422.65 1411.96L1095.43 1630.31Z"
                        fill="#CD6116"
                        stroke="#CD6116"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1403.61 1699.92L1422.65 1411.96L1495.83 1594.02L1403.61 1699.92Z"
                        fill="#E4751F"
                        stroke="#E4751F"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M89.3589 912.199L137.55 866.982L169.083 980.618L89.3589 912.199Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1403.61 1699.92L1095.43 1630.31L1289.38 1529.76L1403.61 1699.92Z"
                        fill="#233447"
                        stroke="#233447"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M686.098 538.567L110.777 409.462L345.784 6.08252L686.098 538.567Z"
                        fill="#763D16"
                        stroke="#763D16"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1631.48 2375.79L1664.2 2465.03L1134.69 2337.12L1631.48 2375.79Z"
                        fill="#C0AD9E"
                        stroke="#C0AD9E"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1124.58 1861.75L1095.43 1630.31L1403.61 1699.92L1124.58 1861.75Z"
                        fill="#F6851B"
                        stroke="#F6851B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M826.508 1399.47L1095.43 1630.31L1124.58 1861.75L826.508 1399.47Z"
                        fill="#E4751F"
                        stroke="#E4751F"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1495.83 1594.02L1731.43 1580.33L2009.87 2014.65L1495.83 1594.02ZM826.508 1399.47L1124.58 1861.75L758.088 1879.59L826.508 1399.47Z"
                        fill="#F6851B"
                        stroke="#F6851B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1495.83 1594.02L1788.55 2039.64L1403.61 1699.92L1495.83 1594.02Z"
                        fill="#E4751F"
                        stroke="#E4751F"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1403.61 1699.92L1788.55 2039.64L1748.09 2075.93L1403.61 1699.92Z"
                        fill="#F6851B"
                        stroke="#F6851B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1748.09 2075.93L1124.58 1861.75L1403.61 1699.92L1748.09 2075.93ZM2009.87 2014.65L1788.55 2039.64L1495.83 1594.02L2009.87 2014.65Z"
                        fill="#F6851B"
                        stroke="#F6851B"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M2068.18 2224.07L1972.99 2415.05L1664.2 2465.03L2068.18 2224.07ZM1664.2 2465.03L1631.48 2375.79L1710.61 2288.92L1664.2 2465.03Z"
                        fill="#C0AD9E"
                        stroke="#C0AD9E"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1710.61 2288.92L1768.92 2265.72L1664.2 2465.03L1710.61 2288.92ZM1664.2 2465.03L1768.92 2265.72L2068.18 2224.07L1664.2 2465.03Z"
                        fill="#C0AD9E"
                        stroke="#C0AD9E"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M2009.87 2014.65L2083.05 2059.27L1860.54 2086.04L2009.87 2014.65Z"
                        fill="#161616"
                        stroke="#161616"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1860.54 2086.04L1788.55 2039.64L2009.87 2014.65L1860.54 2086.04ZM1834.96 2121.15L2105.66 2088.42L2068.18 2224.07L1834.96 2121.15Z"
                        fill="#161616"
                        stroke="#161616"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M2068.18 2224.07L1768.92 2265.72L1834.96 2121.15L2068.18 2224.07ZM1768.92 2265.72L1710.61 2288.92L1748.09 2075.93L1768.92 2265.72ZM1748.09 2075.93L1788.55 2039.64L1860.54 2086.04L1748.09 2075.93ZM2083.05 2059.27L2105.66 2088.42L1834.96 2121.15L2083.05 2059.27Z"
                        fill="#161616"
                        stroke="#161616"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1834.96 2121.15L1860.54 2086.04L2083.05 2059.27L1834.96 2121.15ZM1748.09 2075.93L1834.96 2121.15L1768.92 2265.72L1748.09 2075.93Z"
                        fill="#161616"
                        stroke="#161616"
                        stroke-width="5.94955"
                      />{' '}
                      <path
                        d="M1860.54 2086.04L1834.96 2121.15L1748.09 2075.93L1860.54 2086.04Z"
                        fill="#161616"
                        stroke="#161616"
                        stroke-width="5.94955"
                      />{' '}
                    </g>{' '}
                    <defs>
                      {' '}
                      <clipPath id="clip0_1512_1323">
                        {' '}
                        <rect
                          width="2404"
                          height="2500"
                          fill="white"
                          transform="translate(0.519043 0.132812)"
                        />{' '}
                      </clipPath>{' '}
                    </defs>{' '}
                  </svg>
                  Connect Wallet
                </button>
              ) : null}

              <div className="my-12">
                Hey, looking for a <strong>super-safe experience</strong>?{' '}
                <span className="emoji">😃</span>
                <br />
                You can interact with the smart-contract{' '}
                <strong>directly</strong> through{' '}
                <a
                  href={this.generateContractUrl()}
                  target="_blank"
                  className="bg-yellow-100 text-yellow-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-200 dark:text-yellow-900"
                >
                  {this.state.networkConfig.blockExplorer.name}
                </a>
                , without even connecting your wallet to this DAPP!{' '}
              </div>

              {!this.isWalletConnected() ||
              this.state.isWhitelistMintEnabled ? (
                <div className="flex flex-col gap-4">
                  <h2>Whitelist Proof</h2>
                  <p>
                    Anyone can generate the proof using any public address in
                    the list, but{' '}
                    <strong>only the owner of that address</strong> will be able
                    to make a successful transaction by using it.
                  </p>
                  {this.state.merkleProofManualAddressFeedbackMessage ? (
                    <div className="feedback-message">
                      {this.state.merkleProofManualAddressFeedbackMessage}
                    </div>
                  ) : null}
                  <label htmlFor="merkle-proof-manual-address">
                    Public address:
                  </label>
                  <input
                    className="p-2 rounded-md"
                    id="merkle-proof-manual-address"
                    type="text"
                    placeholder="0x000..."
                    disabled={this.state.userAddress !== null}
                    value={
                      this.state.userAddress ??
                      this.state.merkleProofManualAddress
                    }
                    ref={(input) =>
                      (this.merkleProofManualAddressInput = input!)
                    }
                    onChange={() => {
                      this.setState({
                        merkleProofManualAddress:
                          this.merkleProofManualAddressInput.value
                      })
                    }}
                  />{' '}
                  <button
                    onClick={() => this.copyMerkleProofToClipboard()}
                    className="border border-green-600 inline p-2 text-blue-200"
                  >
                    Generate and copy to clipboard
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  private setError(error: any = null): void {
    let errorMessage = 'Unknown error...'

    if (null === error || typeof error === 'string') {
      errorMessage = error
    } else if (typeof error === 'object') {
      // Support any type of error from the Web3 Provider...
      if (error?.error?.message !== undefined) {
        errorMessage = error.error.message
      } else if (error?.data?.message !== undefined) {
        errorMessage = error.data.message
      } else if (error?.message !== undefined) {
        errorMessage = error.message
      } else if (React.isValidElement(error)) {
        this.setState({ errorMessage: error })

        return
      }
    }

    this.setState({
      errorMessage:
        null === errorMessage
          ? null
          : errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)
    })
  }

  private generateContractUrl(): string {
    return this.state.networkConfig.blockExplorer.generateContractUrl(
      CollectionConfig.contractAddress!
    )
  }

  private generateMarketplaceUrl(): string {
    return CollectionConfig.marketplaceConfig.generateCollectionUrl(
      CollectionConfig.marketplaceIdentifier,
      !this.isNotMainnet()
    )
  }

  private async connectWallet(): Promise<void> {
    try {
      await this.provider.provider.request!({ method: 'eth_requestAccounts' })

      this.initWallet()
    } catch (e) {
      this.setError(e)
    }
  }

  private async initWallet(): Promise<void> {
    const walletAccounts = await this.provider.listAccounts()

    this.setState(defaultState)

    if (walletAccounts.length === 0) {
      return
    }

    const network = await this.provider.getNetwork()
    let networkConfig: NetworkConfigInterface

    if (network.chainId === CollectionConfig.mainnet.chainId) {
      networkConfig = CollectionConfig.mainnet
    } else if (network.chainId === CollectionConfig.testnet.chainId) {
      networkConfig = CollectionConfig.testnet
    } else {
      this.setError('Unsupported network!')

      return
    }

    this.setState({
      userAddress: walletAccounts[0],
      network,
      networkConfig
    })

    if (
      (await this.provider.getCode(CollectionConfig.contractAddress!)) === '0x'
    ) {
      this.setError(
        'Could not find the contract, are you connected to the right chain?'
      )

      return
    }

    this.contract = new ethers.Contract(
      CollectionConfig.contractAddress!,
      ContractAbi,
      this.provider.getSigner()
    ) as NftContractType

    this.setState({
      maxSupply: (await this.contract.maxSupply()).toNumber(),
      totalSupply: (await this.contract.totalSupply()).toNumber(),
      maxMintAmountPerTx: (await this.contract.maxMintAmountPerTx()).toNumber(),
      tokenPrice: await this.contract.cost(),
      isPaused: await this.contract.paused(),
      isWhitelistMintEnabled: await this.contract.whitelistMintEnabled(),
      isUserInWhitelist: Whitelist.contains(this.state.userAddress ?? '')
    })
  }

  private registerWalletEvents(browserProvider: ExternalProvider): void {
    // @ts-ignore
    browserProvider.on('accountsChanged', () => {
      this.initWallet()
    })

    // @ts-ignore
    browserProvider.on('chainChanged', () => {
      window.location.reload()
    })
  }
}
