import React from 'react'
import RegisterInput from './RegisterInput'
import axios from "axios";


const URL = `http://localhost:4000`;

function RegisterContainer() {

    async function registerUser(username: any, password: any) {
        
        try {
            let response = await axios.post(`${URL}/register`, {
                username: username,
                password: password
            })
            
            return response;
        } catch (error) {
            console.error(error);
        }

    }


  return (
    <div>
        <RegisterInput registerUser={registerUser}/>
    </div>
  )
}

export default RegisterContainer