import React, { useEffect, useState } from 'react'
import RegisterInput from './LoginAndRegisterInput'
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../Redux/slices/userSlice';


const URL = `http://localhost:4000`;

function RegisterContainer() {
    const [show, setShow] = useState(false);
    const [loggedIn, setlogin] = useState(false);
    const [auth, setAuth] = useState('')
    let dispatcher = useDispatch();

    useEffect(() => { 
        console.log(auth)
        dispatcher(userActions.setValue(auth));
    }, [auth])

    async function registerUser(username: any, password: any) {
        
        try {
            console.log("register");
            alert("register");
            setlogin(false);
            setShow(false);
            let response = await axios.post(`${URL}/register`, {
                username: username,
                password: password
            })
            setShow(true)
            return response;
        } catch (error) {
            console.error(error);
        }

    }
    

    async function loginUser(username: any, password: any) {

        try {
            setlogin(false)
            let response = await axios.post(`${URL}/login`, {
                username: username,
                password: password
            });
            
            setShow(false)
            setlogin(true)
            
            setAuth(`${response.data.token}`)
            
            return response;
        } catch (error) {
            console.error(error);
        }

    }


  return (
    <div>
        <RegisterInput registerUser={registerUser} loginUser={loginUser} />
          {show && (<>Registration Complete</>)}
          {loggedIn && (<>Logged In</>)}
        
    </div>
  )
}

export default RegisterContainer