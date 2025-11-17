import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsLetterBox from '../components/NewsLetterBox'

const About = () => {
  return (
    <div>
      <div className='text-2xl text-center pt-8 border-t'>
        <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-16'>
        <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="About Us" />
        
        <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
          
          <h2 className='text-xl font-semibold text-gray-800'>Who We Are</h2>
          <p>
            We are your trusted destination for high-quality electronic components,
            modules, development boards, sensors, tools, and accessories. Whether you
            are a hobbyist, student, or professional engineer, we provide the products
            you need to bring your electronic projects to life.
          </p>

          <h2 className='text-xl font-semibold text-gray-800'>Our Mission</h2>
          <p>
            Our mission is to make electronics accessible and affordable for everyone.
            We aim to support innovation by offering reliable components, fast
            delivery, and a seamless online shopping experience. We help creators,
            learners, and professionals build the future—one component at a time.
          </p>

          <h2 className='text-xl font-semibold text-gray-800'>Our Vision</h2>
          <p>
            We envision becoming a globally trusted electronics supplier known for
            quality, affordability, and exceptional service. Our goal is to empower
            engineers and innovators to explore technology with confidence and build
            smarter, more sustainable solutions.
          </p>
        </div>
      </div>

      <div className='text-xl py-4'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20'>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Trusted Quality Components :</b>
          <p className='text-gray-600'>
            We provide only authentic and reliable components sourced from reputable
            manufacturers. Every product is carefully inspected to ensure it meets
            industry standards—giving you the confidence to build robust and durable
            electronic solutions.
          </p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Convenience & Fast Delivery :</b>
          <p className='text-gray-600'>
            Our website is designed to make component shopping simple and fast. With
            clear product descriptions, easy navigation, and speedy shipping, you can
            get the parts you need without delays—perfect for urgent projects and
            deadlines.
          </p>
        </div>

        <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
          <b>Expert Customer Support :</b>
          <p className='text-gray-600'>
            Our technical support team is always ready to help—whether you need
            assistance choosing the right microcontroller, checking compatibility, or
            tracking your order. We are committed to providing friendly and reliable
            support to make your experience smooth and worry-free.
          </p>
        </div>

      </div>

      <NewsLetterBox />
    </div>
  )
}

export default About
