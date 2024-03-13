import React from 'react';
import { Route, Routes } from 'react-router-dom';
import './App.css';
import GetAllImgs from './components/GetAllImgs';

function App() {
  return (
    <div>
    <Routes>
      <Route path='/heroes' element={<GetAllImgs />}></Route>
    </Routes>
  </div>
  );
}

export default App;
