import Header from "./components/Header"
import Navbar from "./components/Navbar"
import Featbox from './components/Featbox';
import How from "./components/How";
import Achievement from "./components/Achievement";
import Faq from "./components/Faq";
import Footer from "./components/Footer";
import Support from "./components/Support";


const Dapp = () => {
  return (
    <>
       <header className="bg-bn min-h-screen	bg-gray-800">
          <Navbar />
          <Header />
        </header>
        <Featbox />
        <How />
        <Achievement />
        <Faq />
        <Support />
        <Footer />
    </>
  )
}

export default Dapp
