import React, { useEffect, useState } from 'react'

function Github() {
  const [data, setData] = useState([])
  useEffect(() => {
    fetch('https:api.github.com/users/pranay-1905')
    .then(response => response.json())
    .then(data => {
      console.log(data);
      setData(data)
    })
  })
  return (
    <div className='text-center m-4 bg-gray-600 text-white p-4 text-3xl'>
      Github Followers: {data.followers}
      <img className='flex-wrap justify-between items-center mx-auto max-w-screen-xl mt-3' src={data.avatar_url} alt="git-picture" width={200}/>
    </div>
  )
}

export default Github
