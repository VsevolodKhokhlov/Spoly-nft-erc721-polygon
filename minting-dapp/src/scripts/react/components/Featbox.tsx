const Infobox = () => {
  return (
    <section className="relative py-20 2xl:py-40 overflow-hidden mx-6 sm:mx-12 md:mx-28 my-6 sm:my-12 md:my-3">
      <div className="container px-4 mx-auto">
        <div>
          <div className="flex flex-wrap -mx-6 lg:-mx-8">
            <div className="w-full text-center md:w-1/2 lg:w-1/4 px-6 lg:px-8 mb-20 lg:mb-0">
              <span className="flex mb-10 justify-center items-center w-20 h-20 bg-blue-500 shadow-lg shadow-orange-700 rounded-full mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={32}
                  height={32}
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M18 7h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h15v4zM4 9v10h16V9H4zm0-4v2h12V5H4zm11 8h3v2h-3v-2z"
                    fill="rgba(255,255,255,1)"
                  />
                </svg>
              </span>
              <h3 className="mt-12 mb-8 text-lg font-bold font-heading">
                Wallet
              </h3>
              <p className="text-lg ">
                {' '}
                The brown me quam, sagittis porttitor lorem vel, commodo
                fringilla nisl.{' '}
              </p>
            </div>
            <div className="w-full text-center md:w-1/2 lg:w-1/4 px-6 lg:px-8 mb-20 lg:mb-0">
              <span className="flex mb-10 justify-center items-center w-20 h-20 bg-yellow-500 shadow-lg shadow-orange-700 rounded-full mx-auto">
                <p className="text-white font-semibold text-2xl">$</p>
              </span>
              <h3 className="mt-12 mb-8 text-lg font-bold font-heading">
                Cheap
              </h3>
              <p className="text-lg">
                {' '}
                It’s over, maecenas tincidunt malesuada dolor sit amet
                malesuada.{' '}
              </p>
            </div>
            <div className="w-full text-center md:w-1/2 lg:w-1/4 px-6 lg:px-8 mb-10 lg:mb-0">
              <span className="flex mb-10 justify-center items-center w-20 h-20 bg-green-500 shadow-lg shadow-orange-700 rounded-full mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={36}
                  height={36}
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M14 9V4H5v16h6.056c.328.417.724.785 1.18 1.085l1.39.915H3.993A.993.993 0 0 1 3 21.008V2.992C3 2.455 3.449 2 4.002 2h10.995L21 8v1h-7zm-2 2h9v5.949c0 .99-.501 1.916-1.336 2.465L16.5 21.498l-3.164-2.084A2.953 2.953 0 0 1 12 16.95V11zm2 5.949c0 .316.162.614.436.795l2.064 1.36 2.064-1.36a.954.954 0 0 0 .436-.795V13h-5v3.949z"
                    fill="rgba(255,255,255,1)"
                  />
                </svg>
              </span>
              <h3 className="mt-12 mb-8 text-lg font-bold font-heading">
                Security
              </h3>
              <p className="text-lg ">
                {' '}
                The time, this accumsan augue, posuere posuere elit lorem.{' '}
              </p>
            </div>
            <div className="w-full text-center md:w-1/2 lg:w-1/4 px-6 lg:px-8">
              <span className="flex mb-10 justify-center items-center w-20 h-20 bg-pink-500 shadow-lg shadow-orange-700 rounded-full mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={36}
                  height={36}
                >
                  <path fill="none" d="M0 0h24v24H0z" />
                  <path
                    d="M21 1v12A9 9 0 1 1 7.375 5.278L14 1.453v2.77L21 1zm-9 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"
                    fill="rgba(255,255,255,1)"
                  />
                </svg>
              </span>
              <h3 className="mt-12 mb-8 text-lg font-bold font-heading">
                {' '}
                Speed{' '}
              </h3>
              <p className="text-lg ">
                {' '}
                Again and again vehicula libero at nibh volutpat lacinia non sed
                you see.{' '}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Infobox
