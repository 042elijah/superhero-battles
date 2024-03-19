import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function NavBar(props: any) {

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    SuperHero Battles
                </Link>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        {props.pathArray.map((obj: any, index: any) => {
                            return (
                                <li key={index}>
                                    <Link className="nav-link" to={obj.path}>
                                        {obj.buttonName}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;