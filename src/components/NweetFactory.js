//인풋창 바로 입력 되도록 수정 + 모달으로 공지 띄우기

import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { storageService, dbService } from "fbase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [attachment, setAttachment] = useState("");
  const [expanded, setExpanded] = useState(false); //입력창 넓어짐
  const [showModal, setShowModal] = useState(false); //모달창으로 알림설정
  const [animalType, setAnimalType] = useState("wild");
  const inputRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!nweet) {
      return;
    }

    let attachmentUrl = "";
    if (attachment) {
      const attachmentRef = storageService
        .ref()
        .child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url");
      attachmentUrl = await response.ref.getDownloadURL();
    }

    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };

    await dbService.collection("nweets").add(nweetObj);

    setNweet("");
    setAttachment("");
    setExpanded(false);
    setShowModal(true);
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onFileChange = (event) => {
    const {
      target: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };
  const onAnimalTypeChange = (event) => {
    const {
      target: { value },
    } = event;
    setAnimalType(value);
  };

  const onClearAttachment = () => {
    setAttachment("");
  };

  const handleInputClick = () => {
    setExpanded(true);
  };

  const handleDocumentClick = (event) => {
    if (inputRef.current && inputRef.current.contains(event.target)) {
      return;
    }
    setExpanded(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="factoryForm">
        {/* <div className="animalType__container">
          <label htmlFor="wild">
            <input
              type="radio"
              id="wild"
              name="animalType"
              value="wild"
              checked={animalType === "wild"}
              onChange={onAnimalTypeChange}
            />
            [야생 동물]
          </label>
          <label htmlFor="stray">
            <input
              type="radio"
              id="stray"
              name="animalType"
              value="stray"
              checked={animalType === "stray"}
              onChange={onAnimalTypeChange}
            />
            [유기 동물]
          </label>
        </div> */}
        <div className="factoryInput__container">
          <input
            className={`factoryInput__input ${expanded ? "expanded" : ""}`}
            value={nweet}
            onChange={onChange}
            type="text"
            placeholder="긴급상황시 사용해 주세요"
            maxLength={120}
            onClick={handleInputClick}
            ref={inputRef}
          />
          <input type="submit" value="등록" className="factoryInput__arrow" />
        </div>
        <label htmlFor="attach-file" className="factoryInput__label">
          <span>사진을 등록해 주세요</span>
          <FontAwesomeIcon icon={faPlus} />
        </label>
        <input
          id="attach-file"
          type="file"
          accept="image/*"
          onChange={onFileChange}
          style={{ opacity: 0 }}
        />
        {attachment && (
          <div className="factoryForm__attachment">
            <img
              src={attachment}
              alt="attachment"
              className="factoryForm__attachmentImg"
            />
            <div className="factoryForm__clear" onClick={onClearAttachment}>
              <span>Remove</span>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}
      </form>
      {/* 모달창으로 알림창 띄우기 */}
      {showModal && (
        <div className="modalContainer">
          <div className="modalContent">
            <h2>제보해 주셔서 감사합니다!</h2>
            <p>다음은 행동강령에 대해 말씀드리겠습니다.</p>
            <div>
              <h3>유기동물의 경우</h3>
              <p>
                구출/보호/포획은 동물보호시설이 관할 지자체와 연계된 경우,
                요청하실 수 있습니다.
              </p>
              <p>
                <a
                  href="https://www.animal.go.kr/front/awtis/institution/institutionList.do?menuNo=1000000059"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  동물보호시설 알아보기
                </a>
              </p>
            </div>
            <div>
              <h3>야생동물의 경우</h3>
              <p>
                구조 기본요령에 대해 안내해드리겠습니다. 아래의 링크를
                확인해주세요
              </p>
              <p>
                <a
                  href="https://www.ansan.go.kr/eco/common/cntnts/selectContents.do?cntnts_id=C0001025"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  구조 기본요령 알아보기
                </a>
              </p>
            </div>
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NweetFactory;
