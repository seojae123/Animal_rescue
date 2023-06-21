import React from "react";
import {Link} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTwitter} from "@fortawesome/free-brands-svg-icons";
import {faCat, faUser} from "@fortawesome/free-solid-svg-icons";

const Navigation = ({userObj}) => (
<nav>
    <ul style={{display: "flex", justifyContent: "center", marginTop: 50}}>
        <li>
            <Link to="/" style={{marginRight: 10}}>
            <FontAwesomeIcon icon={faCat} style={{ color: "#44cf7a" }} size="2x" />
            </Link>
        </li>
        <li>
            <Link
                to="/profile"
                style={{
                    marginLeft: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    fontSize: 10,
                }}
            >
                <FontAwesomeIcon
                    icon={faUser}
                    color={"#44cf7a"}
                    size="2x"
                />
                <span style={{marginTop: 10}}>
                    {userObj.displayName
                        ? `${userObj.displayName}의 Profile`
                        : "Profile"
                    }
                </span>
            </Link>
        </li>
    </ul>
</nav>
);
export default Navigation;