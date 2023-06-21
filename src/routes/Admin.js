import React, { useEffect, useState } from "react";
import { dbService, storageService } from "fbase";
import Nweet from "../components/Nweet";

const Admin = ({ userObj }) => {
    const [nweets, setNweets] = useState([]);

    useEffect(() => {
        const getNweets = async () => {
        const snapshot = await dbService.collection("nweets").get();
        const nweetData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setNweets(nweetData);
        };

        getNweets();
    }, []);

    const handleDeleteNweet = async (nweetId, attachmentUrl) => {
        const ok = window.confirm("정말로 이 Nweet을 삭제하시겠습니까?");
        if (ok) {
        await dbService.doc(`nweets/${nweetId}`).delete();
        if (attachmentUrl !== "") {
            await storageService.refFromURL(attachmentUrl).delete();
        }
        }
    };

    return (
        <div className="container">
        <h1>관리자 페이지</h1>
        <div>
            {nweets.map((nweet) => (
            <Nweet
                key={nweet.id}
                nweetObj={nweet}
                isOwner={true}
                truncatedText={nweet.txt}
                highlightedText={nweet.txt}
                onDelete={handleDeleteNweet}
            />
            ))}
        </div>
        </div>
    );
};

export default Admin;