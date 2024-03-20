import React, { useEffect, useState } from 'react'
import RegisterInput from './LoginAndRegisterInput'
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from '../Redux/slices/userSlice';


const URL = `http://3.137.160.227:4000`;

function RegisterContainer() {
    const [actionMessage, setActionMessage] = useState('');
    let dispatcher = useDispatch();

    async function registerUser(username: any, password: any) {
        try {
            console.log("register");
            let response = await axios.post(`${URL}/register`, {
                username: username,
                password: password
            });

            setActionMessage(response.data.message);

            return response;
        } catch (error) {
            console.error(error);
            
            try { setActionMessage((error as any).response.data.message); } catch(e) { setActionMessage('Error registering user'); }
        }
    }

    async function loginUser(username: any, password: any) {

        try {
            let response = await axios.post(`${URL}/login`, {
                username: username,
                password: password
            });

            if(response && response.status == 200 && response.data && response.data.token) {
                dispatcher(userActions.setValue(response.data.token));
                console.log(response.data.user.username);
                dispatcher(userActions.setUsername(response.data.user.username));
            }
            
            dispatcher(userActions.setValue(`${response.data.token}`));
            
            return response;
        } catch (error) {
            console.error(error);

            try { setActionMessage((error as any).response.data.message); } catch(e) { setActionMessage('Error registering user'); }
        }

    }


  return (
    <div>
        <RegisterInput registerUser={registerUser} loginUser={loginUser} />
          {actionMessage && (<p>{actionMessage}</p>)}
    </div>
  )
}

export default RegisterContainer