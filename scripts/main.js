////////////////////
////////Nav////////
//////////////////

//Öppna & stäng meny i mobilt  läge
const mainMenu = document.querySelector('.mainMenu');
const closeMenu = document.querySelector('.closeMenu');
const openMenu = document.querySelector('.openMenu');

let show = () => {
    mainMenu.style.display = 'flex';
    mainMenu.style.top = '0';
}

let close = () => {
    mainMenu.style.top = '-100%';
}

openMenu.addEventListener('click', show);
closeMenu.addEventListener('click', close);

//Länkar till ny sida i nav
let menulink = document.querySelectorAll(".nav-link");
for (let i = 0; i < menulink.length; i++) {
    menulink[i].addEventListener('click', () => {
        nysida(i);
    });
}

////////////////////
///////Main////////
//////////////////

const url = "https://api.punkapi.com/v2/beers/random";
const eMain = document.querySelector("main");
const noPic = "img/beer_without_image.png";

//Skapar upp elementen för knapp & card. Initieras i slutet av denna js-fil.
let initRandom = () => {
    const sectElement = createNewElement("section", eMain, { class: 'indexRandomBeerSection' }, "");
    createNewElement("div", sectElement, { class: 'showBeerContainer' }, "");
    const buttonElement = createNewElement("button", sectElement, { type: 'button', id: 'button', name: 'button' }, "Click for a random beer");

    buttonElement.addEventListener('click', () => {
        fetcher(url, createRandomBeer);
    });
}

//Radera & skapa alla element i div .showBeerContainer
let displayRandomBeer = (beerName, beerImage, beerId) => {
    const divElement = document.querySelector(".showBeerContainer");
    removeAllChildNodes(divElement);
    const sectionElement = createNewElement("section", divElement, { class: 'beercard' }, "");
    createNewElement("h2", sectionElement, {}, beerName);
    createNewElement("img", sectionElement, { src: beerImage, alt: "A random beer" }, "");
    const aElement = createNewElement("a", sectionElement, { class: "seeMoreLink", href: "#" }, "See More");

    //gå till produktsida (3), skapa upp element.
    aElement.addEventListener('click', () => {
        nysida(3);
        showProduct(beerId);
    });
}

//hit kommer vi när API-datan kommit
let createRandomBeer = (data) => {
    let beer = data[0].name;
    let beerpic = data[0].image_url;
    let beerId = data[0].id;
    // Gratisbild: https://pixabay.com/sv/vectors/flaska-%C3%B6l-siluett-svart-dryck-310313/
    if (data[0].image_url == null) { beerpic = noPic; }

    displayRandomBeer(beer, beerpic, beerId);
}

//Skapar DOM-element och information för specifik öl-produkt:
let showProduct = (beerId) => {
    fetcher("https://api.punkapi.com/v2/beers/" + beerId, showProduct2);
}

let showProduct2 = (beerId) => {
    let eContainer = createNewElement("section", eMain, { class: 'indexInfoBeerSection' }, "");
    let eContainer2 = createNewElement("div", eContainer, { class: 'beerImgContainer' }, "");
    createNewElement("h2", eContainer2, {}, beerId[0].name);
    let imgElement = createNewElement("img", eContainer2, { class: 'showimg', alt: "Picture of bottle", src: noPic }, "");

    if (beerId[0].image_url != null) {
        imgElement.src = beerId[0].image_url;
    }

    let eContainer3 = createNewElement("article", eContainer, { class: 'beerInfoContainer' }, "");
    let infoElement = createNewElement("ul", eContainer3, {}, "");

    let malt_add = [],
        hops_add = [],
        foods_add = [];
    //ferm_add = [],
    //mash_add = [];

    extractData(beerId[0].ingredients.malt, malt_add, true);
    extractData(beerId[0].ingredients.hops, hops_add, true);
    extractData(beerId[0].food_pairing, foods_add, false);

    let infoData = [
        { desc: "Description", val: beerId[0].description },
        { desc: "First brewed", val: beerId[0].first_brewed },
        { desc: "Alcohol by volume", val: beerId[0].abv },
        { desc: "Volume", val: beerId[0].volume.value + " " + beerId[0].volume.unit },
        { desc: "Boil volume", val: beerId[0].boil_volume.value + " " + beerId[0].boil_volume.unit },
        { desc: "Ingredients", val: "MALTS: " + malt_add + " YEAST: " + beerId[0].ingredients.yeast },
        { desc: "Hops", val: hops_add },
        //{ desc: "Method", val: "FERMENTATION: " + ferm_add + " MASH TEMP: " + mash_add },
        { desc: "Food pairing", val: foods_add },
        { desc: "Brewers tips", val: beerId[0].brewers_tips }
    ];

    for (let i = 0; i < infoData.length; i++) {
        let optElement = createNewElement("li", infoElement, { class: 'showBeerOptions' }, infoData[i].desc + ": ");
        let hElement = createNewElement("span", optElement, { class: 'beerInfo' }, infoData[i].val);
    }
}

//Ta ut data från underkategorier i specifik produkt:
let extractData = (to_get, to_add, classt) => {
    let myString;
    to_get.forEach(element => {
        if (classt == true) {
            myString = " " + element.name + " (" + element.amount.value + " " + element.amount.unit + ")";
        } else { myString = " " + element; }
        to_add.push(myString);
    });
}

//GENERELLA FUNKTIONER:

//skapar element för att spara kod åt oss:
let createNewElement = (type, parentElement, attributes, txtcont) => {
    const createdElement = document.createElement(type);
    parentElement.appendChild(createdElement);
    if (txtcont.length > 0) { createdElement.textContent = txtcont; }
    for (key in attributes) {
        createdElement.setAttribute(key, attributes[key]);
    }
    return createdElement;
}

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

//Anropar funktioner baserat på sidnummer:
let nysida = (param) => {
        removeAllChildNodes(eMain);
        close();
        switch (param) {
            case 0:
                initRandom();
                break;
            case 1:
                initSearch();
                break;
        }
    }
    //GENERELLA FUNKTIONER END:

nysida(0);
fetcher(url, createRandomBeer);