// //지도?

// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { dbService } from "fbase";

// const DetailPage = () => {
//   const { id } = useParams();
//   const [nweet, setNweet] = useState(null);
//   const mapRef = useRef(null);

//   useEffect(() => {
//     const getNweet = async () => {
//       const nweetRef = dbService.collection("nweets").doc(id);
//       const snapshot = await nweetRef.get();
//       if (snapshot.exists) {
//         setNweet(snapshot.data());
//       }
//     };

//     getNweet();
//   }, [id]);
//   const text = nweet?.text;

//   useEffect(() => {
//     if (nweet && nweet.location) {
//       // Create the Google Map
//       const mapOptions = {
//         center: { lat: nweet.location.lat, lng: nweet.location.lng },
//         zoom: 12,
//       };
//       const map = new window.google.maps.Map(mapRef.current, mapOptions);

//       // Add a marker to the map
//       const marker = new window.google.maps.Marker({
//         position: { lat: nweet.location.lat, lng: nweet.location.lng },
//         map: map,
//       });
//     }
//   }, [nweet]);

//   const imgStyle = {
//     width: "100%",
//     height: "auto",
//     maxWidth: "500px",
//     minWidth: "500px",
//     maxHeight: "350px",
//     minHeight: "350px",
//     marginBottom: "1rem",
//     border: "5px solid darkgrey",
//   };

//   // const mapStyle = {
//   //   width: "50%",
//   //   height: "50%",
//   //   marginTop: "auto",
//   //   marginBottom: "1rem",
//   //   marginLeft: "auto",
//   //   marginRight: "auto",
//   // };

//   const mapStyle = {
//     width: "50%",
//     height: "50%",
//     marginTop: "auto",
//     marginBottom: "1rem",
//     marginLeft: "auto",
//     marginRight: "auto",
//     border: "2px solid #ccc",
//     borderRadius: "5px",
//   };

//   const formattedTime = nweet
//     ? new Date(nweet.createdAt).toLocaleString([], {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//         hour: "2-digit",
//         minute: "2-digit",
//         hour12: false,
//       })
//     : "";

//   return (
//     <div>
//       {nweet ? (
//         <div>
//           <h4
//             style={{
//               fontSize: "24px",
//               marginTop: "-10px",
//               marginBottom: "10px",
//             }}
//           >
//             {nweet.animalType === "wild" ? "[야생동물]" : "[유기동물]"}
//           </h4>
//           <p style={{ textAlign: "right" }}>{formattedTime}</p>
//           {nweet.attachmentUrl ? (
//             <img src={nweet.attachmentUrl} alt="Nweet" style={imgStyle} />
//           ) : (
//             <p style={imgStyle}>등록된 사진이 없습니다.</p>
//           )}
//           <p
//             style={{
//               fontSize: "20px",
//               textAlign: "center",
//               marginTop: "10px",
//               marginBottom: "20px",
//               width: "500px",
//             }}
//           >
//             {text}
//           </p>
//           {/* 지도 표시 */}
//           {nweet.location && <div ref={mapRef} style={mapStyle}></div>}
//         </div>
//       ) : (
//         <div>Loading...</div>
//       )}
//     </div>
//   );
// };

// export default DetailPage;

//지도?

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { dbService } from "fbase";

const DetailPage = () => {
  const { id } = useParams();
  const [nweet, setNweet] = useState(null);
  const [comment, setComment] = useState("");
  const mapRef = useRef(null);

  useEffect(() => {
    const getNweet = async () => {
      const nweetRef = dbService.collection("nweets").doc(id);
      const snapshot = await nweetRef.get();
      if (snapshot.exists) {
        setNweet(snapshot.data());
      }
    };

    getNweet();
  }, [id]);

  useEffect(() => {
    if (nweet && nweet.location) {
      // Create the Google Map
      const mapOptions = {
        center: { lat: nweet.location.lat, lng: nweet.location.lng },
        zoom: 12,
      };
      const map = new window.google.maps.Map(mapRef.current, mapOptions);

      // Add a marker to the map
      const marker = new window.google.maps.Marker({
        position: { lat: nweet.location.lat, lng: nweet.location.lng },
        map: map,
      });
    }
  }, [nweet]);

  const imgStyle = {
    width: "100%",
    height: "auto",
    maxWidth: "500px",
    minWidth: "500px",
    maxHeight: "350px",
    minHeight: "350px",
    marginBottom: "1rem",
    border: "5px solid darkgrey",
  };

  const mapStyle = {
    width: "300px",
    height: "300px",
    marginTop: "auto",
    marginBottom: "1rem",
    marginLeft: "auto",
    marginRight: "auto",
    border: "2px solid #ccc",
    borderRadius: "5px",
  };

  const formattedTime = nweet
    ? new Date(nweet.createdAt).toLocaleString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "";

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    if (comment.trim() !== "") {
      const commentData = {
        text: comment,
        createdAt: Date.now(),
      };

      await dbService
        .collection("nweets")
        .doc(id)
        .update({
          comments: [...(nweet.comments || []), commentData],
        });

      setComment("");

      setNweet((prevNweet) => {
        return {
          ...prevNweet,
          comments: [...(prevNweet.comments || []), commentData],
        };
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    const updatedComments = nweet.comments.filter(
      (comment) => comment.createdAt !== commentId
    );

    await dbService.collection("nweets").doc(id).update({
      comments: updatedComments,
    });

    setNweet((prevNweet) => {
      return {
        ...prevNweet,
        comments: updatedComments,
      };
    });
  };

  return (
    <div>
      {nweet ? (
        <div>
          <h4
            style={{
              fontSize: "24px",
              marginTop: "-10px",
              marginBottom: "10px",
            }}
          >
            {nweet.animalType === "wild" ? "[야생동물]" : "[유기동물]"}
          </h4>
          <p style={{ textAlign: "right" }}>{formattedTime}</p>
          {nweet.attachmentUrl ? (
            <img src={nweet.attachmentUrl} alt="Nweet" style={imgStyle} />
          ) : (
            <p style={imgStyle}>등록된 사진이 없습니다.</p>
          )}
          <p
            style={{
              fontSize: "20px",
              textAlign: "center",
              marginTop: "10px",
              marginBottom: "20px",
              width: "500px",
            }}
          >
            {nweet.text}
          </p>
          {/* 지도 표시 */}
          {nweet.location && <div ref={mapRef} style={mapStyle}></div>}

          <form onSubmit={handleSubmitComment} className="comment">
            <p style={{ fontsize: "15px" }}>Comments</p>
            <input
              type="text"
              value={comment}
              onChange={handleCommentChange}
              placeholder="댓글을 작성해주세요"
              className="commentInput"
            />
            <button type="submit" className="commentBtn">
              작성
            </button>
          </form>

          {nweet.comments && nweet.comments.length > 0 && (
            <div>
              <ul>
                {nweet.comments
                  .slice()
                  .reverse()
                  .map((comment) => (
                    <li key={comment.createdAt} className="commentList">
                      {comment.text}
                      <button
                        className="deleteBtn"
                        onClick={() => handleDeleteComment(comment.createdAt)}
                      >
                        삭제
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default DetailPage;
