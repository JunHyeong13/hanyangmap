import React, { useEffect, useRef } from 'react';

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const openInfoWindowRef = useRef(null);

  useEffect(() => {
    if (mapContainerRef.current) {
      const mapOption = {
        center: new window.kakao.maps.LatLng(37.298761981595376, 126.8379862598931),
        level: 3
      };

      const map = new window.kakao.maps.Map(mapContainerRef.current, mapOption);
      mapRef.current = map;

      // Function to add a marker and display the address
      function addMarkerAndAddress(position) {
        // Remove the previously created marker if it exists
        if (markerRef.current) {
          markerRef.current.setMap(null);
        }

        // Create a marker
        const marker = new window.kakao.maps.Marker({
          position: position
        });

        markerRef.current = marker;

        // Event listener for marker click
        window.kakao.maps.event.addListener(marker, 'click', function() {
          // Create a geocoder instance
          const geocoder = new window.kakao.maps.services.Geocoder();

          // Get the address based on the clicked position
          geocoder.coord2Address(position.getLng(), position.getLat(), function(result, status) {
            if (status === window.kakao.maps.services.Status.OK) {
              const address = result[0].address.address_name;
              const infoContents = `<div style="padding:10px;">${address}<br><a href="https://map.kakao.com/?q=${address}" style="color:blue" target="_blank">길찾기</a></div>`;
        
              // Create an infoWindow with the infoContents
              const infoWindow = new window.kakao.maps.InfoWindow({
                position: position,
                content: infoContents
              });

              // Close the previously open infoWindow if there is one
              if (openInfoWindowRef.current) {
                openInfoWindowRef.current.close();
              }

              // Open the new infoWindow and update the openInfoWindow variable
              infoWindow.open(map, marker);
              openInfoWindowRef.current = infoWindow;

              // Center the map on the clicked marker and increase the level
              map.setCenter(position);
              map.setLevel(1); // You can adjust the level as needed
            } else {
              console.error('Geocoding failed with status:', status);
            }
          });
        });

        // Add the marker to the map
        marker.setMap(map);
      }

      // Event listener to add a marker and display the address on map click
      window.kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
        addMarkerAndAddress(mouseEvent.latLng);
      });
    }
  }, []);

  return (
    <div
      ref={mapContainerRef}
      id="map"
      style={{ width: '100%', height: '70vh' }} // Adjust the height as needed
    ></div>
  );
};

export default MapComponent;