import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Perks from './Perks';
import AccountNav from './AccountNav';
import axios from 'axios';
import Image from './Image';


export default function PlacePage() {
  let { action } = useParams();
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isMouseOver1, setIsMouseOver1] = useState(false);
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirectToPlacesList, setRedirectToPlaceList] = useState(false);

  const [photoLink, setPhotoLink] = useState('');


useEffect(()=>{


    if(!id){
        return;
    }
    axios.get('/places/'+ id).then(response=>{
        const{data} = response;
        setTitle(data.title);
        setAddress(data.address);
        setAddedPhotos(data.photos);
        setDescription(data.description);
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPrice(data.price);
    })}, [id])

  function handleMouseOver() {
    setIsMouseOver(true);
  }

  function handleMouseOut() {
    setIsMouseOver(false);
  }

  function handleMouseOver1() {
    setIsMouseOver1(true);
  }

  function handleMouseOut1() {
    setIsMouseOver1(false);
  }


  async function savePlace(event) {
    event.preventDefault();
  
    const placeData = {
      id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
  
    try {
      if (id) {
        await axios.put('/places', placeData);
      } else {
        await axios.post('/places', placeData);
      }
      setRedirectToPlaceList(true);
    } catch (error) {
      console.error(error);
      // Handle error here
    }
  }



async function addPhotoByLink(event) {
  event.preventDefault();
  try {
    const { data: filename  } = await axios.post("/upload-by-link", { link: photoLink });
    setAddedPhotos(prev => [...prev, filename]);
    setPhotoLink('');
  } catch (error) {
    console.error(error);
  }
}

function uploadPhoto(event) {
  const files = event.target.files;
  const data = new FormData();
  for (let i = 0; i < files.length; i++) {
    data.append('photos', files[i]);
  }

  try {
    axios.post('/upload', data, {
      headers: {'Content-type': 'multipart/form-data'}
    })
      .then(response => {
        const {data: filenames} = response;
        setAddedPhotos(prev => [...prev, ...filenames]);
      })
      .catch(error => {
        console.error(error);
        // Handle error here
      });
  } catch (err) {
    console.log(err);
    // Handle error here
  }
}

function removePhoto(ev,filenames) {
  ev.preventDefault();
  setAddedPhotos([...addedPhotos.filter(photo =>photo !== filenames)]);
}
  
function setAsMainPhoto(ev, str){
  ev.preventDefault();
  const addedPhotoWithoutSelected = addedPhotos.filter(photo => photo !== str)
  const newAddedPhotos = [str, ...addedPhotoWithoutSelected];
  setAddedPhotos(newAddedPhotos);
}

  if (redirectToPlacesList) {
    console.log('redirectToPlacesList');
    return <Navigate to={'/account/places'} />;
    }

  return (
    <div>
      <form onSubmit={savePlace}>
        <AccountNav />
        <h2 className="text-primary text-2xl mt-4">Title</h2>
        <p className="text-red text-gray-500 text-sm">
          Title for your place. Should be short and catchy as in advertisement
        </p>
        <input
          type="text"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
          placeholder="title, for example: My apt"
        />
        <h2 className="text-primary text-2xl mt-4">Address</h2>
        <p className="text-red text-gray-500 text-sm">Address to your place</p>
        <input
          type="text"
          value={address}
          onChange={(ev) => setAddress(ev.target.value)}
          placeholder="123 st. New York, 123456"
        />

<h2 className="text-primary text-2xl mt-4">Photos</h2>
        <p className="text-red text-gray-500 text-sm">Upload your photos</p>
        <div className="flex gap-2">
             <input value={photoLink} onChange={ev=>(setPhotoLink(ev.target.value))} type="text" placeholder="Copy Link"/>
             <button className="bg-red p-2 text-white rounded-2xl gap-2" onClick={addPhotoByLink} style={{backgroundColor:isMouseOver? "#22c55e": "#ef4444"}} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>Upload</button>
        </div>    


        <div className="mt-2 gap-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {addedPhotos.length > 0 && addedPhotos.map(link=>(
               <div className="h-32 flex relative " key={link}>
                <Image src={link} alt="" className="w-full h-auto object-cover"/>
              <button onClick={ev=>removePhoto(ev, link)} className="cursor-pointer absolute bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3 ">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                   </svg>
               </button>
               <button onClick={ev=>setAsMainPhoto(ev,link)} className="cursor-pointer absolute bottom-1 left-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3">
                {link === addedPhotos[0] &&(
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                       <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                   </svg>
                )}
                {link !== addedPhotos[0]&&(
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                       <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
               )}
              </button>
           </div>
            ))}

            <label className="h-32 cursor-pointer flex items-center gap-1 justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-300">
            <input type="file" multiple className="hidden" onChange={uploadPhoto}/>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
             </svg>
                Upload
            </label> 
        </div>


        <h2 className="text-primary text-2xl mt-4">Descriptions</h2>
        <p className="text-red text-gray-500 text-sm">Describe your place</p>
        <textarea
          rows="10"
          className="w-full bg-gray-500"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
          placeholder="please type in here"
        />

        <h2 className="text-primary text-2xl mt-4">Perks</h2>
        <p className="text-red text-gray-500 text-sm">Select perks</p>
        <div className="grid mt-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        <Perks selected={perks} onChange={setPerks} />
        </div>

        <h2 className="text-primary text-2xl mt-4">Extra Information</h2>
        <p className="text-red text-gray-500 text-sm">hours, rules, etc</p>
        <textarea
          rows="5"
          value={extraInfo}
          onChange={(ev) => setExtraInfo(ev.target.value)}
          className="w-full bg-gray-500"
          placeholder="please type in here"
        />

        <h2 className="text-primary text-2xl mt-4">Check in & out times</h2>
        <p className="text-red text-gray-500 text-sm">
          Add check-in and check-out times, remember to include cleaning time and guest number
        </p>

        <div className="grid sm:grid-cols-4 font-bold gap-2">
          <div>
            <h3>Check-in time</h3>
            <input
              className="border border-gray-300 p-4 rounded-2xl gap-2 items-center cursor-pointer"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
              type="number"
              placeholder="14:00"
            />
          </div>

          <div>
            <h3>Check-out time</h3>
            <input
              className="border border-gray-300 p-4 rounded-2xl gap-2 items-center cursor-pointer"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
              type="number"
              placeholder="14:00"
            />
          </div>

          <div>
            <h3>Max number of guests</h3>
            <input
              className="border border-gray-300 p-4 cursor-pointer"
              value={maxGuests}
              onChange={(ev) => setMaxGuests(ev.target.value)}
              type="number"
              placeholder="12"
            />
          </div>

          <div>
            <h3>Price</h3>
            <input
              className='border border-gray-300 p-4 cursor-pointer'
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
              type="number"
              placeholder="$100"
            />
          </div>
        </div>

        <button
          onClick={savePlace}
          className="bg-red p-2 w-full rounded-2xl gap-2"
          style={{ backgroundColor: isMouseOver1 ? '#22c55e' : '#ef4444' }}
          onMouseOver={handleMouseOver1}
          onMouseOut={handleMouseOut1}
        >
          Submit
        </button>
      </form>
    </div>
  );
}