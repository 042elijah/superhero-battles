import React, { useEffect, useState } from 'react'
import Leaderboard from './Leaderboard';
import axios from "axios";
import { URL } from '../../App'



function LeaderboardContainer() {
    const[leaderboard, setLeaderboard] = useState({} as any);

    useEffect(() =>{
        // setLeaderboard(getLeaderboard());
        getLeaderboard()
        .then(x => {setLeaderboard((x as any).data)})
    }, [])


    async function getLeaderboard() {
        try {
            let res = axios.get(`${URL}/battleground/leaderboard`);
            return res;
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <Leaderboard leaderboard = {leaderboard} />
        </>
  
    )
}

export default LeaderboardContainer