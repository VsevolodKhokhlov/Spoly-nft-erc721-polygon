import { Link } from 'react-router-dom'
const NoPage = () => {
  return (
    <>
      <div>Page Not Foun! Tada</div>{' '}
      <Link to="/">
        <button
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
          Back Home
        </button>
      </Link>
    </>
  )
}

export default NoPage
