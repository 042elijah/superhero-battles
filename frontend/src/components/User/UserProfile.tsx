import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'

function UserProfile() {
    const redux_jwt = useSelector((state: any) => state.user.jwt);

    const [user, setUser] = useState(null as any);
    const [userTypeMessage, setUserTypeMessage] = useState('');
    let { username } = useParams();

    useEffect(() => {
        getUser((username as string) ? username as string : '')
        .then(x => { setUser(x); });
    }, [userTypeMessage]);

    async function getUser(username: string) {
        try {
            if(!username) {
                return null;
            }

            // let response = await axios.get(`http://localhost:4000/users/${username}`);
            let response = await axios({
                method: 'get',
                url: `http://localhost:4000/users/${username}`,
                headers: { 'Authorization': (redux_jwt ? `Bearer ${redux_jwt}` : '') }
            });
            setUserTypeMessage(response.data.message);
            const userObj = response && response.data && response.data.user ? response.data.user : null;

            return userObj;
        } catch (error) {
            console.log(error);
        }        
    }

    return (
        <div>
            {
                user ?
                    <>
                        <p>{userTypeMessage}</p>
                        <p>
                            User: {user.username}
                        </p>
                        <p>
                            Alignment: {user.alignment ? user.alignment : '<not specified>'}
                        </p>
                        <p>
                            {`Wins: ${user.wins} Losses: ${user.losses}`}
                        </p>
                        <p>
                            {`Followers: ${user.followers} Losses: ${user.following}`}
                        </p>
                        <h3 style={{color: 'red'}}>
                            {'** In DB, need to change followers and following from {} (obj notation) to [] (array notation)'}
                        </h3>
                    </>
                    : <></>
            }
        </div>
    )
}

export default UserProfile