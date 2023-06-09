import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Navigate, Link} from 'react-router-dom';

const Register = ()=> {
    const[headingText, setHeadingText] = useState("Register");
    const[firstName, SetFirstName] = useState("");
    const[lastName, SetLastName] = useState("");
    const[email, setEmail] = useState("");
    const[password, setPassword] = useState("");
    const[redirect, setRedirect] = useState(false);

    const[isMouseOver, setIsMouseOver] = useState(false);

    function handleMouseOver(){
        setIsMouseOver(true);
    }

    function handleMouseOut(){
        setIsMouseOver(false);
    }


   async function handleClick(event){
        event.preventDefault();
        setHeadingText("Sumbitted");
        try{
            await axios.post("/register",{firstName, lastName, email, password});
            alert("Registration successfully, now you can login");
            setRedirect(true);
        }catch (error) {
            if (error.response) {
              console.log(error.response.data);  // Log the error response from the server
              alert("Registration Failed: " + error.response.data.error); // Display the error message
            } else {
              console.log(error); // Log other types of errors
              alert("Registration Failed");
            }
          }
   }

   useEffect(()=>{
    if(redirect){
        setRedirect(false);
    }
   }, [redirect]);

   if(redirect){
    return <Navigate to="/login" />;
   }

   return(
    <div className="mt-4 grow flex items-center justify-around">
        <div className="mb-64">
            <h1 className="text-4xl text-center mb-4"> {headingText} {firstName} {lastName}</h1>
            <form className="max-w-md mx-auto" onSubmit={handleClick}>
                <input onChange={event=>SetFirstName(event.target.value)} type="text" name="firstName" placeholder="First Name" value={firstName}/>
                <input onChange={event=>SetLastName(event.target.value)} type="text" name="lastName" placeholder="Last Name" value={lastName}/>
                <input onChange={event=>setEmail(event.target.value)} name="email" placeholder="your@email.com" type="email" value={email} /><br/>
                <input onChange={event=>setPassword(event.target.value)} name="password" placeholder="Enter Password" type="password" value={password}/><br/>
                <button className="bg-red p-2 w-full rounded-2xl" style={{backgroundColor:isMouseOver? "#22c55e": "#ef4444"}} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Register</button>
                <div className="text-center py-2 text-gray-500"> Already have an account? <Link className="underline text-black" to={'/login'}>Login now</Link>
             </div>
            </form>
        </div>
    </div>
   )
}

export default Register;