import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-30 text-sm'>
            <div>
                <img src={assets.logo} className='mb-5 w-32' alt="Ogiera Logo"/>
                <p className='w-full md:w-2/3 text-gray-600'>
               Powering Innovation, One Component at a Time.
                </p>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li><a href="/" className="hover:text-gray-900 transition-colors">Home</a></li>
                    <li><a href="/about" className="hover:text-gray-900 transition-colors">About Us</a></li>
                    <li><a href="/terms-and-conditions" className="hover:text-gray-900 transition-colors">Terms and Conditions</a></li>
                    <li><a href="/privacy-and-policy" className="hover:text-gray-900 transition-colors">Privacy Policy</a></li>
                    <li><a href="/return-policy" className="hover:text-gray-900 transition-colors">Return Policy</a></li>
                   
                    
                    <li><a href="/contact" className="hover:text-gray-900 transition-colors">Contact Us</a></li>
                </ul>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            
                
                <div className="flex gap-4 mt-6">
                    {/* Facebook Icon */}
                    <a href="https://www.facebook.com/share/17hor2vzhG/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-600 hover:text-blue-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                    </a>
                    {/* Gmail Icon */}
<a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=mechatroniclk@gmail.com"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Gmail"
  className="text-gray-600 hover:text-red-600 transition-colors"
>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
</a>

                  
                </div>
            </div>
        </div>
<div>
            <hr />
            <div className='flex justify-between items-center py-5 pr-16 sm:pr-4'>
                <p className='text-sm text-center flex-1'>Copyright 2025@ mechatronic.lk - All Rights Reserved.</p>
                <div className='flex flex-col items-center gap-1'>
                    <span className='text-xs text-gray-600'>Powered by</span>
                   <a href="https://mail.google.com/mail/?view=cm&fs=1&to=kausuru23@gmail.com"
  target="_blank"
  rel="noopener noreferrer"
>
  <img
    src={assets.company}
    alt="Company Logo"
    className="h-5 w-auto hover:opacity-80 transition-opacity cursor-pointer"
  />
</a>

                </div>
            </div>
        </div>
        <div>
            <hr />
            
        </div>
    </div>
  )
}

export default Footer