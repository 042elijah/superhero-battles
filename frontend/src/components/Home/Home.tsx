import React from 'react'
import RegisterContainer from '../LoginAndRegister/LoginAndRegisterContainer'
import { userActions } from '../Redux/slices/userSlice';
import { useSelector } from 'react-redux';

function Home() {
  const username = useSelector((state: any) => state.token.username);


  return (
    <div>
      <RegisterContainer/>
      <h1>Welcome To SuperHero Battles</h1>
      {
        username ? 
        <h2>{`Signed in as ${username}`}</h2>
        :
        <h2>Please register or login</h2>
      }
    </div>
  )
}

export default Home