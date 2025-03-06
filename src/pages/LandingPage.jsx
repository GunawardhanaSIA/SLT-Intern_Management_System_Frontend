import React from 'react'
import {Button} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();
  
    const handleApply = () => {
        navigate('/authenticate/signin');
    };

  return (
    <div className='flex gap-32 items-center justify-center px-20 py-20'>
        <div className='flex w-4/12 flex-col items-center'>
            <h1 className='mt-10 text-center leading-10 text-3xl font-bold text-blue'>SLTMobitel - Digital Platforms</h1>
            <h1 className='mt-12 text-center text-lg font-semibold'>Apply for Internship at SLTMobitel Sri Lanka</h1>
            <p className='text-justify mt-3 leading-7 text-gray-500'>Kickstart your career with SLTMobitel, Sri Lanka's leading telecom provider. 
            Join our dynamic internship program to gain hands-on experience in cutting-edge technologies, innovation, and business processes. 
            Build your skills, grow professionally, and be part of shaping the future!
            </p>
            <Button className='mt-10 text-white font-bold bg-green' onPress={handleApply}>Apply for Internship</Button>
        </div>
        <div className='w-6/12'>
            <a href="/"><img src="logo.png" alt="logo" /></a>
        </div>
    </div>
  )
}

export default LandingPage