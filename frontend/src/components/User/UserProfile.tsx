import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

function UserProfile() {
    const [user, setUser] = useState(null as any);
    let { username } = useParams();

    useEffect(() => {
        getUser((username as string) ? username as string : '')
        .then(x => { setUser(x); });
    }, []);

    async function getUser(username: string) {
        try {
            if(!username) {
                return null;
            }

            let response = await axios.get(`http://localhost:4000/users/${username}`);
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