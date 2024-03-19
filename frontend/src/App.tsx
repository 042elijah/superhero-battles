import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import './App.css';
import GetAllImgs from './components/GetAllImgs';
import RegisterContainer from './components/LoginAndRegister/LoginAndRegisterContainer';
import Battle from './components/Battle/Battle';
import ExploreUsersContainer from './components/ExploreUsersComp/ExploreUsersContainer';
import UserProfile from './components/User/UserProfile';
import HeroForm from './components/CustomHeroPage/HeroForm';
import NavAndTabs from './components/BoostrapComp/NavAndTabs';


function App() {
  return (
    <div>
    <RegisterContainer/>
    <NavAndTabs/>
    <Routes>
      <Route path='/heroes' element={<GetAllImgs />}></Route>
      <Route path='/battle' element={<Battle />}></Route>
      <Route path='/usersearch' element={<ExploreUsersContainer />}></Route>
      <Route path='/users/:username' element={<UserProfile />}></Route>
      <Route path='/users/:username/customhero' element={<HeroForm />}></Route>
    </Routes>
  </div>
  );
}

export default App;
