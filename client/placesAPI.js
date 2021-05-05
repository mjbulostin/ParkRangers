const CONTAINERname = document.querySelector(".places-ContainerName?");

// Fetch Places section //

const fetchPlaces = async () => {
  let placesData = await fetch("https://maps.googleapis.com/maps/api/place/nearbysearch/json?key=AIzaSyDjAAZs0ZPveQY0a4EZRawHUmt1IbhyW3c");
  let json = await placesData.json();
  // console.log(json);
//   counter = 0;
  for (let places of json.data) {
    // console.log(places);
    const getPlaces = document.querySelector(".places-ContainerName?");
    const placesCard = document.createElement("div");
    placesCard.className = "places-card";
    
    const nameOfPlaces = document.createElement("");
    const img = document.createElement("img");
    img.height = "300";
    img.width = "300";
    img.src = `https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/lodging-71.png"`;
    nameOfPlaces.innerHTML = json.data[]
    location.innerHTML = json.data["location"];
    placesCard.append(img, nameOfPlaces, location);
    getPlaces.append(placesCard);
    // counter += 1
          
}

  return json;
};

const placesButton = document.querySelector(".places-ButtonName?");
placesButton.addEventListener("click", ()=>fetchPlaces()); 

// CLEAR ALL SECTION ?? //
// const clearAll = document.querySelector(".clear-button")
// clearAll.addEventListener("click", () => location.reload())