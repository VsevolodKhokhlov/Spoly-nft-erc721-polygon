const Community = () => {
  return (
    <div className="flex flex-col space-y-5">
      <div className="flex gap-x-2 items-center">
        <img src="https://takeoff-crypto.netlify.app/discord.svg/" alt="com" />
        <h4>Community</h4>
      </div>
      <div className="flex gap-x-2 text-gray-100">
        <a href="/">
          <div className="flex bg-gray-700 px-3 py-3 rounded gap-2 justify-center items-center">
            <img
              src="https://takeoff-crypto.netlify.app/discord.svg/"
              alt="dis"
              width="35"
            />
            <h5>Discord</h5>
          </div>
        </a>
        <a href="/">
          <div className="flex bg-gray-500 px-3 py-3 rounded gap-2 justify-center items-center">
            <img
              src="https://takeoff-crypto.netlify.app/telegram.svg"
              alt="dis"
              width="40"
            />
            <h5>Telegram</h5>
          </div>
        </a>
      </div>
    </div>
  )
}

export default Community
