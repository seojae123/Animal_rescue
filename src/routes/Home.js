//태그 표시되도록 추가

import React, { useState, useEffect } from "react";
import { dbService, storageService } from "fbase";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { useHistory } from "react-router-dom";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [nweetsPerPage] = useState(5);
  const [selectedAnimalType, setSelectedAnimalType] = useState("all");

  const history = useHistory();

  useEffect(() => {
    dbService
      .collection("nweets")
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const nweetArray = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNweets(nweetArray);
      });
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAnimalTypeChange = (event) => {
    setSelectedAnimalType(event.target.value);
  };

  const filteredNweets = nweets.filter((nweet) => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const lowerCaseText = nweet.text.toLowerCase();
    return lowerCaseText.includes(lowerCaseSearchTerm);
  });

  const filteredNweetsByAnimalType = filteredNweets.filter(
    (nweet) =>
      selectedAnimalType === "all" || nweet.animalType === selectedAnimalType
  );

  const totalPages = Math.ceil(
    filteredNweetsByAnimalType.length / nweetsPerPage
  );

  const handleClickNextPage = () => {
    setCurrentPage((prevPage) => {
      const nextPage = prevPage + 1;
      if (nextPage > totalPages) {
        return prevPage;
      }
      return nextPage;
    });
  };

  const handleClickPrevPage = () => {
    setCurrentPage((prevPage) => {
      const previousPage = prevPage - 1;
      if (previousPage < 1) {
        return 1;
      }
      return previousPage;
    });
  };

  const indexOfLastNweet = currentPage * nweetsPerPage;
  const indexOfFirstNweet = indexOfLastNweet - nweetsPerPage;
  const currentNweets = filteredNweetsByAnimalType.slice(
    indexOfFirstNweet,
    indexOfLastNweet
  );

  const highlightSearchTerm = (text) => {
    if (searchTerm.trim() === "") return text;

    const regex = new RegExp(`(${searchTerm})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  };

  const handleClickWrite = () => {
    history.push("/write");
  };

  return (
    <div className="container">
      <div className="search_Container">
        <input
          type="text"
          placeholder="통합검색"
          value={searchTerm}
          onChange={handleSearch}
          className="search_Input"
        />
      </div>

      {/* 홈 화면 간이 글쓰기*/}
      <NweetFactory userObj={userObj} />

      {/* 동물 선택 태그 + 글쓰기 버튼 */}
      <div className="animalType_Container">
        <select
          value={selectedAnimalType}
          onChange={handleAnimalTypeChange}
          className="animalType_Select"
        >
          <option value="all">전체</option>
          <option value="wild">야생동물</option>
          <option value="stray">유기동물</option>
        </select>
        <button className="writeBtn" onClick={handleClickWrite}>
          글쓰기
        </button>
      </div>

      <div style={{ marginTop: 30 }}>
        {currentNweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.creatorId === userObj.uid}
            truncatedText={
              nweet.text.length > 18
                ? nweet.text.substring(0, 15) + "..."
                : nweet.text
            }
            highlightedText={highlightSearchTerm(nweet.text)}
            animalType={nweet.animalType}
          />
        ))}
      </div>
      {/* <div>
        <button className="writeBtn" onClick={handleClickWrite}>
          글쓰기
        </button>
      </div> */}
      <div className="pagination">
        <button
          onClick={handleClickPrevPage}
          disabled={currentPage === 1}
          className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
        >
          〈 이전
        </button>
        <span> {currentPage} </span>
        <button
          onClick={handleClickNextPage}
          disabled={currentPage === totalPages}
          className={`pagination-button ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          다음 〉
        </button>
      </div>
    </div>
  );
};

export default Home;
