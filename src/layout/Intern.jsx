import React from 'react'
import { Outlet } from 'react-router-dom'

const Intern = () => {
  return (
    <div>
        <p>Intern Layout</p>
        <Outlet/>
    </div>
  )
}

export default Intern