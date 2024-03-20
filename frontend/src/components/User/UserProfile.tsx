import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { requestedBattleActions } from '../Redux/slices/requestedBattleSlice';

function UserProfile() {

    const [user, setUser] = useState(null as any);
    const [userTypeMessage, setUserTypeMessage] = useState('');
    let { username } = useParams();
    // takes the value of the token stored during login. Must add to everything that requires auth
    const token = useSelector((auth: any) => auth.token.value);
    const loggedInUser = useSelector((auth: any) => auth.token.username);

    const dispatch = useDispatch();

    useEffect(() => {
        getUser((username as string) ? username as string : '')
        .then(x => { setUser(x); });
    }, [userTypeMessage]);

    async function getUser(username: string) {
        try {
            if (!username) {
                return null;
            }

            let response = await axios.get(`http://3.137.160.227:4000/users/${username}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}` //puts token in the headers
                    }
                });
            const userObj = response && response.data && response.data.user ? response.data.user : null;

            return userObj;
        } catch (error) {
            console.log(error);
        }
    }

    const request1v1 = () => {
        dispatch(requestedBattleActions.setRequestedBattle({
            challenger: loggedInUser,
            // -1 denotes custom hero
            challengerTeam: [-1], 
            opponent: username,
            opponentTeam: [-1]
        }));
    };

    const request3v3 = () => {
        dispatch(requestedBattleActions.setRequestedBattle({
            challenger: loggedInUser,
            // -1 denotes custom hero
            challengerTeam: [-1, 5, 8], 
            opponent: username,
            opponentTeam: [-1, 11, 14]
        }));
    };

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
                            {`Followers: ${user.followers} Following: ${user.following}`}
                        </p>
                        <div>
                            <CustomHeroLink username={username}/>

                            <br />
                            <br />
                            
                            {loggedInUser ? 
                            (
                                <>
                                    <Link className="nav-link" to={'/battle'} onClick={request1v1} style={{ display: 'inline-block' }}>
                                        <button>1v1 me</button>
                                    </Link>

                                    <br />
                                    <br />

                                    <Link className="nav-link" to={'/battle'} onClick={request3v3} style={{ display: 'inline-block' }}>
                                        <button>3v3 me</button>
                                    </Link>
                                </>
                            ) :
                            <Link className="nav-link" to={'/'} style={{ display: 'inline-block' }}>
                                <button>Log in to battle {username}!</button>
                            </Link>
                            }
                        </div>
                    </>
                    : <></>
            }
        </div>
    )
}

function CustomHeroLink({username=""}) {

    let path = `http://localhost:3000/users/${username}/customhero`;

    return (
            // Display inline block allows React Link to not be 100%
            // (https://stackoverflow.com/a/72326049)
            <Link className="nav-link" to={path} style={{display: 'inline-block'}}>
                <button>See my Custom Hero!</button>
            </Link>
    );
}

export default UserProfile