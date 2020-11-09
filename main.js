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
    sectElement.id="indexSearchSection";
    eMain.appendChild(sectElement);

    const divElement = document.createElement("div");
    divElement.className="showbeer";
    sectElement.appendChild(divElement);

    const buttonElement = document.createElement("button");
    buttonElement.textContent="Klick";
    buttonElement.type="button";
    buttonElement.id="button";
    buttonElement.name="button";
    sectElement.appendChild(buttonElement);

    button.addEventListener('click', () => {
    fetcher(url, createRandomBeer);
    });
    
}




let displayRandomBeer = (beerName, beerImage, beerId) => {

    const divElement = document.querySelector(".showbeer");

    removeAllChildNodes(divElement);

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
    imgElement.src = beerId[0].image_url;
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
    let infoData = [
        { desc: "Alcohol by volume", val: beerId[0].abv },
        { desc: "Volume", val: beerId[0].volume.value + " " + beerId[0].volume.unit },
        { desc: "Ingredients", val: "tttt" },
        { desc: "Hops", val: "N/A" },
        { desc: "Food pairing", val: "N/A" },
        { desc: "Brewers tips", val: "N/A" }
    ];

    for (let i = 0; i < infoData.length; i++) {
        let optElement = document.createElement("li");
        optElement.className = "showoption";
        optElement.textContent = infoData[i].desc + ": " + infoData[i].val;
        infoElement.appendChild(optElement);
    }

    cardContainer.appendChild(infoElement);
    card.appendChild(cardContainer);
    main.appendChild(card)


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

