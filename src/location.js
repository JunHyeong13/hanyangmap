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

      const map = new window.kakao.maps.Map(mapContainerRef.current, mapOption);
      mapRef.current = map;

      const mapTypeControl = new window.kakao.maps.MapTypeControl();
      map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      function addMarker(position) {
        const marker = new window.kakao.maps.Marker({
          position: position
        });
        marker.setMap(markersVisible ? map : null);

        window.kakao.maps.event.addListener(marker, 'mouseover', function() {
          infowindow.open(map, marker);
        });

        window.kakao.maps.event.addListener(marker, 'mouseout', function() {
          infowindow.close();
        });
      }

      const infoContents = '<div style="padding:10px;">ERICA Shuttle</div>';
      const infowindow = new window.kakao.maps.InfoWindow({
        content: infoContents
      });

      addMarker(new window.kakao.maps.LatLng(37.298761981595376, 126.8379862598931));

      window.kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
        addMarker(mouseEvent.latLng);
      });

      // Add Geolocation Functionality
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const userPosition = new window.kakao.maps.LatLng(lat, lon);
          addMarker(userPosition); // Add a marker for the user's location
        });
      }
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
