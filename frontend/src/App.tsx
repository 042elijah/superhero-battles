import React from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import './App.css';
import GetAllImgs from './components/GetAllImgs';
import RegisterContainer from './components/LogginAndRegister/LoginAndRegisterContainer';
import Battle from './components/Battle/Battle';
import ExploreUsersContainer from './components/ExploreUsersComp/ExploreUsersContainer';
import UserProfile from './components/User/UserProfile';


function App() {
  return (
    <div>
    <RegisterContainer />
    <Routes>
      <Route path='/heroes' element={<GetAllImgs />}></Route>
      <Route path='/battle' element={<Battle />}></Route>
      <Route path='/usersearch' element={<ExploreUsersContainer />}></Route>
      <Route path='/users/:username' element={<UserProfile />}></Route>

    </Routes>
  </div>
  );
}

export default App;
