const parkInfoButton = document.querySelector(".get-park-info");
const hotelSearchButton = document.querySelector(".search-button");
const hotelInfoContainer = document.querySelector(".hotel-info");

const getParkInfo = async () => {
  const rawPark = await fetch(
    "https://developer.nps.gov/api/v1/parks?parkCode=abli&api_key=m6434v3FtLw4YiOsDKpm5lq611cn54CHw1iRchdH"
  );
  const convertedPark = await rawPark.json();
  const lat = convertedPark.data[0].latitude;
  const long = convertedPark.data[0].longitude;
  const latContainer = document.querySelector(".lat");
  latContainer.innerHTML = `Latitude is ${lat}`;
  const longContainer = document.querySelector(".long");
  longContainer.innerHTML = `Longitude is ${long}`;
  //   return `${lat},${long}`;
};

// const getHotelInfo = async (latlong) => {
//   const rawHotels = await fetch(
//     `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latlong}&radius=8047&type=lodging&key={APIkey}`
//   );
//   const convertedHotels = await rawHotels.json();
//   const hotelList = convertedHotels.results;
// };

const getHotelInfo = async () => {
  const rawHotels = await fetch(
    `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.5858662,-85.67330523&radius=8047&type=lodging&key={APIkey}`
  );
  const convertedHotels = await rawHotels.json();
  const hotelList = convertedHotels.results;
  for (let i = 0; i < hotelList.length; i++) {
    const nameOfHotel = hotelList[i].name;
    const hotelRating = hotelList[i].rating;
    const nameContainer = document.createElement("h5");
    const ratingContainer = document.createElement("h5");
    nameContainer.innerHTML = nameOfHotel;
    ratingContainer.innerHTML = hotelRating;
    hotelInfoContainer.append(nameContainer, ratingContainer);
  }
  console.log(hotelList);
};

parkInfoButton.addEventListener("click", (e) => {
  getParkInfo();
});

hotelSearchButton.addEventListener("click", (e) => {
  getHotelInfo();
});
