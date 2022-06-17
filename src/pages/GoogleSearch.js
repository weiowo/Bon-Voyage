// import { Link } from 'react-router-dom';

// function CTA() {
//   let map;
//   let service;
//   //   let infowindow;

//   function initMap() {
//     const pyrmont = new google.maps.LatLng(-33.8665433, 151.1956316);

//     map = new google.maps.Map(document.getElementById('map'), {
//       center: pyrmont,
//       zoom: 15,
//     });

//     const request = {
//       location: pyrmont,
//       radius: '700',
//       type: ['lodging'],
//     };

//     service = new google.maps.places.PlacesService(map);
//     service.nearbySearch(request, callback);
//   }

//   function callback(results, status) {
//     if (status == google.maps.places.PlacesServiceStatus.OK) {
//       console.log(results);
//       for (let i = 0; i < results.length; i++) {
//         createMarker(results[i].geometry.location);
//       }
//     }
//   }
//   function createMarker(position) {
//     new google.maps.Marker({
//       position,
//       map,
//     });
//   }

//   return (
//     <button type="button">
//       <Link to="/choose-date">
//         建立行程
//       </Link>
//     </button>

//   );
// }

// export default CTA;
