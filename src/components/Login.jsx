import React, {useContext, useEffect, useState} from 'react';
import{Link, Navigate} from "react-router-dom";
import axios from "axios";
import { UserContext } from '../components/UserContext';


const Login = ()=>{

const[headingText, setHeadingText] = useState("Login");
const[email, setEmail] = useState("");
const[password, setPassword] = useState("");
const[redirect, setRedirect] = useState(false);

const {setUser} = useContext(UserContext);

async function handleChange(event){
    event.preventDefault();
    setHeadingText("Sumbitted");
    if(email === "" || password === ""){
        alert("Input can't be empty");
        setRedirect(true);
    }else{
      try{
        const Userdata = await axios.post("/login", {email, password}, {withCredentials:true});
        const {data} = Userdata;
        setUser(data);
        alert("Login successfully");
        setRedirect(true);
        
      }catch(e){
        alert('Login failed');
      }
    }
}


const[isMouseOver, setIsMouseOver] = useState(false);

    function handleMouseOver(){
        setIsMouseOver(true);
    }

    function handleMouseOut(){
        setIsMouseOver(false);
    }

    useEffect(()=>{
        if(redirect){
            setRedirect(false);
        }
       }, [redirect]);

if(redirect){
  return <Navigate to={'/account'}/>
}
    return(
    <div className="mt-4 grow flex items-center justify-around">
        <div className="mb-64">
            <h1 className="text-4xl text-center mb-4">{headingText}</h1>
            <form className="max-w-md mx-auto" onSubmit={handleChange}>
                <input type="email" 
                    value={email} 
                    onChange={event=>setEmail(event.target.value)} 
                    name="email" 
                    placeholder="your@email.com"/><br/>
                <input type="password" 
                    value={password} 
                    onChange={event=>setPassword(event.target.value)} 
                    name="password" 
                    placeholder="Enter Password"/><br/>
                <button className="bg-red p-2 w-full rounded-2xl" style={{backgroundColor:isMouseOver? "#22c55e": "#ef4444"}} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Login</button>
                <div className="text-center py-2 text-gray-500"> Don't have an account yet? <Link className="underline text-black" to={'/register'}>Register now</Link>
          </div>
            </form>
        </div>
    </div>
    );

}

export default Login;