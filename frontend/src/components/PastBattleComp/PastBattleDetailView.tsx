import React from 'react';

function PastBattleDetailView(props:any) {
    
    return (
        <>
            {props.record && <ul>{props.record}</ul>}
        </>
    )
}

export default PastBattleDetailView;