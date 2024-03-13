import React from 'react';
import logo from './logo.svg';
import './App.css';
import RegisterContainer from './components/Register/RegisterContainer';
import LoginContainer from './components/Login/LoginContainer';


function App() {
  return (
    <div className="App">
      <RegisterContainer/>
      <LoginContainer/>
    </div>
  );
}

export default App;
