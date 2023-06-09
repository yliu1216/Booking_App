import {Link} from "react-router-dom"
import AccountNav from "./AccountNav";
import axios from "axios";
import { useState, useEffect} from "react";
import {differenceInCalendarDays, format} from "date-fns";
import Image from "./Image";

export default function UserBooking() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    axios.get('/booking').then((response) => {
      setBookings(response.data);
    });
  }, []);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axios.get('/places');
        const places = response.data;
        setBookings((prevBookings) =>
          prevBookings.map((booking) => {
            const place = places.find((p) => p._id === booking.place);
            return {
              ...booking,
              place,
            };
          })
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchPlaces();
  }, []);

  return (
    <div>
      <AccountNav />
      <div className="gap-2">
        {bookings.length > 0 &&
          bookings.map((booking) => (
            <div key={booking._id}>
              {booking.place && booking.place.photos && booking.place.photos.length > 0 && (
              <Link to={`/account/booking/${booking._id}`} className="flex gap-4 mb-2 mt-4 rounded-2xl overflow-hidden">
                  <div className="w-48">
                     <Image src={`${booking.place.photos[0]}`} alt="Place Image" />
                  </div>

                <div className="py-3 pr-3 grow">
                   <h2 className="text-xl">{booking.place.title}</h2>
                   <div className="border-t border-gray-100 mt-2 py-2 flex text-gray-300 gap-1">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                    
                     < svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                     </svg>
                    {booking.checkin.split('T', 1)} &rarr;
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" />
                    </svg>
                    {booking.checkout.split('T', 1)}
                   </div>
                   <div className="text-xl flex gap-2">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                        Total price: ${booking.price}
                   </div>
                </div>
              </Link>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}