import React, { useState } from "react";
import { authService } from "fbase";
import { useHistory } from "react-router-dom";

export default ({refreshUser, userObj}) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const isAdmin = userObj.uid === "N1hdr9dcZdMv3WllMndAajgG0kH3";

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    const onChange = (event) => {
        const {
            target: {value},
        } = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName){
            await userObj.updateProfile({
                displayName: newDisplayName,
            });
            refreshUser();
        }
    };

    const onAdminClick = () => {
        history.push("/admin");
    };

    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                {isAdmin && <p>어서오십시오 관리자님</p>}
                <input 
                    onChange={onChange}
                    type="text"
                    autoFocus
                    placeholder="프로필을 등록해주세요"
                    value={newDisplayName}
                    className="formInput"
                />
                <input 
                    type="submit" 
                    value="프로필 업데이트"
                    className="formBtn"
                    style={{marginTop: 10}} />
            </form>
            <span 
                className="formBtn cancelBtn logOut" 
                onClick={onLogOutClick}>
                로그아웃
            </span> 
            {isAdmin && (
                <button className="AdminBtn" onClick={onAdminClick}>관리자 페이지로 이동</button>
            )}
        </div>
    );
};