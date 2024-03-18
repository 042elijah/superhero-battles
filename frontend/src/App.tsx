import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import GetAllImgs from './components/GetAllImgs';
import RegisterContainer from './components/LogginAndRegister/LoginAndRegisterContainer';
import Battle from './components/Battle/Battle';


function App() {
  return (
    <div>
    <RegisterContainer />
    <Routes>
      <Route path='/heroes' element={<GetAllImgs />}></Route>
      <Route path='/battle' element={<Battle />}></Route>
    </Routes>
  </div>
  );
}

export default App;
