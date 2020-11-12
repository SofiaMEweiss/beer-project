const mainElement = document.querySelector("main");

let globalURL;
let PageStr;
let page=1;

const API = 'https://api.punkapi.com/v2/beers?';
let searchStr;
let lastPage = false;
let pageSize = 10;

let alco_min=3;
let alco_max=68;


//göm/visa prev+next-knappar:
let showHide = (mode, cls, no) => {
    const myElement = document.querySelectorAll(cls);
        myElement[no].style.opacity=mode;
}


//skapar prev+next knappar:
let createButtons = (contElement) => {

    let button = [];
    for (let i=0;i<2;i++) {
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

    return button;

}


//skapar elementen för söksidan:
let initSearch = () => {

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

    const maltElement = document.createElement("input");
    formElement.appendChild(maltElement);
    maltElement.type = "text";
    maltElement.placeholder = "Search for malt...";
    maltElement.name = "maltSearch";
    maltElement.setAttribute('maxLength', 40);

    //element för alkoholhalt:

    const alkWrapper=document.createElement("span");
    formElement.appendChild(alkWrapper);
    alkWrapper.className="alcoholfield";
    alkWrapper.textContent="%:";

    const abvElement = [];
    for (let i=0;i<2;i++) {
    abvElement[i] = document.createElement("input");
    alkWrapper.appendChild(abvElement[i]);
    abvElement[i].type = "number";
    abvElement[i].placeholder = "greater than...";
    abvElement[i].name = "abv_gtSearch";
    if (i == 1) {abvElement[i].name = "abv_ltSearch";abvElement[i].placeholder = "lesser than...";}
    abvElement[i].setAttribute('maxLength', 3);
    abvElement[i].setAttribute('step', 0.1);
    abvElement[i].setAttribute('max', alco_max);
    abvElement[i].setAttribute('min', alco_min);
    //abvElement.setAttribute('size', 8);
    }


    //slut element för alkohalt

    const sElement=document.createElement("button");
    formElement.appendChild(sElement);
    sElement.type="button";
    sElement.id="searchButton";
    sElement.textContent="Search";

    const errElement=document.createElement("span");
    formElement.appendChild(errElement);
    errElement.className="errorfield";
    errElement.style.opacity=0;

    const sectElement=document.createElement("section");
    contElement.appendChild(sectElement);
    sectElement.className="searchList";

    button=createButtons(contElement);


    //block/none, class
    showHide("0.1", ".display-none", 0);
    showHide("0.1", ".display-none", 1);

    //const buttonNext = document.querySelector('#next');
    //const buttonPrev = document.querySelector('#prev');

    sElement.addEventListener('click', function() { onSubmit(iElement, errElement, hopsElement, maltElement, abvElement[0], abvElement[1]) });

    button[1].addEventListener('click', function() { getNewPage(true); });
    button[0].addEventListener('click', function() { getNewPage(false); });

}



//ersätter mellanslag med understreck i sökningar:
let check_underscore = (str) => {
    let newStr = str.replace(/\s+/g, '_');
    return newStr;
}

//form submit:
let onSubmit = (e, efield, hfield, mfield, abv_gt, abv_lt) => {

    searchStr = e.value; //.target[0].value
    page = 1;

    let newStr;
    let url = "";
    pageStr="per_page=" + pageSize + "&page="+page;
    if (e.value.length > 0) { newStr=check_underscore(e.value);url += "&beer_name=" + newStr; }
    if (hfield.value.length > 0) { newStr=check_underscore(hfield.value);url += "&hops=" + newStr; }
    if (mfield.value.length > 0) { newStr=check_underscore(mfield.value);url += "&malt=" + newStr; }
    if (abv_gt.value.length > 0) { url += "&abv_gt=" + abv_gt.value; }
    if (abv_lt.value.length > 0) { url += "&abv_lt=" + abv_lt.value; }


    globalURL=url;
    alert(API+pageStr+globalURL);

    //const url = `${API}?beer_name=${e.value}&per_page=${pageSize}&page=${page}`;
    //const url = `${API}?per_page=${pageSize}&page=${page}&beer_name=${e.value}`;

    validateForm(API+pageStr+url, e, efield, hfield, mfield, abv_gt, abv_lt);

    //e.preventDefault();
}




//funktion för att gå till nästa eller föregående sida:
let getNewPage = (e) => {
    if (e) {
        page++;
        if (page > 1) {document.getElementById("prev").disabled = false;}
    } else {
        if (page > 1) {page--;} else {document.getElementById("prev").disabled = true;}
    }


    //const url = `${API}beer_name=${searchStr}&per_page=${pageSize}&page=${page}`;
    pageStr="per_page=" + pageSize + "&page="+page;

    fetcher(API+pageStr+globalURL, renderFirstBeer);

    //e.preventDefault();
}



let renderFirstBeer = (data) => {

    let sElement = document.querySelector(".searchList");
    //mainElement.appendChild(sElement);
    //sElement.innerHTML = '';
    removeAllChildNodes(sElement);

        //block/none, class
        if (page > 1) {showHide("1", ".display-none", 0);}
        else {showHide("0.1", ".display-none", 0);}
        showHide("1", ".display-none", 1);

    for (let i=0;i<data.length;i++) {
        const ppElement = document.createElement("p");
        sElement.appendChild(ppElement);

        const pElement = document.createElement("p");
        pElement.setAttribute("name", value = data[i].id);
        pElement.className = "searchItem";
        ppElement.appendChild(pElement);

        pElement.textContent = data[i].name;

        pElement.addEventListener('click', () => {
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





//validerar formulärets input innan den skickar vidare:
let validateForm = (url, e, efield, hfield, mfield, abv_gt, abv_lt) => {
    //lägg till check för special characters
    let passed = true;

    let mess="";
    efield.style.opacity=0;

    //Effektivisera koden nedan med externa funktioner!

    let abv_check = [abv_gt, abv_lt];
    for (let i=0;i<abv_check.length;i++) {
        abv_check[i].className="none";
        if (abv_check[i].value.length > 0) {
            if ((abv_check[i].value < alco_min) || (abv_check[i].value > alco_max)) {
                passed=false;
                mess+=`Input måste vara ${alco_min} - ${alco_max} `;
                abv_check[i].className="formError";
            }
        }
        if ((abv_check[0].value == abv_check[1].value) && (abv_check[0].value.length > 0)) {
            passed=false;
            mess+="Input får inte vara samma.\r";
            abv_check[i].className="formError";
        }

    }

    if (abv_gt.value > abv_lt.value) {
        //alert(abv_gt.value+" is bigger than "+abv_lt.value);
        passed=false;
        mess+="gt får inte vara större än lt.\r";
        abv_check[0].className="formError";
        abv_check[1].className="formError";
    }

    //if (e.value.length <= 0) {passed=false;mess+="Sökrutan får inte vara tom! \r test";e.className="formError";}

    if (passed) {fetcher(url, renderFirstBeer);}
    if (mess.length > 0) {efield.style.opacity=1;}
    efield.textContent = mess;

}