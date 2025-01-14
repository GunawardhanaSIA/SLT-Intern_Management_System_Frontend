import React, { useState } from 'react'
import {Input, Button} from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [reEnterPassword, setReEnterPassword] = useState('');
    const [isVisible, setIsVisible] = React.useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
      navigate('/authenticate/login');
    };

    const handleSignUp = () => {
        // Validate fields
        if (!email || !password || !reEnterPassword) {
          setErrorMessage("All fields are required.");
          return;
        }
    
        // Validate password match
        if (password !== reEnterPassword) {
          setErrorMessage("Passwords do not match.");
          return;
        }
    
        // Clear error and proceed
        setErrorMessage("");
        navigate("/authenticate/confirm-email"); 
    };

  return (
    <div>
      <h1 className='text-3xl font-bold flex justify-center'>Let’s get started</h1>
      <p className='text-gray flex text-center mt-1'>Create your account to apply for internships with <br/>SLTMobitel - Digital Platforms</p>
      
      <div className='mt-6 mb-4 flex flex-col gap-4'>
        <Input 
            variant='bordered' 
            size='md' 
            labelPlacement='outside' 
            label={
                <span>
                Email<span className='text-red'> *</span>
                </span>
            } 
            placeholder="Enter your email" 
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <Input 
            variant='bordered' 
            size='md' 
            labelPlacement='outside' 
            label={
                <span>
                Password<span className='text-red'> *</span>
                </span>
            } 
            placeholder="Enter your password" 
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            endContent={
                <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                >
                {isVisible ? (
                    <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                ) : (
                    <FaEye className="text-xl text-default-400 pointer-events-none" />
                )}
                </button>
            }
        />
        <Input 
            variant='bordered' 
            size='md' 
            labelPlacement='outside' 
            label={
                <span>
                Re-enter Password<span className='text-red'> *</span>
                </span>
            } 
            placeholder="Re-enter your email" 
            type={isVisible ? "text" : "password"}
            value={reEnterPassword}
            onChange={(e) => setReEnterPassword(e.target.value)}
            endContent={
                <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                >
                {isVisible ? (
                    <FaEyeSlash className="text-xl text-default-400 pointer-events-none" />
                ) : (
                    <FaEye className="text-xl text-default-400 pointer-events-none" />
                )}
                </button>
            }
        />
      </div>
  
      {errorMessage && <p className="text-red font-light text-xs mt-4">{errorMessage}</p>}

      <div className='mt-4'>
        <Button className='w-full bg-blue font-bold text-white' onPress={handleSignUp}>Sign up</Button>
        <p className='flex gap-2 justify-center mt-2 text-sm text-gray'>Already have an account? <span className='text-blue font-semibold'><a className='cursor-pointer' onClick={handleLogin}>Log in</a></span></p>
      </div>
    </div>
  )
}

export default Signup