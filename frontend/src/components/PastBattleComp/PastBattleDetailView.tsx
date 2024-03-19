import React from 'react';
import { Link } from 'react-router-dom';

function PastBattleDetailView(props:any) {
    
    return (

        //{props.leaderboard && <ul>{props.leaderboard}</ul>}
        <ul>
        {
            props.record && (props.record as any[]).map((record: any, index: number) => {
                return <li key={'li_' + record.username}>{`${record.username} ${record.alignment} ${record.wins}` }</li>;
            })
        }
        </ul>

    )
}

export default PastBattleDetailView;