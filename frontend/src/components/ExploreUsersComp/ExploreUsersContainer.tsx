import React,{useState} from "react";
import ExploreUsersDetailView from './ExploreUsersDetailView';
import axios from "axios";

const URL = `http://localhost:4000`;

function ExploreUsersContainer() {
    
    const [users, setUsers] = useState({} as any);
  
    let data = getAllUsers();
    setUsers(data);

    async function getAllUsers() {

        try {           
            let response = await axios.get(`${URL}/usersearch`)
            return response;
        } catch (error) {
            console.log(error);
        }        
    }

    return (
    <>
        <ExploreUsersDetailView users = {users} />
    </>
  )
}

export default ExploreUsersContainer

