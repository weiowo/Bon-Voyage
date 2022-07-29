import styled from 'styled-components/macro';

const RestaurantBox = styled.div`
  display:flex;
  align-items:center;
  width:350px;
  height:160px;
  margin-top:20px;
  cursor:pointer;
  background-color:#FAFAFA;
  padding-left:38px;
  border-radius:15px;
  border: #3f3f3f solid 1px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  @media screen and (max-width:777px){
    margin-top:15px;
    width:330px;
    padding-left:25px;
  }
  @media screen and (max-width:513px){
    margin-top:15px;
    width:330px;
    padding-left:25px;
}
`;

export const RestaurantPhoto = styled.img`
  border-radius:20px;
  width:105px;
  height:105px;
  margin-right:20px;
  object-fit: cover;
`;

export const RestaurantBoxRightContent = styled.div`
  width:auto;
  display:flex;
  flex-direction:column;
  align-items:flex-start;
`;

export const RestaurantTitle = styled.div`
  font-size:16px;
  margin-top:10px;
  font-weight:600;
  align-self:left;
  justify-content:left;
  text-align:left;
  width:160px;
`;

export const RestaurantDescription = styled.div`
  font-size:10px;
  margin-top:5px;
  color:#949494;
`;

export const RestaurantSeeMoreButton = styled.button`
  width:80px;
  background-color:#63666A;
  color:white;
  border-radius:3px;
  font-size:10px;
  border:none;
  outline:none;
  margin-top:10px;
  cursor:pointer;
`;

export default RestaurantBox;
