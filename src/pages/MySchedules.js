// 選擇舊有行程或者創建新的行程
import styled from 'styled-components/macro';
import React, { useEffect, useState } from 'react';
import {
  getDocs, collection, getDoc, doc,
} from 'firebase/firestore';
import { Link } from 'react-router-dom';
import db from '../utils/firebase-init';

const PageWrapper = styled.div`
width:100vw;
height:100vh;
display:flex;
`;

const ChoicesWrapper = styled.div`
width:50vw;
display:flex;
flex-direction:column;
align-items:center;
gap:20px;
`;

const ExistedSchedule = styled.div`
display:flex;
align-items:center;
justify-content:space-between;
width:40vw;
height:auto;
gap:20px;
border:1px black solid;
padding-left:10px;
padding-right:10px;
`;

const Button = styled.button`
height:30px;
`;

const SelectedScheduleWrapper = styled.div`
border:solid blue 1px;
width:40vw;
height:auto;
`;

function MySchedules() {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState();
  // 拿到所有的schedule資料並詢問要編輯哪一個行程，或者要創建新的行程
  async function getSchedule() {
    const querySnapshot = await getDocs(collection(db, 'schedules'));
    const scheduleList = querySnapshot.docs.map((item) => item.data());
    setSchedules(scheduleList);
  }

  useEffect(() => {
    getSchedule();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 拿到點按下去的那筆行程
  async function getSelectedSchedule(id) {
    const docRef = doc(db, 'schedules', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data()); // docSnap.data()是需要取用的那筆資料
      setSelectedSchedule(docSnap.data()); // 放進state中
    } else {
    // doc.data() will be undefined in this case
      console.log('沒有這個行程！');
    }
  }

  console.log('該行程從state拿囉', selectedSchedule);

  // 用按下去那個行程的id去拿整筆資料
  return (
    <PageWrapper>
      <ChoicesWrapper>
        <p>我的行程</p>
        <button type="button">
          <Link to="/choose-date">
            建立行程
          </Link>
        </button>
        {schedules ? schedules.map((item, index) => (
          <ExistedSchedule>
            <p id={item.schedule_id}>
              第
              {index + 1}
              個行程：
              {item.title}
            </p>
            <Button onClick={() => getSelectedSchedule(item.schedule_id)} id={item.schedule_id} type="button">
              選擇此行程
            </Button>
          </ExistedSchedule>
        )) : ''}
      </ChoicesWrapper>
      <SelectedScheduleWrapper>
        <p>您選的行程概覽</p>
        {selectedSchedule ? (
          <>
            <p>
              行程ID:
              {selectedSchedule.schedule_id}
            </p>
            <p>
              行程名稱：
              {selectedSchedule.title}
            </p>
            <button type="button">
              <Link to={`/schedule?id=${selectedSchedule.schedule_id}`}>
                查看詳細資訊
              </Link>
            </button>
          </>
        ) : ''}
      </SelectedScheduleWrapper>

    </PageWrapper>
  );
}

export default MySchedules;
