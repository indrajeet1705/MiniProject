import React from 'react'
import ModelCard from './ModelCard'
import NavSider from './NavSider'

const Models = () => {
  return (
    <div className='w-full h-screen flex item-center'>
      <NavSider/>
    <div className='w-[70vw] h-[90vh] flex flex-wrap  gap-5 p-8 '>
      
      <ModelCard></ModelCard>
      
    </div>
    </div>
  )
}

export default Models
