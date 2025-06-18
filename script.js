document.querySelector(".main").addEventListener("click", async () => {
  const button = document.querySelector(".main");
  const loader = document.getElementById("loader");
  const cardsDiv = document.getElementById("cards");

  button.classList.add("hidden");
  loader.classList.remove("hidden");

  setTimeout(async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        const response = await fetch("stations.json");
        const stations = await response.json();

        // Calculate distances
        stations.forEach(s => {
          s.distance = getDistance(userLat, userLng, s.lat, s.lng);
        });

        // Sort stations by distance
        const sorted = stations.sort((a, b) => a.distance - b.distance).slice(0, 3);

        loader.classList.add("hidden");
        cardsDiv.classList.remove("hidden");

        cardsDiv.innerHTML = ""; // Clear previous

        sorted.forEach((station, i) => {
          const card = document.createElement("div");
          card.className = "card";
          card.innerHTML = `
            <div id="map${i}" class="map"></div>
            <div><strong>${station.name}</strong></div>
            <div>${station.distance.toFixed(2)} km away</div>
          `;
          cardsDiv.appendChild(card);

          // Initialize mini map
          const map = L.map(`map${i}`, {
            zoomControl: false,
            attributionControl: false
          }).setView([station.lat, station.lng], 15);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          L.marker([station.lat, station.lng]).addTo(map);
        });

      }, () => {
        loader.textContent = "Could not get your location.";
      });
    } else {
      loader.textContent = "Geolocation not supported.";
    }
  }, 1500);
});

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

