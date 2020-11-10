const mainElement = document.querySelector("main");


function initSearch() {

    const contElement = document.createElement("article");
    mainElement.appendChild(contElement);
    contElement.className="formcontainer";

    const formElement = document.createElement("form");
    contElement.appendChild(formElement);

    const lElement = document.createElement("label");
    formElement.appendChild(lElement);
    lElement.htmlFor="beerSearch";

    const iElement = document.createElement("input");
    formElement.appendChild(iElement);
    iElement.type="text";
    iElement.placeholder="Search for beer...🍺";
    iElement.name="beerSearch";

    const sElement = document.createElement("button");
    formElement.appendChild(sElement);
    sElement.type="button";
    sElement.id="searchButton";
    sElement.textContent="Search";

    const sectElement = document.createElement("section");
    contElement.appendChild(sectElement);
    sectElement.className="searchList";

    let button = [];
    for (let i=0;i<2;i++) {
    button[i] = document.createElement("button");
    contElement.appendChild(button[i]);
    button[i].type="button";
    button[i].className="display-none";
    button[i].name="button";

    button[i].id="prev";
    button[i].textContent="Prev";
        if (i == 1) {
            button[i].id="next";
            button[i].textContent="Next";
        }
    }

    //const buttonNext = document.querySelector('#next');
    //const buttonPrev = document.querySelector('#prev');

    sElement.addEventListener('click', function() {onSubmit(iElement.value)});

    button[1].addEventListener('click', function() {getNewPage(true);});
    button[0].addEventListener('click', function() {getNewPage(false);});

}


//initSearch();



const API = 'https://api.punkapi.com/v2/beers';
let page = 1;
let searchStr;
let lastPage = false;
let pageSize = 10;


//creating an event 
function onSubmit(e) {
    
    searchStr = e; //.target[0].value

    const url = `${API}?beer_name=${searchStr}&per_page=${pageSize}&page=${page}`;

    fetcher(url, renderFirstBeer);

    //e.preventDefault();
}






//buttonNext.addEventListener('click', getNext);
//buttonPrev.addEventListener('click', getPrev);



function getNewPage(e) {
    if (e) {
        page++;
        if (page > 1) {document.getElementById("prev").disabled = false;}
    }
    else {
        if (page > 1) {page--;} else {document.getElementById("prev").disabled = true;}
    }

    const url = `${API}?beer_name=${searchStr}&per_page=${pageSize}&page=${page}`;

    fetcher(url, renderFirstBeer);

    //e.preventDefault();
}



function renderFirstBeer(data) {

    let sElement = document.querySelector(".searchList");
    //mainElement.appendChild(sElement);
    //sElement.innerHTML = '';
    removeAllChildNodes(sElement);
    

    for (let i = 0; i < data.length; i++) {
        const ppElement = document.createElement('p');
        sElement.appendChild(ppElement);

        const pElement = document.createElement('p');
        pElement.setAttribute('name', value=data[i].id);
        pElement.className="searchItem";
        ppElement.appendChild(pElement);

        pElement.textContent = data[i].name;


        pElement.addEventListener('click', () => {
            //nysida(1);
            //alert(data[i].id);
            nysida(3);
            showProduct(data[i].id);
        });
    }

    if(data.length == pageSize)
    {
        lastPage = false;
        document.getElementById("next").disabled = false;
    }
    else
    {   
        lastPage = true;
        document.getElementById("next").disabled = true;
    }
    //button[1].classList.remove('display-none');
    //button[0].classList.remove('display-none');
}




/*

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

//ta fram alla element i beer info page



*/