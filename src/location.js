/*global kakao*/ 
import React, { useEffect } from 'react';


const Location = () =>{

  useEffect(()=>{

    kakao.maps.load(() =>{
        var container = document.getElementById('map'); // 지도를 담을 영역의 DOM 레퍼런스
        var options = {
            center: new kakao.maps.LatLng(37.30026567392737, 126.83723016290692), // 지도의 중심좌표 값 (한양대학교 에리카 아고라본관)
            level: 3 // 지도의 레벨 (확대, 축소 정도)
        };
        var map = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴

         // 다른 지역을 클릭했을 때 마커가 보일 수 있도록 함. 
        var locations = [
            {
                name : "1st Enginerring Building",
                latlng : new kakao.maps.LatLng(37.29764384175927,126.83736269665977)
            },
            // Add more locations as needed
            {
                name : "2nd Enginerring Building",
                latlng : new kakao.maps.LatLng(37.29782352864101,126.83698447631201)
            },
            {
                name : "3rd Enginerring Building",
                latlng : new kakao.maps.LatLng(37.29748910309424,126.83622953442165)
            },
            {
                name : "4th Enginerring Building",
                latlng : new kakao.maps.LatLng(37.29693042335983,126.83620254944438)
            },
            {
                name : "5th Enginerring Building",
                latlng : new kakao.maps.LatLng(37.296781253268534,126.8374745187488)
            },
            {
                name : "Erica Shuttle",
                latlng : new kakao.maps.LatLng(37.298761981595376,126.8379862598931)
            }];

            locations.forEach(location => {
                var marker = new kakao.maps.Marker({
                  position: location.latlng,
                  map: map,
                });
        
                var infoContent = '<div class="custom-infowindow">' + location.name + '</div>';
                var infoWindow = new kakao.maps.InfoWindow({
                  content: infoContent
                });
        
                kakao.maps.event.addListener(marker, 'click', function () {
                    if (infoWindow.getMap()) {
                        infoWindow.close();
                      } else {
                        infoWindow.open(map, marker);
                      }
                    });
                    return infoWindow;
            // Create custom overlays for each location
            // var overlays = locations.map(location => {
            //     var overlayContent = '<div class="custom-overlay">' + location.name + '</div>';
            //     return new kakao.maps.CustomOverlay({
            //         content: overlayContent,
            //         map: map,
            //         position: location.latlng,
            //     });
            //  });
    
            // overlays.forEach((overlay, index) => {
            //     kakao.maps.event.addListener(overlay, 'click', function () {
            //     // Create and add a marker for the clicked location
            //     var marker = new kakao.maps.Marker({
            //             position: locations[index].latlng
            //         });
            //         marker.setMap(map);    
            //         alert('This is ' + locations[index].name);
            //     });    
            });
        });
    }, []);

    return (
        <div>
        	<div id="map" style={{width:"1280px", height:"800px"}}></div> 
        </div>
    );
}

export default Location;

// Custom CSS for InfoWindow
const infoWindowStyle = `
.custom-infowindow {
  background: navy;
  border-radius: 6px;
  color: white;
  font-size: 15px;
  padding: 10px;
  text-align: center;
  position: relative;
  min-width: 180px;
}

.arrow {
    position: relative;
    border: 10px solid transparent;
    border-bottom-color: navy;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
  }

  .info {
    z-index: 1;
  }
  
`;


const style = document.createElement('style');
style.appendChild(document.createTextNode(infoWindowStyle));
document.head.appendChild(style);