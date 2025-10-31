import React, { useContext } from "react";
import Chat from "./components/Chat.jsx";
import Signup from "./components/Signup.jsx";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard.jsx";
import NavSider from "./components/NavSider.jsx";
import { UserContext, UserContextProvider } from "./Context/userContext.jsx";
import Models from "./components/Models.jsx";
import Profile from "./components/Profile.jsx";
import Activity from "./components/Activity.jsx";
import { FiSettings } from "react-icons/fi";
import Settings from "./components/Settings.jsx";

const App = () => {
  
  return (
    <>
    <UserContextProvider>

    
    
          <Routes>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/chatbot" element={<Chat />}></Route>
            <Route to='/profile' element={<Profile/>}/>
            <Route path="/models" element={<Models />}></Route>
            <Route path="/activity" element={<Activity/>}/>
            <Route path="/settings" element={<Settings/>}/>
            <Route path="/" element={<Signup/>}/>
          </Routes>
          
    
      
      
      
      
      

    
    </UserContextProvider>
      <ToastContainer/>
    </>
  );
};

export default App;
