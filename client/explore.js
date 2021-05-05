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


const getParkByRegion = async (region) => {
    const states = statesByRegion[region]
    console.log(region)
    const getInfo = await fetch(
    `https://developer.nps.gov/api/v1/parks?stateCode=${states.join(",")},ID&api_key=fulAEa7kmQxxruUH93NX1dJp9KT8W7O1loEFHwly`
    );
    const convertInfo = await getInfo.json();
    // convertInfo.data = convertInfo.data
    // .filter((d) => {
    //   if (camping) {
    //     return d.activities.find((a) => a.name === camping);
    //   }
    //     true
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
        let parkInfo = document.createElement("p");
        parkInfo.innerText = convertInfo.data[i].description;
        let parkName = document.createElement("h2");
        parkName.className= "parkNames";
        parkName.innerHTML = convertInfo.data[i].fullName;
        let itenerary = document.createElement("button");
        itenerary.innerHTML = `add to itenerary <i class="far fa-heart"></i>`;
        itenerary.className = "addProfile";
        
        itenerary.addEventListener("click", function () {
          favorites.push(convertInfo.data[i].id);
          itenerary.className += "add";
          alert("This park has been added to your itenerary! Good luck on your Explorations!");
        })
      infoDiv.append(parkName, parkState, parkInfo, itenerary);
      imgDiv.append(mainImg);
      parkContainer.append(imgDiv, infoDiv);
      parkList.append(parkContainer);
    }
};
    
let selector = document.querySelector(".selectpicker");
selector.addEventListener("change", (e) => {  
    const region = e.target.value;
    getParkByRegion(region);

});

// let camp = document.querySelector("#camping");
// camp.addEventListener("click", (e) => {  
//     // const region = e.target.value;
//     getParkByRegion(camping);

// });



