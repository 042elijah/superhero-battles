import React, { useEffect } from 'react';
import { Route, Routes, useParams } from 'react-router-dom';
import './App.css';
import GetAllImgs from './components/GetAllImgs';
import RegisterContainer from './components/LoginAndRegister/LoginAndRegisterContainer';
import Battle from './components/Battle/Battle';
import ExploreUsersContainer from './components/ExploreUsersComp/ExploreUsersContainer';
import UserProfile from './components/User/UserProfile';
import HeroForm from './components/CustomHeroPage/HeroForm';
import Home from './components/Home/Home';
import NavBar from './components/Navbar/Navbar';
import Leaderboard from './components/LeaderboardComp/Leaderboard';
import LeaderboardContainer from './components/LeaderboardComp/LeaderboardContainer';

export const URL = `http://3.137.160.227:4000`;

function App() {
  // Brings up the dialog to confirm refresh (this is convenient to prevent accidental logging out of user)
  // From fchenhau's GitHub repo (https://gist.github.com/fchenhau/7e10379e73236f8289c9ee40c1e2aeea)
  useEffect(() => {
    // Prompt confirmation when reload page is triggered
    window.onbeforeunload = () => { return "" };

    // Unmount the window.onbeforeunload event
    return () => { window.onbeforeunload = null };
  }, []);

  let pathArray = [
    {
      path: "/",
      buttonName: "Home",
    },
    {
      path: "/heroes",
      buttonName: "Heroes",
    },
    {
      path: "/battle",
      buttonName: "Battle",
    },
    {
      path: "/usersearch",
      buttonName: "User Search",
    },
    /*{
      path: "/users",
      buttonName: "Users",
    },*/
    {
      path: "/leaderboard",
      buttonName: "Leaderboard",
    },
  ];

  return (
    <div>
    <NavBar pathArray={pathArray}/>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/heroes' element={<GetAllImgs />}></Route>
      <Route path='/battle' element={<Battle />}></Route>
      <Route path='/usersearch' element={<ExploreUsersContainer />}></Route>
      <Route path='/users/:username' element={<UserProfile />}></Route>
      <Route path='/users/:username/customhero' element={<HeroForm />}></Route>
      <Route path='/leaderboard' element={<LeaderboardContainer />} /><Route/>
    </Routes>
  </div>
  );
}

export default App;
