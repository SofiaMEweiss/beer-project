//Navbar

const mainMenu = document.querySelector('.mainMenu');
const closeMenu = document.querySelector('.closeMenu');
const openMenu = document.querySelector('.openMenu');

openMenu.addEventListener('click', show);
closeMenu.addEventListener('click', close);

function show() {
    mainMenu.style.display = 'flex';
    mainMenu.style.top = '0';
}

function close() {
    mainMenu.style.top = '-100%';
}


let menulink = document.querySelectorAll(".nav-link");
for (let i = 0; i < menulink.length; i++) {
    menulink[i].addEventListener('click', () => {
        nysida(i);
    });
}




//Main

const url = "https://api.punkapi.com/v2/beers/random";

const eMain = document.querySelector("main");

const noPic = "img/beer_without_image.png";




let initRandom = () => {

    const sectElement = document.createElement("section");
    sectElement.id = "indexSearchSection";
    eMain.appendChild(sectElement);

    const divElement = document.createElement("div");
    divElement.className = "showbeer";
    sectElement.appendChild(divElement);

    const buttonElement = document.createElement("button");
    buttonElement.textContent = "Click me for a random beer";
    buttonElement.type = "button";
    buttonElement.id = "button";
    buttonElement.name = "button";
    sectElement.appendChild(buttonElement);

    button.addEventListener('click', () => {
        fetcher(url, createRandomBeer);
    });

}




let displayRandomBeer = (beerName, beerImage, beerId) => {

    const divElement = document.querySelector(".showbeer");

    removeAllChildNodes(divElement);

    const sectionElement = document.createElement("section")
    sectionElement.className = "beercard";
    const h2Element = document.createElement("h2");
    const imgElement = document.createElement("img");
    const aElement = document.createElement("a");

    let textNode = document.createTextNode(beerName);
    let linkNode = document.createTextNode("See More");

    imgElement.src = beerImage;
    imgElement.alt = "image:";

    //aElement.href = "info.html?name=" + beerId;
    aElement.href = "#";
    aElement.addEventListener('click', () => {
        nysida(3);
        showProduct(beerId);
    });
    aElement.className = "seeMoreLink";

    divElement.appendChild(imgElement);
    divElement.appendChild(h2Element);
    h2Element.appendChild(textNode);
    divElement.appendChild(aElement);
    aElement.appendChild(linkNode);

}


let createRandomBeer = (data) => {
    let beer = data[0].name;
    let beerpic = data[0].image_url;
    let beerId = data[0].id;
    //console.log(data[0]);
    // Gratisbild: https://pixabay.com/sv/vectors/flaska-%C3%B6l-siluett-svart-dryck-310313/
    if (data[0].image_url == null) { beerpic = noPic; }

    displayRandomBeer(beer, beerpic, beerId);
}







//Skapar DOM-element och information för specifik öl-produkt:

let showProduct = (beerId) => {

    fetcher("https://api.punkapi.com/v2/beers/" + beerId, showProduct2);

}

let showProduct2 = (beerId) => {

    console.log(beerId);

    let main = document.querySelector("main");

    let card = document.createElement("div");
    main.appendChild(card);
    card.className = "card";

    let imgElement = document.createElement("img");
    imgElement.className = "showimg";
    imgElement.alt = "bild:";
    imgElement.src = noPic;
    if (beerId[0].image_url != null) {
        imgElement.src = beerId[0].image_url;
    }
    card.appendChild(imgElement);


    let cardContainer = document.createElement("div");
    cardContainer.className = "card-container";

    let infoElement = document.createElement("ul");
    infoElement.className = "showinfo";

    /*
    let eContainer = document.createElement("section");
    eContainer.className = "testblock";
    eMain.appendChild(eContainer);

    let eContainer2 = document.createElement("div");
    eContainer.appendChild(eContainer2);
    eContainer2.className = "testblock2";

    let eContainer3 = document.createElement("div");
    eContainer.appendChild(eContainer3);
    eContainer3.className = "testblock2";

    let imgElement = document.createElement("img");
    eContainer3.appendChild(imgElement);
    imgElement.className = "showimg";
    imgElement.alt = "bild:";
    imgElement.src = beerId[0].image_url;

    let infoElement = document.createElement("ul");
    eContainer2.appendChild(infoElement);
    infoElement.className = "showinfo";
*/

    let malt_add = [];
    let hops_add = [];
    let foods_add = [];

    console.log(beerId[0].food_pairing);

    extractData(beerId[0].ingredients.malt, malt_add, true);
    extractData(beerId[0].ingredients.hops, hops_add, true);
    extractData(beerId[0].food_pairing, foods_add, false);



    /*
    malt_get.forEach(element => {
        console.log(element);
        let myString=" "+element.name+" ("+element.amount.value+" "+element.amount.unit+")";
        malt_add.push(myString);
    });
    */


    //const hops = beerId[0].ingredients.hops;
    //console.log(malt);

    //array1.forEach(element => console.log(element));


    let infoData = [
        { desc: "Alcohol by volume", val: beerId[0].abv },
        { desc: "Volume", val: beerId[0].volume.value + " " + beerId[0].volume.unit },
        { desc: "Ingredients", val: "MALTS: " + malt_add + " YEAST: " + beerId[0].ingredients.yeast },
        { desc: "Hops", val: hops_add },
        { desc: "Food pairing", val: foods_add },
        { desc: "Brewers tips", val: beerId[0].brewers_tips }
    ];

    for (let i = 0; i < infoData.length; i++) {
        let optElement = document.createElement("li");
        optElement.className = "showoption";
        let hElement = document.createElement("span");
        hElement.className = "nah";
        optElement.textContent = infoData[i].desc + ": ";
        hElement.textContent = infoData[i].val;
        hElement.style.color = "red";
        infoElement.appendChild(optElement);
        optElement.appendChild(hElement);
    }

    cardContainer.appendChild(infoElement);
    card.appendChild(cardContainer);
    main.appendChild(card)


}


let extractData = (to_get, to_add, classt) => {
    let myString;
    to_get.forEach(element => {
        console.log(element);
        if (classt == true) {
            myString = " " + element.name + " (" + element.amount.value + " " + element.amount.unit + ")";
        } else { myString = " " + element; }
        to_add.push(myString);
    });
}




//GENERELLA FUNKTIONER:

//ange den URL som ska hämtas, samt den funktion (utan ()) som skall anropas:
let fetcher = (url, callback) => {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            callback(data);
        })
        .catch(error => console.log(error));

}


//parent skall vara den klass eller det element vars children skall raderas:
let removeAllChildNodes = (parent) => {
    while (parent.firstChild) {
        parent.firstChild.remove();
    }
}


let nysida = (param) => {
    removeAllChildNodes(eMain);
    switch (param) {
        case 0:
            const button = document.querySelector("#button");
            initRandom();
            break;

    }
    // let nyttElement = document.createElement("p");
    // eMain.appendChild(nyttElement);
    // nyttElement.textContent = '';

}


//GENERELLA FUNKTIONER END:





nysida(0);