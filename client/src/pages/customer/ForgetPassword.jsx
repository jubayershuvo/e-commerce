import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ForgetPassword() {
    const [request, setRequest] = useState('');
    const navigate = useNavigate();
   const {isLoggedIn} = useSelector(state => state.auth);
   useEffect(() => {
    if(isLoggedIn){
      navigate('/profile');
    }
  }, [isLoggedIn,navigate]);


    const handleChange = (e) => {
            setRequest(e.target.value);
      };
      const submitHandler = async (e)=>{
        e.preventDefault();
        
    
        // Create form data to send to the API
        
        if(!request){
          toast.error("Enter Username or email");   
        }
        else{
          const loadingToast = toast.loading('Finding user...!')
        try {
          // Send POST request to API endpoint
          await axios.post('http://localhost:8080/api/v1/users/forget-password', {
            request:request,
          }, {
            withCredentials: true  // Ensure cookies are included in the request
          });
          toast.success('OTP sended successfully!', {id:loadingToast});
            navigate('/verify-forget-password')
    
        } catch (error) {
          toast.error(error?.response?.data?.message,{id: loadingToast});
        }
  
      }
      }

  return (
    <div style={{width:'100%'}}>
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Forget your password.
                </h1>
                <form onSubmit={submitHandler} className="space-y-4 md:space-y-6">
                  <div>
                      <label htmlFor="request" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Enter email or username</label>
                      <input type="text" name="code" value={request} onChange={handleChange} id="request" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email or username.....!" required=""/>
                  </div>
                  <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Send</button>
                </form>
              </div>
            </div>
          </div>
        </section>
    </div>
  )
}

export default ForgetPassword