import React from 'react'

function ExploreUsersDetailView(props:any) {
    
    return (
        <>
            {props.users && <ul>{props.users}</ul>}
        </>
    )
}

export default ExploreUsersDetailView