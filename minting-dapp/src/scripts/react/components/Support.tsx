import Community from "./Community"
import Form from "./Form"

const Support = () => {
  return (
    <section className='mt-16 md:mt-40 mx-6 sm:mx-12 md:mx-28' id='support'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-10 justify-between'>
          <Community/>
          <Form/>
      </div>
    </section>
  )
}

export default Support
