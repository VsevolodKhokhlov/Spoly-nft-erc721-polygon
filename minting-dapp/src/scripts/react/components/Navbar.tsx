import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <section>
      <nav className="text-green-600 font-bold">
        <div className="flex justify-between items-center px-10 md:px-40 pt-8">
          <div>
            <div className="center">
              <img src="/build/images/skulla.png" width="80" />
              <p className="font-bold text-gray-100 mt-3 -ml-2 text-3xl">
                SPoly
              </p>
            </div>
          </div>
          <ul
            className="
      list-none
      md:grid grid-rows-1 grid-flow-col
      gap-4
      lg:gap-10
     hidden
    "
          >
            <a href="/" className="hover:text-purple-600 focus:text-purple-600">
              <li className="link p-2">Home</li>
            </a>
            <a
              href="#faq"
              className="hover:text-purple-600 focus:text-purple-600"
            >
              <li className="link p-2">FAQ</li>
            </a>
            <a
              href="#support"
              className="hover:text-purple-600 focus:text-purple-600"
            >
              <li className="link p-2">Support</li>
            </a>
          </ul>
          <div className="flex gap-3">
            <Link to="mint">
              <button
                type="button"
                className="
        inline-flex
        items-center
        px-6
        py-2
        border border-transparent
        text-base
        font-medium
        rounded-full
        text-purple-100
        bg-purple-500
        shadow-lg
        hover:bg-purple-600
        hover:shadow-none
        focus:outline-none
        focus:ring-2
        focus:ring-offset-2
        focus:ring-purple-600
      "
              >
                Mint NFT
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </section>
  )
}

export default Navbar
