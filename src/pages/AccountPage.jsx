import React, { useState, useContext } from 'react';
import {UserContext } from '../components/UserContext';
import { Link, Navigate, useParams } from 'react-router-dom';
import PlacesPage from './PlacesPage.jsx';
import AccountNav from './AccountNav'
import axios from 'axios';

const AccountPage=()=>{
    const [redirect, setRedirect] = useState(null);
    const {ready, user, setUser} = useContext(UserContext);
    let {subpage} = useParams();


    if(subpage === undefined){
        subpage = 'profile';
    }


    async function logout(){
        await axios.post('./logout');
        setRedirect("/");
        setUser(null);
    }

    if(!ready){
        return 'Loading...';
    }


    if(ready && !user && !redirect){
        return <Navigate to={'/login'}/>
    }


    if(subpage === undefined){
        subpage = 'profile';
    }


    if(redirect){
        return <Navigate to={redirect}/>
    }

    return(
        <div> 
            <AccountNav/>
            {
                subpage === 'profile' && (
                    <div className='text-center max-w-lg mx-auto'>
                        Logged in as {user.firstname} {user.lastname} ({user.email}) <br/>
                        <button className="text-white bg-red py-2 px-4 w-full rounded-full justify-around mt-8 gap-2 mb-8" onClick={logout}>Log out</button>
                    </div>
                    )    
            }

            {
                subpage === 'places' && (
                   
                    <div> 
                     </div>
                )
            }


            {
                subpage === 'booking' && (
                    <div>
                        <button>Hello</button>
                    </div>
                )
            }
        </div>
    );
}

export default AccountPage;