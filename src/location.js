import React, { useEffect, useRef, useState } from 'react';

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const [markersVisible, setMarkersVisible] = useState(true);
  const [activeMarker, setActiveMarker] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);

  const showMarkers = () => {
    setMarkersVisible(true);
    if (activeMarker) {
      activeMarker.setMap(mapRef.current);
      if (infoWindow) {
        infoWindow.open(mapRef.current, activeMarker);
      }
    }
  };

  const hideMarkers = () => {
    setMarkersVisible(false);
    if (activeMarker) {
      activeMarker.setMap(null);
      if (infoWindow) {
        infoWindow.close();
      }
    }
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

        window.kakao.maps.event.addListener(marker, 'click', function() {
          if (marker.getMap() === null) {
            marker.setMap(map);
            setActiveMarker(marker);

            if (infoWindow) {
              infoWindow.close();
            }

            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.coord2Address(position.getLng(), position.getLat(), function(result, status) {
              if (status === window.kakao.maps.services.Status.OK) {
                const infoContents = '<div style="padding:10px;">' + result[0].address.address_name + '</div>';
                const newInfoWindow = new window.kakao.maps.InfoWindow({
                  content: infoContents
                });
                newInfoWindow.open(map, marker);
                setInfoWindow(newInfoWindow);
              } else {
                console.error('Geocoding failed with status:', status);
              }
            });
          } else {
            marker.setMap(null);
            setActiveMarker(null);
            if (infoWindow) {
              infoWindow.close();
              setInfoWindow(null);
            }
          }
        });
      }

      addMarker(new window.kakao.maps.LatLng(37.298761981595376, 126.8379862598931));

      window.kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
        addMarker(mouseEvent.latLng);
      });
    }
  }, [infoWindow, markersVisible]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column-reverse' }}>
      <div>
        {markersVisible ? (
          <button onClick={hideMarkers}>Hide markers</button>
        ) : (
          <button onClick={showMarkers}>Show markers</button>
        )}
      </div>
      <div
        ref={mapContainerRef}
        id="map"
        style={{ width: '80%', height: '600px' }}
      ></div>
    </div>
  );
};

export default MapComponent;
