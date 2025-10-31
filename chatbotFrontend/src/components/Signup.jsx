import React, { useContext, useState } from "react";
import { PiAppWindow } from "react-icons/pi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../Context/userContext";
const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loginSelect, setLoginSelect] = useState(true);
  const { setUser} = useContext(UserContext)
  
  const token = localStorage.getItem('token')


 

  const handleSignup = async (e) => {
    e.preventDefault();
    if (username === "" || email === "" || password === "") {
      return toast.error("All fields are required");
    }
    const formData = new URLSearchParams();
    formData.append("username", username.trim());
    formData.append("email", email.trim());
    formData.append("password", password.trim());

    const response = await fetch("http://127.0.0.1:8080/signup", {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    
    const data = await response.json();
    toast.success(data.message);
    localStorage.setItem("token", data.token);
    setUser(data.user)
    localStorage.setItem('user',JSON.stringify(data.user))
    
    setEmail("");
    setPassword("");
    setUsername("");
    navigate("/dashboard");
  };


  const handelLogin = async (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      return toast("All fields are required");
    }
    const formData = new URLSearchParams();

    formData.append("email", email.trim());
    formData.append("password", password.trim());
    const response = await fetch("http://127.0.0.1:8080/login", {
      method: "POST",
      body: formData,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    
    const data = await response.json();
    if (response.status === 401) {
      console.log(data)
      return toast.error(data.error); 
    }else{
    toast.success(data.message);
    localStorage.setItem("token", data.token);
    setUser(data.user)
    localStorage.setItem('user',JSON.stringify(data.user))
    console.log(data);
    setEmail("");
    setPassword("");
    navigate("/dashboard");
    }

    
  };
  return (
    
    <div className="w-full bg-slate-200 h-screen  flex items-center justify-center ">
      {loginSelect ? (
        <form
          onSubmit={handelLogin}
          className=" flex flex-col gap-4 w-[400px] bg-white  p-8 rounded-xl shadow-2xl  text-slate-700   "
        >
          <p className=" text-center font-bold text-3xl">Login</p>
          <div className=" gap-3 flex flex-col">
            <div className=" flex flex-col gap-1">
              <p>Email</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm  pl-4 p-2 outline-0 bg-slate-100 rounded-lg"
                placeholder="email"
                type="text"
              />
            </div>
            <div className=" flex flex-col gap-1">
              <p>Password</p>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm pl-4  p-2 outline-0 bg-slate-100 rounded-lg "
                placeholder="password"
                type="text"
              />
            </div>
          </div>
          <input
            type="submit"
            className="bg-black mt-3 pl-4 cursor-pointer hover:bg-slate-900 text-white py-3 rounded-3xl"
          />
          <div className="text-sm text-slate-600 flex gap-1 mx-auto">
            <p>Return to</p>
            <p
              className="underline cursor-pointer text-purple-700"
              onClick={() => setLoginSelect((prev) => !prev)}
            >
              signup
            </p>
          </div>
        </form>
      ) : (
        <form
          onSubmit={handleSignup}
          className=" flex flex-col gap-4 w-[400px] bg-white shadow-2xl  p-8 rounded-xl  text-slate-700   "
        >
          <p className=" text-center font-bold text-3xl">Signup</p>
          <div className=" gap-3 flex flex-col">
            <div className=" flex flex-col gap-1">
              <p>Username</p>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full text-sm pl-4  p-2 outline-0 bg-slate-100 rounded-lg"
                placeholder="username"
                type="text"
              />
            </div>
            <div className=" flex flex-col gap-1">
              <p>Email</p>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm pl-4   p-2 outline-0 bg-slate-100 rounded-lg"
                placeholder="email"
                type="text"
              />
            </div>
            <div className=" flex flex-col gap-1">
              <p>Password</p>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm pl-4 p-2  outline-0 bg-slate-100 rounded-lg "
                placeholder="password"
                type="text"
              />
            </div>
          </div>
          <input
            type="submit"
            className="bg-black mt-3 cursor-pointer   hover:bg-slate-900 text-white py-3 rounded-3xl"
          />
          <div className="text-sm text-slate-600 flex gap-1 mx-auto">
            <p>Already have an account?</p>
            <p
              className="underline cursor-pointer text-purple-700"
              onClick={() => setLoginSelect((prev) => !prev)}
            >
              login
            </p>
          </div>
        </form>
      )}
    </div>
  );
};

export default Signup;
