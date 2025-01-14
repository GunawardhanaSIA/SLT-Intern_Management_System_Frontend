import React, { useState } from 'react'
import {Input, Button} from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Outlet } from 'react-router-dom';

const Authentication = () => {
    return (
    <div className='flex flex-col gap-12 items-center justify-center h-screen'>
        <div>
            <a href="/"><img src="/logo.png" alt="logo" className='w-80' /></a>
        </div>
        <div className='lg:w-1/4'>
            <Outlet/>
        </div>
    </div>
  )
}

export default Authentication