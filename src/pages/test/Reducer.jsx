import React from 'react'

const Reducer = () => {
  const arr=[2,5,7,4]

  const result = arr.reduce((sum, num)=> sum += num, 0)
  const max = arr.reduce((max, num)=> num > max ? num : max, arr[0])
  return (
   <div>
    Hello = {result} - {max}
   </div>
  )
}

export default Reducer