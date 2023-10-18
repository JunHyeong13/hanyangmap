import React, { useEffect, useRef } from 'react';

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.298761981595376, 126.8379862598931),
        level: 3
      };

      const map = new window.kakao.maps.Map(mapContainerRef.current, mapOption);
      mapRef.current = map;

      // Map Type Control
      const mapTypeControl = new window.kakao.maps.MapTypeControl();
      map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

      // Zoom Control
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

      // Create a marker position
      const position = new window.kakao.maps.LatLng(37.298761981595376,126.8379862598931);

      // Create a marker
      const marker = new window.kakao.maps.Marker({
        position: position
      });

      // Add the marker to the map
      marker.setMap(map);

      // Create an info window content
      const iwContent = '<div style="padding:6px;">Hanyang Shuttle</div>';

      // Create an info window
      const infowindow = new window.kakao.maps.InfoWindow({
        content: iwContent
      });

      // Add a mouseover event to the marker
      window.kakao.maps.event.addListener(marker, 'mouseover', function() {
        // When the mouse is over the marker, display the info window
        infowindow.open(map, marker);
      });

      // Add a mouseout event to the marker
      window.kakao.maps.event.addListener(marker, 'mouseout', function() {
        // When the mouse is out of the marker, close the info window
        infowindow.close();
      });
    }
  }, []);

  return (
    <div
      ref={mapContainerRef}
      id="map"
      style={{ width: '100%', height: '400px' }}
    ></div>
  );
};

export default MapComponent;
