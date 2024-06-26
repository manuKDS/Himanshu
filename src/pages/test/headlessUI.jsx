import { Disclosure } from '@headlessui/react'
// import { ChevronUpIcon } from '@heroicons/react/20/solid'

export default function headlessUI() {

  {/* <ChevronUpIcon
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-blue-500`}
                /> */}

  return (
    <div className="w-full px-4 pt-16">
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-2">
        <Disclosure>
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                <span>What is your refund policy?</span>
                {/* <svg
                  xmlns='http://www.w3.org/2000/svg'
                  //className='icon icon-tabler icon-tabler-chevron-down'
                  width='17'
                  height='17'
                  viewBox='0 0 24 24'
                  strokeWidth='3'
                  stroke='currentColor'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-blue-500`}
                >
                  <path stroke='none' d='M0 0h17v17H0z' fill='none'></path>
                  <path d='M6 9l6 6l6 -6'></path>
                </svg> */}
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 bg-gray-50">
                If you're unhappy with your purchase for any reason, email us
                within 90 days and we'll refund you in full, no questions asked.
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Disclosure as="div" className="mt-2">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full justify-between rounded-lg bg-blue-100 px-4 py-2 text-left text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                <span>Do you offer technical support?</span>
                {/* <svg
                  xmlns='http://www.w3.org/2000/svg'
                  //className='icon icon-tabler icon-tabler-chevron-down'
                  width='17'
                  height='17'
                  viewBox='0 0 24 24'
                  strokeWidth='3'
                  stroke='currentColor'
                  fill='none'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-blue-500`}
                >
                  <path stroke='none' d='M0 0h17v17H0z' fill='none'></path>
                  <path d='M6 9l6 6l6 -6'></path>
                </svg> */}
              </Disclosure.Button>
              <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 bg-gray-50">
                No.
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  )
}
