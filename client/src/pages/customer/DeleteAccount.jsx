import axios from 'axios';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

function DeleteAccount() {
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const {isLoggedIn} = useSelector(state => state?.auth);
  useEffect(() => {
    if(!isLoggedIn){
      navigate('/login');
    }
  }, [isLoggedIn,navigate]);
    const [password, setPassword] = useState('');
    const handleChange = (e) => {
            setPassword(e.target.value);
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
        }, [isChecked])


      const handleSubmit = async (e) => {
        e.preventDefault();
        

        if(!password){
          toast.error("Enter password..!");
    
        }else{
          const loadingToast = toast.loading('Deleding account..!')
        try {

          // Send POST request to API endpoint
           await axios.post('http://localhost:8080/api/v1/users/delete-user', {password}, {
            withCredentials: true 
          });

          toast.success('Account deleted successfully!',{id: loadingToast});
          dispatch(logout());
          navigate('/register')
    
        } catch (error) {
          toast.error(error?.response?.data?.message, {id:loadingToast});
        }
        
      }
      };
  return (
    <section className="bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Delete your account permanently.
              </h1>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type={passwordType} name="password" value={password} onChange={handleChange} id="password" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="••••••••" />
                  </div>
                  <div className="flex items-center justify-between">
                  <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input checked={isChecked} value={isChecked} onChange={checkboxHandler} id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"/>
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor="remember" className="text-gray-500 dark:text-gray-300">Show password</label>
                          </div>
                      </div>
                  </div>
                  <button type="submit" className="w-full text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800">Delete Account</button>
              </form>
          </div>
      </div>
  </div>
</section>
  )
}

export default DeleteAccount;