import { Link } from 'react-router-dom';
// import { useEffect } from 'react';

function CTA() {
  // 資料：先搜尋資料後拿到place_id，再用這個place_id去拿它的detail，再用這個detail中的photo_reference去拿照片

  // useEffect(() => {
  //   fetch('https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&radius=1500&type=restaurant&keyword=cruise&key=AIzaSyCcEAICVrVkj_NJ6NU-aYqVMxHFfjrOV6o')
  //     .then((response) => {
  //       console.log(response);
  //       return response.json();
  //     }).then((jsonData) => {
  //       console.log(jsonData);
  //       window.localStorage.setItem('PlcesSearched', jsonData);
  //     }).catch((err) => {
  //       console.log('錯誤:', err);
  //     });
  // }, []);

  //   fetch('https://maps.googleapis.com/maps/api/place/details/json?place_id=ChIJPxnPnrCrQjQRmEwUNrIViu0&language=zh-TW&key=AIzaSyCcEAICVrVkj_NJ6NU-aYqVMxHFfjrOV6o', {
  //     method: 'GET', // *GET, POST, PUT, DELETE, etc.
  //     mode: 'no-cors', // no-cors, cors, *same-origin
  //   })
  //   .then(response => response.json()) // 輸出成 json
  // }
  // )

  return (
    <button type="button">
      <Link to="/my-schedules">
        我的行程
      </Link>
    </button>
  );
}

export default CTA;

// 自己建立行程後，把資料送到schedules-members的db
// 還是直接放在scheduleData的immer裡面就好？？
// 同時把這個行程id，送到這個user的行程array

// 在別人按下確認邀請後，做一樣的事

// 日期：放進去是放string，拿出來也是string
// 拿出來後先把string轉成milliseconds，然後按下加一天的話就加上一天的milliseconds
