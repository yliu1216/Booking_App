import React, { useEffect, useState , useRef} from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';
import Image from '../pages/Image';

const IndexPage = () => {
  const [places, setPlaces] = useState([]);
  const divUnderMessage = useRef();


  useEffect(() => {
    axios.get('/all-places').then(response => setPlaces(response.data));
  }, []);

  useEffect(() => {
    const div = divUnderMessage.current;
    if (div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [places]);

  return (
    <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-x-8 gap-y-8">
      {places.length > 0 && places.map(place => (
        <Link to={'/places/'+place._id} className="cursor-pointer bg-white p-4 rounded-2xl">
          <div className="gap-2 rounded-2xl flex">
            {place.photos.length > 0 && (
              <Image className="rounded-2xl object-cover aspect-square" src={place.photos[0]} alt='' />
            )}
          </div>
          <h1 className='text-center truncate text-sm'>{place.title}</h1>
          <h3 className="font-bold">{place.address}</h3>
          <h3 className="mt-2 rounded-2xl font-bold text-white text-center bg-black" >${place.price} / per night</h3>
        </Link>
      ))}
    <div ref={divUnderMessage}></div>
    </div>
  );
}

export default IndexPage;