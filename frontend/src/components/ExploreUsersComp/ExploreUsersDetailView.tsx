import React from 'react'
import { Link } from 'react-router-dom';

function ExploreUsersDetailView(props:any) {
    return (
        <>
            {/* {props.users && <ul>{props.users}</ul>} */}
            <ul>
            {
                props.users && (props.users as any[]).map((user: any, idx: number) => {
                    return <li key={'li_' + user.username}><Link to={`/users/${user.username}`}>{user.username}</Link></li>;
                })
            }
            </ul>
        </>
    )
}

export default ExploreUsersDetailView