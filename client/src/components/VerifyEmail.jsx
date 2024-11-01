import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../store/authSlice';

function VerifyEmail() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {isLoggedIn} = useSelector(state => state.auth);
  const inputRef = useRef(null);
    useEffect(() => {
      if(!isLoggedIn){
        navigate('/');
      }else{
        inputRef.current.focus();
      }
    }, [isLoggedIn,navigate]);
    const [code, setCode] = useState('');


    const handleChange = (e) => {
            setCode(e.target.value);
      };


      const handleSubmit = async (e) => {
        e.preventDefault();
        
        
        if(!code){
          toast.error("Enter OTP...!");   
        }else if(code.length !== 6){
          toast.error('Enter 6 digit OTP...!');  
      }
        else{
          const activateLoading = toast.loading('Updating Email..!')
        try {
          // Send POST request to API endpoint
         const res = await axios.post('/user/email-verify', {code});
         
          toast.success('Email updated successfully..!',{id:activateLoading});
          dispatch(login(res.data.data))
          navigate('/profile')
    
        } catch (error) {
          toast.error(error?.response?.data?.message,{id:activateLoading});
        }
        
      }
      };
  return (
    <div style={{width:'100%'}}>
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                 Verify new email.
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div>
                      <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white ml-2">Email OTP</label>
                      <input ref={inputRef} type="number" name="code" value={code} onChange={handleChange} id="code" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter 6 digit OTP...!" required=""/>
                  </div>
                  <button type="submit" className="w-full text-white bg-blue-600 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center shadow-md transition-all duration-300 transform hover:scale-105 dark:focus:ring-primary-800 dark:from-primary-600 dark:to-primary-700 dark:hover:from-primary-500 dark:hover:to-primary-600">Activate</button>
                </form>
              </div>
            </div>
          </div>
        </section>
    </div>
  )
}

export default VerifyEmail