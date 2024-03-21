import React from 'react'
import { Link } from 'react-router-dom';

function Leaderboard(props:any) {
    function UserLink({username=""}) {
        return (
            <Link className="nav-link" to={`/users/${username}`} style={{ display: 'inline-block' }}>
                <u style={{color: '#32a852'}}>{username}</u>
            </Link>
        );
    }

    console.log(props.leaderboard);

    let sortedLeaderboard = props.leaderboard as object[];

    if(sortedLeaderboard && sortedLeaderboard.length > 0) {
        sortedLeaderboard.sort((x: any, y: any) => {
            return y.wins - x.wins ||  /* TypeScript wants the first part to be on same line as return keyword */
            x.losses - y.losses || 
            x.username.localeCompare(y.username)
        });
    }

    return (
        <>
            {
                // (props.leaderboard as any[]) && (props.leaderboard as any[]).length > 0 ?
                sortedLeaderboard && sortedLeaderboard.length > 0 ?
                    <table>
                        <thead>
                            <tr>
                                <th>Rank</th>
                                <th>User</th>
                                <th>Alignment</th>
                                <th>Wins</th>
                                <th>Losses</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                // (props.leaderboard as any[]).map((user: any, index: number) => {
                                sortedLeaderboard.map((user: any, index: number) => {
                                    return (
                                        <tr key={`row_${user.username}`}>
                                            <td>{index + 1}</td>
                                            <td><UserLink username={user.username}></UserLink></td>
                                            <td>{user.alignment}</td>
                                            <td>{user.wins}</td>
                                            <td>{user.losses}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    :
                    <p>Loading leaderboard...</p>
            }
        </>
    )
}

export default Leaderboard