import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
  const navigate = useNavigate();
  const {isLoggedIn} = useSelector(state => state.auth);
  useEffect(() => {
    if(!isLoggedIn){
      navigate('/login');
    }
  }, [isLoggedIn,navigate]);
      const [data, setData] = useState({
        oldPassword:'', 
        newPassword:'',
        cPassword:''
      })
      const handleChange = (e) => {
          const { name, value } = e.target;
              setData({
                  ...data,
                  [name]: value
              });
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
        
  
  
  
        const submitHandler = async (e)=>{
          e.preventDefault();
            console.log(data)
          // Create form data to send to the API
          
          if(!data.oldPassword){
            toast.error("Enter Old-Password...!");   
          }else 
          if(!data.newPassword){
              toast.error('Enter New-Password..!');  
          }else 
          if(data.newPassword !== data.cPassword){
              toast.error("Confirm-Password dosen't match..!");  
          }
          else{
            const loadingToast = toast.loading('Changing password..!')
          try {
            // Send POST request to API endpoint
            await axios.post('http://localhost:8080/api/v1/users/update-password', {
                oldPassword:data.oldPassword, 
                newPassword:data.newPassword,
            }, {
              withCredentials: true  // Ensure cookies are included in the request
            });
            toast.success('Password Updated successfully..!',{id: loadingToast});
      
          } catch (error) {
            toast.error(error?.response?.data?.message,{id:loadingToast});
          }
    
        }
        }
  return (
    <div>
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Change password.
              </h1>
              <form onSubmit={submitHandler} className="space-y-4 md:space-y-6">
                    <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Old-Password</label>
                      <input type={passwordType} value={data.oldPassword} onChange={handleChange} name="oldPassword" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                    </div>
                    <div>
                      <label htmlFor="npassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">New-Password</label>
                      <input type={passwordType} value={data.newPassword} onChange={handleChange} name="newPassword" id="npassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
                    </div>
                  <div>
                      <label htmlFor="cpassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm-Password</label>
                      <input type={passwordType} value={data.cPassword} onChange={handleChange} name="cPassword" id="cpassword" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required=""/>
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
                  <button type="submit" className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Change</button>
              </form>
          </div>
      </div>
  </div>
</section>
    </div>
  )
}

export default ChangePassword