import React, { useContext, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { UserContext } from '../Context/userContext'
import {LayoutDashboard,MessageCircle,MessageCircleIcon,BrainCircuitIcon, ActivityIcon, SettingsIcon, LogOutIcon, LucideLogOut} from 'lucide-react'
const NavSider = () => {
  const user= JSON.parse(localStorage.getItem('user'))
  const name = user?.name ? user.name.split(" ") : user.name 
  const clearLocalStorage=()=>{
    localStorage.clear(); 
  }
  return (
    <div className='shadow-2xl p-8 flex flex-col  w-[350px] h-screen'>
        {/*  prfile */}
      <div 
      className='top-0 right-0 w-full h-[80px] border-b items-center flex '>
        <img src="/logo.jpg" className='w-[50px] h-[50px] right-0 '  alt="" />
        <p className=' mx-auto  font-bold '>Welcome back,{name[0]}!</p>
      </div>
        
        <ul className=' flex flex-col gap-6 mt-6 '>
          <NavLink to={'/dashboard'} className=" text-black font-semibold hover:bg-slate-200 rounded-lg py-3 text-center transition-all duration-300 flex justify-center gap-4"> <LayoutDashboard size={25}/> Dashboard</NavLink>
          <NavLink to={'/chatbot'} className=" text-black font-semibold hover:bg-slate-200 rounded-lg py-3 text-center transition-all duration-300 flex gap-4 justify-center"> <MessageCircle size={25}/> Chatbot</NavLink>
          <NavLink to={'/models'} className=" text-black font-semibold hover:bg-slate-200 rounded-lg py-3 text-center transition-all duration-300 flex justify-center gap-4"> <BrainCircuitIcon size={25}/>Models</NavLink>
          {/* <NavLink to={'/activity'} className=" text-black font-semibold hover:bg-slate-200 rounded-lg py-3 text-center transition-all duration-300 flex justify-center gap-4"> <ActivityIcon size={25}/> Activity</NavLink> */}
          {/* <NavLink to={'/settings'} className=" text-black font-semibold hover:bg-slate-200 rounded-lg py-3 text-center transition-all duration-300 flex justify-center gap-4"> <SettingsIcon size={25}/> Settings</NavLink> */}
          <NavLink
          to={'/'} onClick={clearLocalStorage} className=" text-black font-semibold hover:bg-slate-200 rounded-lg py-3 text-center transition-all duration-300 flex justify-center gap-4"
          >
           <LucideLogOut size={25}/> Logout
          </NavLink>
          
        </ul>
         
      
    </div>
  )
}

export default NavSider
