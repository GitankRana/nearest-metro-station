document.querySelector(".main").addEventListener("click", () => {
  const resultdiv = document.getElementById("result");
  resultDiv.classList.add("hidden");

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const userLat = position.coords.latitude;
      const userLng = position.coords.longitude;

      const response = await fetch("stations.json");
      const stations = await response.json();

      let closestStation = null;
      let minDistance = Infinity;

      stations.forEach(station => {
        const distance = getDistance(userLat, userLng, station.lat, station.lng);
        if (distance < minDistance) {
          minDistance = distance;
          closestStation = station;
        }
      });

       resultDiv.innerHTML = `
        <strong>Nearest Metro Station:</strong><br>
        ${closestStation.name} <br>
        <span style="font-size:18px;">${minDistance.toFixed(2)} km away</span>
      `;
       resultDiv.classList.remove("hidden");
    }, () => {
      resultDiv.innerHTML = "❌ Could not get your location.";
      resultDiv.classList.remove("hidden");
    });
  } else {
    resultDiv.innerHTML = "❌ Geolocation is not supported in your browser.";
    resultDiv.classList.remove("hidden");
  }
});

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
