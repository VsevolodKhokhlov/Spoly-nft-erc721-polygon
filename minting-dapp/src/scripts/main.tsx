import '../styles/main.scss';

import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'
import Dapp from './react/Dapp';
import CollectionConfig from '../../../smart-contract/config/CollectionConfig';

if (document.title === '') {
  document.title = CollectionConfig.tokenName;
}

document.addEventListener('DOMContentLoaded', async () => {
  ReactDOM.render(<BrowserRouter><Dapp /></BrowserRouter>, document.getElementById('minting-dapp'));
});
