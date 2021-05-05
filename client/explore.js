let parkList = document.querySelector(".main");
let regionContainer = document.querySelector("#regioncontainer");


// if region == 
const statesByRegion = {
    west:["AK","NV","CA","AZ","WA","OR","ID"],
    midwest:["ND","SE","MD","NE","KS","OK","IA","MN","WI","IL","IN","MI","OH","KY","TN","MO"],
    southeast:["FL","GA","SC","NC","AL"],
    southwest:["NM","TX","AK","MS","AL","LA"],
    northeast:["ME","VT","NH","NY","PA","NJ","MD","DE","NJ","WV","VA"]
}


const getParkByState = async (state) => {
    const getInfo = await fetch(
    `https://developer.nps.gov/api/v1/parks?stateCode=${state}&api_key=fulAEa7kmQxxruUH93NX1dJp9KT8W7O1loEFHwly`
    );
    const convertInfo = await getInfo.json();
    // convertInfo.data = convertInfo.data
    // .filter((d) => {
    //   if (camping) {
    //     return d.activities.find((a) => a.name === "camping");
    //   }
    // }); 
    parkList.innerHTML = "";

    for (let i = 0; i < convertInfo.data.length; i++) {
        let parkContainer = document.createElement("div");
        parkContainer.className = `container-sm`;
        parkContainer.id ="parkCard"
        let imgDiv = document.createElement("div");
        imgDiv.className="imageDiv";
        let mainImg = document.createElement("img");
        mainImg.className = "parkImage";
        mainImg.height = "325";
        mainImg.width = "325";
        mainImg.src = convertInfo.data[i].images[0] && convertInfo.data[i].images[0].url;
        let infoDiv = document.createElement("div");
        infoDiv.className="infoDiv";
        let parkState = document.createElement("h3");
        parkState.innerHTML = `State: ${convertInfo.data[i].states}`;
        let viewMore = document.createElement("button");
        viewMore.className = "moreInfo"
        viewMore.innerHTML = "More Info?"
        viewMore.addEventListener("click",function(){
            let parkInfo = document.createElement("p");
            parkInfo.innerText = convertInfo.data[i].description;
            let parkDirections = document.createElement("div");
            parkDirections.innerHTML = convertInfo.data[i].directionsInfo + convertInfo.data[i].directionsUrl;
            
            infoDiv.append(parkInfo,parkDirections)
        })
        let parkName = document.createElement("h2");
        parkName.className= "parkNames";
        parkName.innerHTML = convertInfo.data[i].fullName;
        let itenerary = document.createElement("button");
        itenerary.innerHTML = `add to itenerary <i class="far fa-heart"></i>`;
        itenerary.className = "addProfile";
        
        
        // itenerary.addEventListener("click", function () {
        //   (THIS WILL BE WHERE DATABASEINFO TO ADD TO ITENERARY).push(convertInfo.data[i].id);
        //   itenerary.className += "add";
        //   alert("This park has been added to your itenerary! Good luck on your Explorations!");
        // })
      infoDiv.append(parkName, parkState, viewMore, itenerary);
      imgDiv.append(mainImg);
      parkContainer.append(imgDiv, infoDiv);
      parkList.append(parkContainer);
    }
};

let form = document.querySelector("form.fullSearch");
let regionSelector = form.querySelector(".selectpicker");
let stateSelector = form.querySelector(".selectState");
let camp = form.querySelector("#camping");

regionSelector.addEventListener("change", (e) => {  
    const region = e.target.value;
    const states = statesByRegion[region];

    stateSelector.innerHTML = `<option value=""> States</option>`;
    states.forEach(state => {
        stateSelector.innerHTML += "<option value='" + state + "'>" + state + "</option>";
    });
});

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const state = stateSelector.value;
    getParkByState(state,camping);

    //possibly where we send date data
    // const date = form.querySelector( ... ).value;
    // fetch(...) // send the request to the BE with the dates

    return false;
});

//camping option
// camp.addEventListener("click", (e) => {  
//     getParkByRegion(state,camping);
//     console.log(camp)

// });



