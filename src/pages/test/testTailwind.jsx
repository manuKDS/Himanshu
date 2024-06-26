import React from 'react'

const TestTailwind = () => {
  return (
    <div className='w-full h-screen bg-blue-300 flex items-center justify-center'>
        <div className='m-8 bg-white p-6 rounded-2xl shadow-2xl text-lg sm:flex sm:gap-16 sm:p-0'>
            <div className='flex gap-4 items-center'>
                <img className='w-10 h-10 sm:w-64 sm:h-full sm:rounded-none object-cover rounded-full' src="https://images.pexels.com/photos/39866/entrepreneur-startup-start-up-man-39866.jpeg?auto=compress&cs=tinysrgb&w=400" alt="" />
                <span>Steve Jobs</span>
            </div>
            <div className='pt-2'>
                <p className='text-gray-500 font-thin italic'>"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Odio maxime voluptatibus dicta beatae modi nulla dolore perferendis officia id, cum blanditiis ratione accusamus, praesentium ad minus, voluptates explicabo mollitia eius."</p>
                <span className='text-gray-600'>Founder - Apple Inc.</span>
            </div>
        </div>
    </div>
  )
}

export default TestTailwind