import Infobox from './Infobox'

const Achievement = () => {
  return (
    <section className="my-16 md:my-40 mx-6 sm:mx-12 md:mx-28 flex md:flex-row flex-col md:flex-nowrap flex-wrap justify-between items-center gap-10 md:gap-24">
      <div className="w-1/2 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Infobox number="23" text="Total Presale" />
        <Infobox number="640/Matic" text="Raised In Total" />
        <Infobox number="2,455,180" text="Holders" />
        <Infobox number="234/day" text="Transactions" />
      </div>
      <div className="md:w-1/2 w-full">
        <h2>Large Achievement</h2>
        <p className="my-4">
          Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
          sint. Velit officia consequat duis enim velit mollit. Exercitation
          veniam consequat sunt nostrud amet.
        </p>
        <span className="b-pink mt-1 flex items-center">
          <p className="text-b-pink hover:pink-800 focus:pink-900">
            Read more{' '}
          </p>
          <img
            className="ml-1"
            src="https://takeoff-crypto.netlify.app/readmore.svg"
            width="30"
            height="auto"
            alt="arrow"
          />{' '}
        </span>
      </div>
    </section>
  )
}

export default Achievement

