const mainElement = document.querySelector("main");

let globalURL;
let PageStr;
let page = 1;

//test

function initSearch() {

    const contElement = document.createElement("article");
    mainElement.appendChild(contElement);
    contElement.className = "formcontainer";

    const formElement = document.createElement("form");
    contElement.appendChild(formElement);

    const lElement = document.createElement("label");
    formElement.appendChild(lElement);
    lElement.htmlFor = "beerSearch";

    const iElement = document.createElement("input");
    formElement.appendChild(iElement);
    iElement.type = "text";
    iElement.placeholder = "Search for beer...🍺";
    iElement.name = "beerSearch";
    iElement.setAttribute('maxLength', 50);

    const hopsElement = document.createElement("input");
    formElement.appendChild(hopsElement);
    hopsElement.type = "text";
    hopsElement.placeholder = "Search for hop...";
    hopsElement.name = "hopSearch";
    hopsElement.setAttribute('maxLength', 40);

    const sElement = document.createElement("button");
    formElement.appendChild(sElement);
    sElement.type = "button";
    sElement.id = "searchButton";
    sElement.textContent = "Search";

    const errElement = document.createElement("span");
    formElement.appendChild(errElement);
    errElement.className = "errorfield";

    const sectElement = document.createElement("section");
    contElement.appendChild(sectElement);
    sectElement.className = "searchList";

    let button = [];
    for (let i = 0; i < 2; i++) {
        button[i] = document.createElement("button");
        contElement.appendChild(button[i]);
        button[i].type = "button";
        button[i].className = "display-none";
        button[i].name = "button";

        button[i].id = "prev";
        button[i].textContent = "Prev";
        if (i == 1) {
            button[i].id = "next";
            button[i].textContent = "Next";
        }
    }

    //const buttonNext = document.querySelector('#next');
    //const buttonPrev = document.querySelector('#prev');

    sElement.addEventListener('click', function() { onSubmit(iElement, errElement, hopsElement) });

    button[1].addEventListener('click', function() { getNewPage(true); });
    button[0].addEventListener('click', function() { getNewPage(false); });

}


//initSearch();



const API = 'https://api.punkapi.com/v2/beers?';
let searchStr;
let lastPage = false;
let pageSize = 10;


//creating an event 
function onSubmit(e, efield, hfield) {

    searchStr = e.value; //.target[0].value
    page = 1;

    let url = "";
    pageStr="per_page=" + pageSize + "&page="+page;
    if (e.value.length > 0) { url += "&beer_name=" + e.value; }
    if (hfield.value.length > 0) { url += "&hops=" + hfield.value; }

    globalURL=url;
    alert(API+pageStr+globalURL);

    //const url = `${API}?beer_name=${e.value}&per_page=${pageSize}&page=${page}`;
    //const url = `${API}?per_page=${pageSize}&page=${page}&beer_name=${e.value}`;

    validateForm(API+pageStr+url, e, efield, hfield);

    //e.preventDefault();
}






//buttonNext.addEventListener('click', getNext);
//buttonPrev.addEventListener('click', getPrev);



function getNewPage(e) {
    if (e) {
        page++;
        if (page > 1) { document.getElementById("prev").disabled = false; }
    } else {
        if (page > 1) { page--; } else { document.getElementById("prev").disabled = true; }
    }

    //const url = `${API}beer_name=${searchStr}&per_page=${pageSize}&page=${page}`;
    pageStr="per_page=" + pageSize + "&page="+page;

    fetcher(API+pageStr+globalURL, renderFirstBeer);

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
        pElement.setAttribute('name', value = data[i].id);
        pElement.className = "searchItem";
        ppElement.appendChild(pElement);

        pElement.textContent = data[i].name;


        pElement.addEventListener('click', () => {
            //nysida(1);
            //alert(data[i].id);
            nysida(3);
            showProduct(data[i].id);
        });
    }

    if (data.length == pageSize) {
        lastPage = false;
        document.getElementById("next").disabled = false;
    } else {
        lastPage = true;
        document.getElementById("next").disabled = true;
    }
    //button[1].classList.remove('display-none');
    //button[0].classList.remove('display-none');
}






function validateForm(url, e, efield) {
    //lägg till check för special characters
    let passed = true;
    let mess = "";

    //if (e.value.length <= 0) {passed=false;mess+="Sökrutan får inte vara tom! \r test";e.className="formError";}

    if (passed) { fetcher(url, renderFirstBeer); } else {
        efield.textContent = mess;
    }

}