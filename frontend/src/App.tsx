import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import GetAllImgs from './components/GetAllImgs';
import RegisterContainer from './components/LogginAndRegister/LoginAndRegisterContainer';


function App() {
  return (
    <div>
    <RegisterContainer />
    <Routes>
      <Route path='/heroes' element={<GetAllImgs />}></Route>
    </Routes>
  </div>
  );
}

export default App;
