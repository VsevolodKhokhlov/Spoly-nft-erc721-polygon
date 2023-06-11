import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import NoPage from './NoPage'
import Mint from './Mint'

const Dapp = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="mint" element={<Mint />} />
      <Route path="*" element={<NoPage />} />
    </Routes>
  )
}

export default Dapp
