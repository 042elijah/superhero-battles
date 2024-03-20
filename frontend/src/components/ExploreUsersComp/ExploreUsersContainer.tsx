import React,{useEffect, useState} from "react";
import ExploreUsersDetailView from './ExploreUsersDetailView';
import axios from "axios";

const URL = `http://3.137.160.227:4000`;

function ExploreUsersContainer() {
    const [users, setUsers] = useState({} as any);
  

    useEffect(() => {
        // Need to put the get user request in a useEffect with empty dependencies or else it goes into infinite loop
        let data: any;
        getAllUsers()
        // .then(x => x && x.data && x.data.users ? x.data.users : null)
        .then(x => { x ? setUsers(x) : setUsers({} as any); return x; })
        .then(console.log);
    }, []);

    async function getAllUsers() {
        try {           
            let response = await axios.get(`${URL}/users/usersearch`);
            const usersObj = response && response.data && response.data.users ? response.data.users : null;
            let usersArray: any[] = [];
            
            if (usersObj) {
                for (let i = 0; true; i++) {
                    try {
                        const user = usersObj[i];

                        if(user) {
                            usersArray.push(user);
                        }
                        else {
                            break;
                        }
                    } catch (error) {
                        break;
                    }
                }
            }

            return usersArray;
        } catch (error) {
            console.log(error);
        }        
    }

    return (
    <>
        { users.length || users.length === 0 ? <ExploreUsersDetailView users={users} /> : <></> }
    </>
  )
}

export default ExploreUsersContainer

