import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {Navigate} from "react-router-dom";
import {UserContext} from "../components/UserContext.jsx";
import {differenceInCalendarDays} from "date-fns";

export default function BookingPage({place}){
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [checkIn,setCheckIn] = useState('');
  const [checkOut,setCheckOut] = useState('');
  const [firstName, SetFirstName] = useState('');
  const [lastName, SetLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [numberOfGuests,setNumberOfGuests] = useState(1);
  const [redirect, setRedirect] = useState('');
  const {user} = useContext(UserContext);

  useEffect(()=>{
    if(user){
      SetFirstName(user.firstName);
      SetLastName(user.lastName);
    }
  }, [user]);


  let numberofNights = 0;
  if(checkIn && checkOut) {
    const checkInDate = new Date(Date.parse(checkIn));
    const checkOutDate = new Date(Date.parse(checkOut));
    numberofNights = differenceInCalendarDays(checkOutDate, checkInDate);
  }

  async function bookThisPlace(){
    const data = {place:place._id, checkIn, checkOut, firstName, lastName, phone, numberOfGuests, price:numberofNights*place.price};
    const response = await axios.post("/booking", data);
    const bookingId = response.data._id;
    setRedirect(`/account/booking/${bookingId}`);


  }
  
  if(redirect){
    return <Navigate to={redirect}/>
  }

  function handleMouseOver(){
    setIsMouseOver(true);
  }
  
  function handleMouseOut(){
    setIsMouseOver(false);
  }


  return(
    <div>
      <div className="bg-white shadow p-4 rounded-2xl">
            <div className="font-bold text-xl text-black text-center">
              Price: ${place.price} / per night
            </div>
            <div className="border rounded-2xl mt-4">
              <div className="flex justify-normal">   
                <div className="py-3 px-4">
                  <label className="font-bold shadow ">Check in: </label>
                  <input value={checkIn} onChange={(ev)=>setCheckIn(ev.target.value)}className="gap-2 rounded-2xl" type="date"/>
                </div>
                <div className="py-3 px-4 shadow border-l">
                  <label className="font-bold">Check out: </label>
                  <input value={checkOut} onChange={(ev)=>setCheckOut(ev.target.value)} className="gap-2 rounded-2xl" type="date"/>
                </div>
              </div>
              <div className="py-3 px-4 shadow border-t">
                <label className="font-bold ">Number of Guests: </label>
                <input value={numberOfGuests} onChange={(ev)=>setNumberOfGuests(ev.target.value)} className="gap-2 rounded-2xl" type="number"/>
              </div>
            </div>
            {numberofNights > 0 && (
                  <div className="py-3 px-4 font-bold">
                          <label>First Name: </label>
                           <input value={firstName} type="text" onChange={(ev)=>SetFirstName(ev.target.value)}></input>

                           <label>Last Name: </label>
                           <input value={lastName} type="text" onChange={(ev)=>SetLastName(ev.target.value)} ></input>

                           <label>Phone Number: </label>
                           <input value={phone} type="text" onChange={(ev)=>setPhone(ev.target.value)} ></input>


                  </div>
         
                )}
            <div className=" font-bold my-4 py-2 px-4 text-center">
              <button onClick={bookThisPlace} className="w-full rounded-2xl bg-black text-white text-center" style={{backgroundColor: isMouseOver ? '#F54B47' : "#000000"}} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
                Book This Place
                </button>
            </div>
          </div>
        </div>

  )
}