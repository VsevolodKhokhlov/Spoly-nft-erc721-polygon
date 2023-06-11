import { utils, BigNumber } from 'ethers';
import React from 'react';
import NetworkConfigInterface from '../../../../smart-contract/lib/NetworkConfigInterface';

interface Props {
  networkConfig: NetworkConfigInterface;
  maxSupply: number;
  totalSupply: number;
  tokenPrice: BigNumber;
  maxMintAmountPerTx: number;
  isPaused: boolean;
  isWhitelistMintEnabled: boolean;
  isUserInWhitelist: boolean;
  mintTokens(mintAmount: number): Promise<void>;
  whitelistMintTokens(mintAmount: number): Promise<void>;
}

interface State {
  mintAmount: number;
}

const defaultState: State = {
  mintAmount: 1,
};

export default class MintWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = defaultState;
  }

  private canMint(): boolean {
    return !this.props.isPaused || this.canWhitelistMint();
  }

  private canWhitelistMint(): boolean {
    return this.props.isWhitelistMintEnabled && this.props.isUserInWhitelist;
  }

  private incrementMintAmount(): void {
    this.setState({
      mintAmount: Math.min(this.props.maxMintAmountPerTx, this.state.mintAmount + 1),
    });
  }

  private decrementMintAmount(): void {
    this.setState({
      mintAmount: Math.max(1, this.state.mintAmount - 1),
    });
  }

  private async mint(): Promise<void> {
    if (!this.props.isPaused) {
      await this.props.mintTokens(this.state.mintAmount);

      return;
    }

    await this.props.whitelistMintTokens(this.state.mintAmount);
  }

  render() {
    return (
      <>
        {this.canMint() ? (
          <div className="mint-widget">
            <div className="preview">
              <img
                src="/build/images/preview.png"
                alt="Collection preview"
                width="300"
                className="text-center mx-auto bg-green-400 my-6 rounded-md"
              />
            </div>

            <div className="text-transparent text-center bg-clip-text bg-gradient-to-r from-red-500 to-blue-500 font-bold text-xl">
              <strong>Total price:</strong>{' '}
              {utils.formatEther(
                this.props.tokenPrice.mul(this.state.mintAmount)
              )}{' '}
              {this.props.networkConfig.symbol}
            </div>

            <div className="center gap-4">
              <button
                className="bg-red-400 px-6 py-1 text-white font-bold text-2xl my-6 rounded shadow-md"
                onClick={() => this.decrementMintAmount()}
              >
                -
              </button>
              <span className="font-bold text-2xl text-green-100">
                {this.state.mintAmount}
              </span>
              <button
                className="bg-red-400 px-6 py-1 text-white font-bold text-2xl my-6 rounded shadow-md"
                onClick={() => this.incrementMintAmount()}
              >
                +
              </button>
            </div>
            <button
              className="center mx-auto w-full text-white font-bold text-lg bg-green-600 p-4 my-1 shadow-lg hover:shadow-blue-500 rounded-md"
              onClick={() => this.mint()}
            >
              Mint
            </button>
          </div>
        ) : (
          <div className="cannot-mint">
            <span className="emoji">⏳</span>
            {this.props.isWhitelistMintEnabled ? (
              <>
                You are not included in the <strong>whitelist</strong>.
              </>
            ) : (
              <>
                The contract is <strong>paused</strong>.
              </>
            )}
            <br />
            Please come back during the next sale !
          </div>
        )}
      </>
    )
  }
}
