import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { dbService, storageService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPencilAlt,
  faCheckCircle,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner, truncatedText, highlightedText }) => {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const { animalType } = nweetObj; // animalType 가져오기
  const history = useHistory();
  const [isCompleted, setIsCompleted] = useState(false);

  const onDeleteClick = async () => {
    const ok = window.confirm("정말 삭제하시겠습니까?");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete();
      await storageService.refFromURL(nweetObj.attachmentUrl).delete();
    }
  };

  const toggleEditing = () => setEditing((prev) => !prev);

  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({
      text: newNweet,
    });
    setEditing(false);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };

  const onNweetClick = () => {
    history.push(`/detail/${nweetObj.id}`);
  };

  const formatDate = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);

    if (
      date.getFullYear() === now.getFullYear() &&
      date.getMonth() === now.getMonth() &&
      date.getDate() === now.getDate()
    ) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    } else {
      return date.toLocaleDateString();
    }
  };
  const handleCompleteToggle = () => {
    setIsCompleted((prevIsCompleted) => !prevIsCompleted);
  };
  return (
    <div className="nweet">
      {editing ? (
        <>
          <form onSubmit={onSubmit} className="container nweetEdit">
            <input
              type="text"
              placeholder="글을 작성해 주세요"
              value={newNweet}
              required
              autoFocus
              onChange={onChange}
              className="formInput"
            />
            <input type="submit" value="수정" className="formBtn" />
          </form>
          <span onClick={toggleEditing} className="formBtn cancelBtn">
            취소
          </span>
        </>
      ) : (
        <>
          <p className="nweetTimestamp">
            {formatDate(nweetObj.createdAt)}
            {/* 태그가져오기 */}
            {animalType === "wild" ? "[야생동물]" : "[유기동물]"}
          </p>{" "}
          <h4
            style={{ overflow: "hidden" }}
            onClick={onNweetClick}
            dangerouslySetInnerHTML={{ __html: highlightedText }} // 검색어 강조
          />
          {nweetObj.attachmentUrl && (
            <img src={nweetObj.attachmentUrl} alt="Attachment" />
          )}
          {isOwner && (
            <div className="nweet__actions">
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
              <span onClick={handleCompleteToggle}>
                {isCompleted ? (
                  <FontAwesomeIcon icon={faCheckCircle} />
                ) : (
                  <FontAwesomeIcon icon={faCircle} />
                )}
              </span>
              {isCompleted && <span className="completed-label">구조완료</span>}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
