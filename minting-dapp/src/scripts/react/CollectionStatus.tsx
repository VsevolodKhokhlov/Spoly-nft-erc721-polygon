import React from 'react';

interface Props {
  userAddress: string|null;
  totalSupply: number;
  maxSupply: number;
  isPaused: boolean;
  isWhitelistMintEnabled: boolean;
  isUserInWhitelist: boolean;
}

interface State {
}

const defaultState: State = {
};

export default class CollectionStatus extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = defaultState;
  }

  private isSaleOpen(): boolean
  {
    return this.props.isWhitelistMintEnabled || !this.props.isPaused;
  }

  render() {
    return (
      <>
        <div className="collection-status">
          <div className="user-address">
            <span className="text-green-400">Wallet address: </span>
            <span className="font-bold text-white">
              {this.props.userAddress}
            </span>
          </div>

          <div className="center gap-x-4">
            <div className="inline-flex flex-col bg-gray-800 p-6 mt-8 items-center gap-2">
              <span className="label">Supply</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 font-bold text-2xl">
                {this.props.totalSupply}/{this.props.maxSupply}
              </span>
            </div>
            <div className="inline-flex flex-col bg-gray-800 p-6 mt-8 items-center gap-2">
              <span className="label">Sale status</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500 font-bold text-2xl">
                {this.isSaleOpen() ? (
                  <>
                    {this.props.isWhitelistMintEnabled
                      ? 'Whitelist only'
                      : 'Open'}
                  </>
                ) : (
                  'Closed'
                )}
              </span>
            </div>
          </div>
        </div>
      </>
    )
  }
}
