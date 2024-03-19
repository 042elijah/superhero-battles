import React from 'react'

function Leaderboard(props:any) {
    console.log(props.leaderboard);
    return (
    //     <ul>
    //     {
    //         props.leaderboard && (props.leaderboard as any[]).map((user: any, index: number) => {
    //             return <li key={'li_' + user.username}>{`${user.username} ${user.alignment} ${user.wins}` }</li>;
    //         })
    //     }
    //     </ul>
    // )
        <ul>
            {props.leaderboard && JSON.stringify(props.leaderboard)}
        </ul>
    )
}

export default Leaderboard