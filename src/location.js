import React, { useEffect, useRef, useState } from 'react';

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [markersVisible, setMarkersVisible] = useState(true);

  const showMarkers = () => {
    setMarkersVisible(true);
  };

  const hideMarkers = () => {
    setMarkersVisible(false);
  };

  useEffect(() => {
    if (mapContainerRef.current) {
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.298761981595376, 126.8379862598931),
        level: 3
      };

      // 현재 위치 기준으로 보여줌. (참조 : useEffect)
      const map = new window.kakao.maps.Map(mapContainerRef.current, mapOption);
      mapRef.current = map;

      // 일반 지도 형태 | 위성 지도 형태
      const mapTypeControl = new window.kakao.maps.MapTypeControl();
      map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

      // 지도 줌인/줌아웃
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      // 마커를 원하는 지점에 클릭하여 생성
      function addMarker(position) {
        const marker = new window.kakao.maps.Marker({
          position: position
        });
        marker.setMap(markersVisible ? map : null);

        // 마커 이벤트 1 (마우스를 마커 가까이 오버레이 했을 떄 보여짐)
        window.kakao.maps.event.addListener(marker, 'mouseover', function() {
            infowindow.open(map, marker);
            });
        
        // 마커 이벤트 2 (마우스를 마커로부터 멀어지게하면 보이지 않음)
        window.kakao.maps.event.addListener(marker, 'mouseout', function() {
            infowindow.close();
            });
      }
      
      // 마커 위에 보일 수 있는 info 만들기
      const infoContents = '<div style="padding:10px;">ERICA Shuttle</div>';
      const infowindow = new window.kakao.maps.InfoWindow({
        content: infoContents
      });
      
      // 처음 마커가 생성되어 보이는 위치 
      addMarker(new window.kakao.maps.LatLng(37.298761981595376, 126.8379862598931));

      // Click event to add a marker
      window.kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
        addMarker(mouseEvent.latLng);
      });
    }
  }, [markersVisible]);

  return (
    <div
      ref={mapContainerRef}
      id="map"
      style={{ width: '80%', height: '600px' }}
    >
      {markersVisible ? (
        <div>
          <button onClick={hideMarkers}>마커 감추기</button>
        </div>
      ) : (
        <div>
          <button onClick={showMarkers}>마커 보이기</button>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
