import React, { useState } from 'react'
import {Input, Button} from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Outlet } from 'react-router-dom';
import {Card, CardBody} from "@nextui-org/react";

const Authentication = () => {
    return (
    <div className='flex items-center justify-center h-screen'>
        <Card className='w-7/12'>
            <CardBody className='flex flex-row px-10'>
                <div className='w-7/12 flex items-center justify-center'>
                    <a href="/"><img src="/logo.png" alt="logo" /></a>
                </div>
                {/* Vertical Divider */}
                <div className="w-px bg-zinc-200 h-[400px] mx-6" />
                <div className='w-5/12 flex justify-center items-center'>
                    <Outlet/>
                </div>
            </CardBody>
        </Card>
    </div>
  )
}

export default Authentication