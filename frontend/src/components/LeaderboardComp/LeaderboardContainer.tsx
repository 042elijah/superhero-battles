import React, { useEffect, useState } from 'react'
import Leaderboard from './Leaderboard';
import axios from "axios";

const URL = `http://localhost:4000`;

function LeaderboardContainer() {

    const[leaderboard, setLeaderboard] = useState({} as any);

    useEffect(() =>{
        setLeaderboard(getLeaderboard());
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