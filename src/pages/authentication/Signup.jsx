import React, { useState } from 'react'
import {Input, Button, CircularProgress} from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isVisible, setIsVisible] = React.useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleLogin = () => {
      navigate('/authenticate/signin');
    };

    const handleManualSignUp = async () => {
        // Validate fields
        if (!email) {
          setErrorMessage("Email is required.");
          return;
        }

        if (!password) {
          setErrorMessage("Password is required.");
          return;
        }

        setLoading(true);
    
        try {
          const response = await axios.post("http://localhost:8080/signup/manual", {
            email,
            password,
            role: "Intern"
          });

          console.log("Response of local sign-up: ", response.data);
          navigate('/authenticate/thank-you-for-registering')
        } catch (error) {
          console.log("Signup failed:", error);
          setErrorMessage("Signup failed. Please try again.")
          setLoading(false);
        }
    };

    const handleGoogleSignUpSuccess = async (token) => {
      console.log("Google JWT:", token);
      const decodedToken = jwtDecode(token);
      console.log("Decoded token: ", decodedToken)

      try {
        const response = await axios.post("http://localhost:8080/signup/google", {
          token: token
        });
        if (response.status === 200) {
          console.log("sign-up response data: ", response.data);
          const responseToken = response.data.jwt
          const decodedResponseToken = jwtDecode(responseToken);
          console.log("Decoded response token: ", decodedResponseToken)
          const user_id = decodedResponseToken.user_id;
          const user_role = decodedResponseToken.role;
          console.log("Signed up intern's user ID: ", user_id)
          
          // Save the token with expiration time (3 days)
          const expirationTime = new Date();
          expirationTime.setDate(expirationTime.getDate() + 3); // 3 days from now
          localStorage.setItem("token", responseToken);
          localStorage.setItem("tokenExpiration", expirationTime.getTime());

          // Navigate based on role
          if (user_role === "Intern") {
            navigate("/intern");
          } 
          if (user_role === "Admin") {
            navigate("/admin");
          } 
          if (user_role === "Supervisor") {
            navigate("/supervisor");
          }
        }
      } catch (error) {
        console.log("Signup failed:", error);
        setErrorMessage("Signup failed. Please try again.")
      }
    };


  return (
    <div>
      <h1 className='text-2xl flex font-semibold justify-center'>Create an account</h1>
     
      <div className='mt-6 mb-4 flex flex-col gap-4'>
        <Input 
          labelPlacement='outside' 
          label={
              <span>
              Email<span className='text-red'> *</span>
              </span>
          } 
          type="email"
          placeholder="Enter a valid email"
          size='md'
          variant='bordered'
          value={email}
          onChange={(e) => setEmail(e.target.value)} />

        <Input 
          labelPlacement='outside'
          label={
            <span>
            Password<span className='text-red'> *</span>
            </span>
          } 
          size='md'
          placeholder="Enter a password"
          variant='bordered' 
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
                <FaEyeSlash className="text-xl text-default-400 pointer-events-none flex items-center" />
            ) : (
                <FaEye className="text-xl text-default-400 pointer-events-none flex items-center" />
            )}
            </button>
        }/>
      </div>
  
      {errorMessage && <p className="text-red font-light text-xs my-4">{errorMessage}</p>}

      <Button
        className='flex w-full bg-blue text-white font-bold'
        onPress={handleManualSignUp}
        disabled={loading}
      >
        {loading ? <CircularProgress size='sm' color="default" /> : "Register"}
      </Button>

      <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color:'#e4e4e7'}}>
        <hr style={{ flex: 1 }} />
        <span style={{ margin: '0 10px', color: '#999' }}>OR</span>
        <hr style={{ flex: 1 }} />
      </div>

      <div className='mt-4 flex justify-center items-center flex-col'>
        <div className='w-full flex justify-center'>
          <GoogleLogin 
            onSuccess={credentialResponse => {
              handleGoogleSignUpSuccess(credentialResponse.credential);
            }}
            onError={() => {
              console.log('Sign up Failed');
              setErrorMessage("Sign up failed")
            }}
            size="large" 
            width="300" 
            text="continue_with"
            pr
          />
        </div>
        <p className='flex gap-2 justify-center mt-2 text-sm text-gray'>Already have an account? <span className='text-blue font-semibold'><a className='cursor-pointer' onClick={handleLogin}>Log in</a></span></p>
      </div>
    </div>
  )
}

export default Signup