import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function SetPassword() {
    const [password, setPassword] = useState('')
    const [cpassword, setCpassword] = useState('');
    const navigate = useNavigate();
  const {isLoggedIn} = useSelector(state => state.auth);
  useEffect(() => {
    if(isLoggedIn){
      navigate('/profile');
    }
  }, [isLoggedIn,navigate]);
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleCPasswordChange = (e) => {
        setCpassword(e.target.value);
    };
    const [isChecked, setIsChecked] = useState(false);


    const checkboxHandler = (e) => {
      setIsChecked(e.target.checked);
    };
    const [passwordType, setPasswordType] = useState('password');

      useEffect(() => {
        if(isChecked){
          setPasswordType('text')
        }else if(!isChecked){
          setPasswordType('password')
        }
      }, [isChecked]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(!password){
          toast.error("Enter password..!");   
        }else if(password !== cpassword){
            toast.error("Confirm password doesn't match..!");  
        }
        else{
          const loadingToast = toast.loading('Updating password..!')
        try {
          // Send POST request to API endpoint
          await axios.post('/user/set-password', {password});

          toast.success('Password updated successfully!',{id: loadingToast}); 
          navigate('/login')
    
        } catch (error) {
        
          toast.error(error?.response?.data?.message,{id:loadingToast});
        }
        
      }
      };
 
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Now set new password.
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type={passwordType} name="password" value={password} onChange={handlePasswordChange} id="password" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="••••••••" required/>
                  </div>
                  <div>
                      <label htmlFor="cpassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                      <input type={passwordType} value={cpassword} onChange={handleCPasswordChange} name="cpassword" id="cpassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required/>
                  </div>
                  <div className="flex items-center justify-between">
                  <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input checked={isChecked} value={isChecked} onChange={checkboxHandler} id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required=""/>
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Show password</label>
                          </div>
                      </div>
                  </div>
                  <button type="submit" className="w-full bg-blue-500 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Change</button>
              </form>
          </div>
      </div>
  </div>
</section>
  )
}

export default SetPassword