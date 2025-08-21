import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import loginImg from '../assets/loginImg.svg';
import Flex from '../layouts/Flex';
import Logo from '../layouts/Logo';
import { Link, useNavigate } from 'react-router';
import toast, { Toaster } from 'react-hot-toast';

  import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from 'react-redux';
import { setUser } from '../features/userInfoSlice';

const Login = () => {
  const dispatch=useDispatch()
  const navigate= useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = (e) => {
  e.preventDefault();

  console.log("Login data:", formData);

  if (!formData.email || !formData.password) {
    toast.error("Please Fill all Fields")
}else{

const auth = getAuth();
signInWithEmailAndPassword(auth, formData.email, formData.password)
  .then((userCredential) => {
    const user = userCredential.user;
    setTimeout(() => {
      navigate("/")
    }, 1000);
    dispatch(setUser(user))
    toast.success("Login Successful")
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    toast.error(errorMessage)
  })}

}


  return (
    <div className='w-full h-screen'>
      
      <Toaster position="top-right" reverseOrder={false} />
      <Flex className='h-full'>
        {/* Left Side - Image */}
        <div className='w-1/2 h-full flex items-center justify-center bg-gray-100'>
          <img className='w-auto h-1/2 floating object-cover ' src={loginImg} alt="Login" />
        </div>

        {/* Right Side - Form */}
        <div className='w-1/2 h-full flex items-center justify-center bg-gradient-to-br from-primary to-purple-700 p-8'>
          <div className='w-full max-w-md bg-white rounded-2xl shadow-2xl p-8'>
            <Logo className="mx-auto text-center mb-5" />
            <div className='text-center mb-8'>
              <h2 className='text-2xl font-bold text-gray-800 mb-2'>Login</h2>
              <p className='text-gray-600'>Sign in as Admin or Member</p>
            </div>

            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Email */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Email Address</label>
                <div className='relative'>
                  <Mail className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleInputChange}
                    className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition'
                    placeholder='Enter email address'
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>Password</label>
                <div className='relative'>
                  <Lock className='absolute left-3 top-3 h-5 w-5 text-gray-400' />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    value={formData.password}
                    onChange={handleInputChange}
                    className='w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition'
                    placeholder='Enter password'
                    required
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className='absolute right-3 top-3 text-gray-400 hover:text-gray-600'
                  >
                    {showPassword ? <EyeOff className='h-5 w-5' /> : <Eye className='h-5 w-5' />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type='submit'
                className='w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 flex items-center justify-center space-x-2 font-medium'
              >
                <span>Login</span>
                <ArrowRight className='h-5 w-5' />
              </button>
            </form>

            {/* Signup Link */}
            <div className='text-center mt-6'>
              <p className='text-gray-600'>
                Don't have an account?{' '}
                <Link to="/registration" className='text-primary hover:text-blue-700 font-medium'>
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Flex>
    </div>
  );
};

export default Login;
