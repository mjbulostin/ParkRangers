let parkList = document.querySelector(".main");
let regionContainer = document.querySelector("#regioncontainer");

// if region ==
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

let tripList = [];
let form = document.querySelector("form.fullSearch");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const state = stateSelector.value;
  getParkByState(state);
  const tripName = form.querySelector(".trip").value;
  const startDate = form.querySelector("#start").value;
  const endDate = form.querySelector("#end").value;
  tripList = [tripName, startDate, endDate];

  //possibly where we send date data
  // const date = form.querySelector( ... ).value;
  // fetch(...) // send the request to the BE with the dates

  return false;
});

const getParkByState = async (state) => {
  const getInfo = await fetch(
    `https://developer.nps.gov/api/v1/parks?stateCode=${state}&api_key=m6434v3FtLw4YiOsDKpm5lq611cn54CHw1iRchdH`
  );
  const convertInfo = await getInfo.json();
  // convertInfo.data = convertInfo.data
  // .filter((d) => {
  //   if (camping) {
  //     return d.activities.find((a) => a.name === "camping");
  //   }
  // });
  parkList.innerHTML = "";

  let dataForDB = [];

  for (let i = 0; i < convertInfo.data.length; i++) {
    let parkContainer = document.createElement("div");
    parkContainer.className = `container-sm`;
    parkContainer.id = "parkCard";
    let imgDiv = document.createElement("div");
    imgDiv.className = "imageDiv";
    let mainImg = document.createElement("img");
    mainImg.className = "parkImage";
    mainImg.height = "325";
    mainImg.width = "325";
    mainImg.src =
      convertInfo.data[i].images[0] && convertInfo.data[i].images[0].url;
    let infoDiv = document.createElement("div");
    infoDiv.className = "infoDiv";
    let parkState = document.createElement("h3");
    parkState.innerHTML = `State: ${convertInfo.data[i].states}`;
    let viewMore = document.createElement("button");
    viewMore.className = "moreInfo";
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
    itenerary.innerHTML = `add to itenerary <i class="far fa-heart"></i>`;
    itenerary.className = "addProfile";
    let moreInfoURL = convertInfo.data[i].url;

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
};

let regionSelector = form.querySelector(".selectpicker");
let stateSelector = form.querySelector(".selectState");
let camp = form.querySelector("#camping");

regionSelector.addEventListener("change", (e) => {
  const region = e.target.value;
  const states = statesByRegion[region];

  stateSelector.innerHTML = `<option value=""> States</option>`;
  states.forEach((state) => {
    stateSelector.innerHTML +=
      "<option value='" + state + "'>" + state + "</option>";
  });
});
