const Header = () => {
  return (
    <section className="px-6 sm:px-12 md:px-28 py-6 sm:py-12">
      <div className="flex flex-wrap items-center -mx-3 text-white">
        <div className="w-full px-3 center">
          <div className="py-[200px]">
            <img
              src="	https://ezyhost.netlify.app/img/dot.ac964630.svg"
              alt="dot"
              className="dotfly"
            />
            <div className="relative max-w-xl mx-auto lg:mx-0 mb-8 text-center ">
              <h1 className="mb-4 text-3xl font-extrabold text-transparent sm:text-5xl bg-clip-text bg-gradient-to-r from-green-300 via-blue-500 to-purple-600">
                {' '}
                Metaverse{' '}
                <strong className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 p-4">
                  100 NFTS
                </strong>{' '}
                On the internet{' '}
              </h1>
              <p>
                {' '}
                Volentina opem ipsum, consectetur adipiscing elit. Sed luctus
                eget justo et iaculis. Quisque vitae nulla malesuada, auctor
                arcu vitae, luctus nisi.{' '}
              </p>
            </div>
            <div className="text-center relative ">
              <a
                href="#"
                className="block sm:inline-block py-4 px-8 mb-4 sm:mb-0 sm:mr-3 text-xs text-white text-center font-semibold leading-none bg-orange-600 hover:bg-blue-700 rounded"
              >
                Reddit
              </a>
              <a
                href="#"
                className="block sm:inline-block py-4 px-8 text-xs text-gray-100 hover:text-white-600 text-center font-semibold leading-none bg-blue-600  hover:border-blueGray-300 rounded"
              >
                Discord
              </a>
              <img
                src="	https://ezyhost.netlify.app/img/rotate.4277b93c.svg"
                alt="triangle"
                className="rotateme"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Header
