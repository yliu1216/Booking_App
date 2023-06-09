import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext({});
export function UserContextProvider({children}){;
    const [user, setUser] = useState(null);
    const [ready, setReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/profile')
          .then(response => {
            const userData = response.data;
            setUser(userData); // Update user state with the retrieved user data
            setReady(true);
          })
          .catch(error => {
            console.log(error);
            if (error.response && error.response.status === 401) {
              // Reset user data to null
              setUser(null);
              navigate("/login");
            } else {
              console.log(error);
              navigate("/login");
            }
          });
      }, []);
    return(
        <UserContext.Provider value={{user, setUser, ready}}>
            {children}
        </UserContext.Provider>
    ) 
}