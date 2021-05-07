let body = document.querySelector("body")
let parkList = document.querySelector(".main");
let tripNameField = document.querySelector(".trip")
let tripList = [];
let form = document.querySelector("form.fullSearch");
let regionSelector = form.querySelector(".selectpicker");
let stateSelector = form.querySelector(".selectState");

//state lists for region categories
const statesByRegion = {
  west: ["AK", "NV", "CA", "AZ", "WA", "OR", "ID"],
  midwest: [
    "ND",
    "SE",
    "MD",
    "NE",
    "KS",
    "OK",
    "IA",
    "MN",
    "WI",
    "IL",
    "IN",
    "MI",
    "OH",
    "KY",
    "TN",
    "MO",
  ],
  southeast: ["FL", "GA", "SC", "NC", "AL"],
  southwest: ["NM", "TX", "AK", "MS", "AL", "LA"],
  northeast: ["ME", "VT", "NH", "NY", "PA", "NJ", "MD", "DE", "NJ", "WV", "VA"],
};


//calls parks API after validating user does not have duplicate trip name
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const state = stateSelector.value;
  const tripName = form.querySelector(".trip");
  const data = await fetch("http://localhost:3000/user-trip-names")
  const json = await data.json()
  const usedNames = json.nameString.split(" ")
  const startDate = form.querySelector("#start");
  const endDate = form.querySelector("#end");
  for(tName of usedNames){
    console.log(usedNames)
    if(tName === tripName.value){
      tripName.value = ""
      regionSelector.value = ""
      alert("That trip name already exists. Please enter a unique name.")
      location.reload()

    }
  }
  if(tripName.value){
    tripList = [tripName.value, startDate.value, endDate.value]
    getParkByState(state)
  }
  


  return false;
});

//API call and card generator
const getParkByState = async (state) => {
  const getInfo = await fetch(
    `https://developer.nps.gov/api/v1/parks?stateCode=${state}&api_key=m6434v3FtLw4YiOsDKpm5lq611cn54CHw1iRchdH`
  );
  const convertInfo = await getInfo.json();

  parkList.innerHTML = "";

  for (let i = 0; i < convertInfo.data.length; i++) {
    let parkContainer = document.createElement("div");
    parkContainer.className = `card`;
    parkContainer.id = "parkCard";
    let imgDiv = document.createElement("div");
    imgDiv.className = "card-title";
    let mainImg = document.createElement("img");
    mainImg.className = "card-img-top";
    mainImg.height = "325";
    mainImg.width = "325";
    mainImg.src =
      convertInfo.data[i].images[0] && convertInfo.data[i].images[0].url;
    let infoDiv = document.createElement("div");
    infoDiv.className = "card-body";
    let parkState = document.createElement("h3");
    parkState.innerHTML = `State: ${convertInfo.data[i].states}`;
    let viewMore = document.createElement("button");
    viewMore.className = "btn btn-warning btn-sm text-light";
    viewMore.innerHTML = "More Info?";
    viewMore.addEventListener("click", function () {
      let parkInfo = document.createElement("p");
      parkInfo.innerText = convertInfo.data[i].description;
      let parkDirections = document.createElement("div");
      parkDirections.innerHTML =
        convertInfo.data[i].directionsInfo + convertInfo.data[i].directionsUrl;

      infoDiv.append(parkInfo, parkDirections);
    });
    let parkName = document.createElement("h2");
    parkName.className = "parkNames";
    parkName.innerHTML = convertInfo.data[i].fullName;
    let itenerary = document.createElement("button");
    itenerary.innerHTML = `Add to Itinerary +`;
    itenerary.className = "btn btn-success btn-sm text-light";

    itenerary.addEventListener("click", async function () {
      const dataForParkDB = await fetch("http://localhost:3000/addToParksDB", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          parkName: convertInfo.data[i].fullName,
          directionsURL: convertInfo.data[i].directionsUrl,
          moreInfoURL: convertInfo.data[i].url,
          parkImage:
            convertInfo.data[i].images[0] && convertInfo.data[i].images[0].url,
          tripName: tripList[0],
          startDate: tripList[1],
          endDate: tripList[2],
        }),
      });
      const dataForTripDB = await fetch("http://localhost:3000/addToTripsDB", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tripName: tripList[0],
          startDate: tripList[1],
          endDate: tripList[2],
        }),
      });
      itenerary.className += "add";
      alert(
        "This park has been added to your itenerary! Good luck on your Explorations!"
      );
      console.log(dataForTripDB);
    });
    infoDiv.append(parkName, parkState, viewMore, itenerary);
    imgDiv.append(mainImg);
    parkContainer.append(imgDiv, infoDiv);
    parkList.append(parkContainer); 
  }
  const doneBtnDiv = document.createElement("div")
  doneBtnDiv.className = "done-btn-div"
  const tripRedirectLink = document.createElement("a")
  tripRedirectLink.href = "/view-all-trips"
  tripRedirectLink.innerHTML = '<button type="button" class="btn btn-warning btn-lg text-light">Save Trip</button>'
  doneBtnDiv.append(tripRedirectLink)
  body.append(doneBtnDiv)
};

//generates state list based on region selection
regionSelector.addEventListener("change", (e) => {
  const region = e.target.value;
  const states = statesByRegion[region];

  stateSelector.innerHTML = `<option value=""> States</option>`;
  states.forEach((state) => {
    stateSelector.innerHTML +=
      "<option value='" + state + "'>" + state + "</option>";
  });
});
