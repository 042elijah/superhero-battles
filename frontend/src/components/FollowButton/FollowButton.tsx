import React, { useState } from 'react'

function FollowButton() {
  const [following, setFollowing] = useState(false);

  const followingStyle = {
      borderRadius: '15px',
      backgroundColor: 'green', 
      color: 'white'
  };

  const notFollowingStyle = {
  };

  const onClickEvent = (event: any) => {
    setFollowing(!following);
  };

  return (
    <div>
        {
            following ?
            <button onClick={onClickEvent} style={notFollowingStyle}>Follow</button>
            :
            <button onClick={onClickEvent} style={followingStyle}>Following</button>
        }
    </div>
  )
}

export default FollowButton