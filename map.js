$(document).ready(function () {
    const urlParams = new URLSearchParams(window.location.search);
    const graveLat = parseFloat(urlParams.get('lat'));
    const graveLng = parseFloat(urlParams.get('lng'));
    const kioskLat = parseFloat(urlParams.get('kiosk_lat'));
    const kioskLng = parseFloat(urlParams.get('kiosk_lng'));
  
    const map = L.map("map").setView([kioskLat, kioskLng], 13); // Use kiosk location as the center
    
    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  
    // Add markers for Kiosk and Grave location
    L.marker([kioskLat, kioskLng]).addTo(map).bindPopup("Kiosk Location").openPopup();
    L.marker([graveLat, graveLng]).addTo(map).bindPopup("Grave Location").openPopup();
  
    // Add routing control for directions between Kiosk and Grave
    L.Routing.control({
      waypoints: [
        L.latLng(kioskLat, kioskLng),
        L.latLng(graveLat, graveLng),
      ],
      createMarker: function () { return null; },
      routeWhileDragging: true,
    }).addTo(map);
  });
  