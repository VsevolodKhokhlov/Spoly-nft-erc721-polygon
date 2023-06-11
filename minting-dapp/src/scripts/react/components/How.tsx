const How = () => {
  return (
    <section className="bg-[#000813] py-10">
      <div className="mx-6 sm:mx-12 md:mx-28 my-6 sm:my-12 md:my-3">
        <h1 className="text-center text-3xl lg:text-4xl font-bold font-heading mb-10">
          How To Mint NFT
        </h1>
        <div className="grid grid-cols-3 text-center gap-4  mx-auto">
          <div className="border-anim pt-4">
            <p className="uppercase text-purple-500 font-bold">Step 1</p>
            <p className="font-semibold">Connect Wallet</p>
          </div>
          <div className="border-anim pt-4">
            <p className="uppercase text-yellow-500 font-bold">Step 2</p>
            <p className="font-semibold">Select Polygon</p>
          </div>
          <div className="border-anim pt-4">
            <p className="uppercase text-green-400 font-bold">Step 3</p>
            <p className="font-semibold">Mint NFT</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default How
