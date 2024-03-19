import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { userActions } from '../../store/slices/userSlice';
import RegisterInput from './LoginAndRegisterInput'
import axios from "axios";


const URL = `http://localhost:4000`;

function RegisterContainer() {
    const [show, setShow] = useState(false);
    const [loggedIn, setlogin] = useState(false);

    const redux_jwt = useSelector((state: any) => state.user.jwt);

    console.log(redux_jwt);
    const dispatch = useDispatch();

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

            if(response && response.status == 200 && response.data && response.data.token) {
                dispatch(userActions.setJwt(response.data.token));
            }
            
            setShow(false)
            setlogin(true)
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
          {<p>Token: {redux_jwt}</p>}
    </div>
  )
}

export default RegisterContainer