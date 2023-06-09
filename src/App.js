import Login from './components/Login.jsx';
import IndexPage from './components/IndexPage';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Register from './components/Register.jsx';
import axios from 'axios';
import { UserContextProvider } from './components/UserContext.jsx';
import AccountPage from './pages/AccountPage';
import PlacesPage from './pages/PlacesPage.jsx';
import PlacePage from './pages/PlacePage'
import PlaceHomePage from './pages/PlaceHomePage.jsx';
import BookingReview from './pages/BookingReview.jsx';
import UserBooking from './pages/UserBooking.jsx';


function App() {
  axios.defaults.baseURL ='http://localhost:4000'
  //import.meta.env.VITE_API_BASE_URL;
  axios.defaults.withCredentials =true;
  return (
    <UserContextProvider>
      <Routes>
         <Route path="/" element={<Layout/>}>
          <Route index element={<IndexPage/> }/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/account" element={<AccountPage/>}></Route>     
          <Route path="/account/places" element={<PlacesPage/>}></Route>
          <Route path="/account/places/new" element={<PlacePage/>}></Route>
          <Route path="/account/places/:id" element={<PlacePage/>}></Route>
          <Route path="/places/:id" element={<PlaceHomePage/>}></Route>
          <Route path="account/booking/:id" element={<BookingReview/>}></Route>
          <Route path="account/booking" element={<UserBooking/>}></Route>
          
         </Route>
    </Routes>
    </UserContextProvider>

  );
}

export default App;
