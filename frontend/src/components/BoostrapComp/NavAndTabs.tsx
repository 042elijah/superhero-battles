import React from 'react'
import { Link } from 'react-router-dom'

function NavAndTabs() {
    
  return (
    // <nav classNameName="nav">
    //     <Link className="nav-link" aria-current="page" to="/">Home</Link>
    //     <Link className="nav-link" to="/usersearch">Explore Users</Link>
    //     <Link className="nav-link" to="/leaderboard">Leader Board</Link>

    //     <Link className="nav-link justify-content-end" to="#">Account</Link>
    // </nav>

    // Add Links to the components (refer to the App.tsx file)
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">

            <ul className="navbar-nav">
                <li>
                    <Link className="navbar-brand" aria-current="page" to="/">Home</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/usersearch">Explore Users</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/leaderboard">Leader Board</Link>
                </li>
            </ul>

                <Link className="nav-link justify-content-end" to="#">Account</Link>

        </div>
    </nav>
  )
}

export default NavAndTabs