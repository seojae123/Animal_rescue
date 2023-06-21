import React, { useState, useEffect } from "react";
import { dbService, storageService } from "../fbase";
import { useHistory } from "react-router-dom";

const Write = ({ userObj }) => {
  const [text, setText] = useState("");
  const [showModal, setShowModal] = useState(false); // State for modal
  const [animalType, setAnimalType] = useState("wild");
  const [file, setFile] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const history = useHistory();

  useEffect(() => {
    const loadGoogleMaps = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDWfIzFdASU5Q682XpPRiZKa8yBev-fe1Y&libraries=places`;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    };

    const initMap = () => {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 35.9135, lng: 128.8031 }, // 초기 지도 중심 좌표 설정 (DCU)
        zoom: 15,
      });

      map.addListener("click", (event) => {
        setSelectedLocation({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        });
      });
    };

    loadGoogleMaps();

    return () => {
      const script = document.querySelector(
        "script[src^='https://maps.googleapis.com/maps/api/js']"
      );
      if (script) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const getAddressFromLatLng = (latLng) => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status === "OK" && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject(
            new Error("Failed to get address from the provided coordinates.")
          );
        }
      });
    });
  };

  const saveLocation = async () => {
    if (!selectedLocation) return;

    try {
      const address = await getAddressFromLatLng(selectedLocation);
      await dbService.collection("locations").add({
        address,
        coordinates: selectedLocation,
        createdAt: Date.now(),
      });
      // 성공적으로 저장되었음을 사용자에게 알리는 방법을 구현할 수 있습니다.
      console.log("Location saved successfully!");
    } catch (error) {
      console.error("Failed to save location:", error);
      // 저장 실패에 대한 처리를 구현할 수 있습니다.
    }
  };

  const handleMapClick = (event) => {
    setSelectedLocation({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (text.trim() === "") return;

    try {
      let attachmentUrl = "";
      if (file) {
        const fileRef = storageService
          .ref()
          .child(`${userObj.uid}/${file.name}`);
        const response = await fileRef.put(file);
        attachmentUrl = await response.ref.getDownloadURL();
      }

      await dbService.collection("nweets").add({
        text,
        createdAt: Date.now(),
        creatorId: userObj.uid,
        attachmentUrl,
        animalType: animalType,
        location: selectedLocation,
      });

      setText("");
      setFile(null);
      setSelectedLocation(null);
      setSelectedAddress("");
      setAnimalType("wild");
      setShowModal(true);
    } catch (error) {
      console.error("Failed to create a new post:", error);
    }
  };

  const handleChange = (event) => {
    const { value } = event.target;
    setText(value);
  };

  const handleAnimalTypeChange = (event) => {
    const { value } = event.target;
    setAnimalType(value);
  };

  const handleFileChange = (event) => {
    const { files } = event.target;
    const selectedFile = files[0];
    setFile(selectedFile);
  };

  const closeModal = () => {
    setShowModal(false);
    history.push("/");
  };

  useEffect(() => {
    if (selectedLocation) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: selectedLocation,
        zoom: 15,
      });

      const marker = new window.google.maps.Marker({
        position: selectedLocation,
        map: map,
        draggable: true,
      });

      marker.addListener("dragend", (event) => {
        setSelectedLocation({
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        });
      });
    }
  }, [selectedLocation]);

  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="radioGroup">
          <label>
            <input
              type="radio"
              value="wild"
              checked={animalType === "wild"}
              onChange={handleAnimalTypeChange}
            />
            <span>[야생 동물]</span>
          </label>
          <label>
            <input
              type="radio"
              value="stray"
              checked={animalType === "stray"}
              onChange={handleAnimalTypeChange}
            />
            <span>[유기 동물]</span>
          </label>
        </div>

        {animalType && (
          <p style={{ marginBottom: "10px" }}>
            선택한 동물 종류:{" "}
            {animalType === "wild" ? "야생 동물" : "유기 동물"}
          </p>
        )}

        <div
          id="map"
          style={{ width: "100%", height: "100%", marginBottom: "5px" }}
        ></div>

        {/* {selectedLocation && (
          <div>
            <p>빨간색 점을 이동시켜 대략적인 위치를 찍어주세요!</p>
            <p>
              선택한 위치: {selectedLocation.lat}, {selectedLocation.lng}
            </p>
            <p>선택한 주소: {selectedAddress}</p>
          </div>
        )} */}
        <textarea
          value={text}
          onChange={handleChange}
          placeholder="발견 당시의 상황에 대해 설명해주세요.          지도에 위치를 빨간 점으로 찍어 주세요."
          rows={3}
          className="WriteArea"
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="PhotoInput"
        />
        <button type="submit" className="UploadBtn">
          작성하기
        </button>
      </form>

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
                자연사(병약, 부상, 노약자 등)가 아닌 경우 산림청에 신고하셔야
                합니다.
              </p>
              <p>
                <a
                  href="https://www.forest.go.kr/newkfsweb/cop/bbs/selectBoardArticle.do;jsessionid=cl4VvXq2PHi2gqzyQ2LUZ6PzZn4AmBnmjUSLfodDXp6C9EgmvCexEuSsQaYxamqM.FRAS03_servlet_engine3?nttId=1446229&bbsId=BBSMSTR_1206&itemId=1002"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  산림청 알아보기
                </a>
              </p>
            </div>
            <button onClick={closeModal}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Write;
