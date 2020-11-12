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

let today = new Date();
let startyear=1989;


//göm/visa prev+next-knappar:
let showHide = (mode, cls, no) => {
    const myElement = document.querySelectorAll(cls);
        myElement[no].style.opacity=mode;
}


//skapar prev+next knappar:
let createButtons = (contElement) => {

    let pgbutton = [];
    for (let i=0;i<2;i++) {
        pgbutton[i] = document.createElement("button");
        contElement.appendChild(pgbutton[i]);
        pgbutton[i].type = "button";
        pgbutton[i].className = "prevNextButtons";
        pgbutton[i].name = "button";

        pgbutton[i].id = "prev";
        pgbutton[i].textContent = "Prev";
        if (i == 1) {
            pgbutton[i].id = "next";
            pgbutton[i].textContent = "Next";
        }
    }

    return pgbutton;

}



//skapar elementen för söksidan:
let initSearch = () => {

    const contElement = document.createElement("article");
    mainElement.appendChild(contElement);
    contElement.className = "formcontainer";

    const formElement = document.createElement("form");
    contElement.appendChild(formElement);

    const errElement=document.createElement("span");
    formElement.appendChild(errElement);
    errElement.className="errorfield";
    errElement.style.opacity=0;

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

    let abvElement = [];
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


    //element för datum år:

    const dateWrapper=document.createElement("span");
    formElement.appendChild(dateWrapper);
    dateWrapper.className="alcoholfield";
    dateWrapper.textContent="Date:";

    let yearElement = [];
    let monthElement = [];
    for (let i=0;i<2;i++) {
    yearElement[i] = document.createElement("select");
    monthElement[i] = document.createElement("select");
    dateWrapper.appendChild(yearElement[i]);
    dateWrapper.appendChild(monthElement[i]);
    yearElement[i].name = "year"+i;
    yearElement[i].id = "year"+i;
    monthElement[i].name = "year"+i;
    monthElement[i].id = "year"+i;
        for (let j=startyear-1;j<=today.getFullYear();j++) {
            let optElement = document.createElement("option");
            if (j > startyear-1) {
            optElement.value=j;
            optElement.textContent=j;
            }
            yearElement[i].appendChild(optElement);
        }
        for (let j=0;j<=12;j++) {
            let optElement = document.createElement("option");
            if (j > 0) {
            optElement.value=j;
            optElement.textContent=j;
            }
            monthElement[i].appendChild(optElement);
        }
    }
    



    const sElement=document.createElement("button");
    formElement.appendChild(sElement);
    sElement.type="button";
    sElement.id="searchButton";
    sElement.textContent="Search";

    const sectElement=document.createElement("section");
    contElement.appendChild(sectElement);
    sectElement.className="searchList";

    pgbutton=createButtons(contElement);


    //block/none, class
    showHide("0.1", ".prevNextButtons", 0);
    showHide("0.1", ".prevNextButtons", 1);

    //const buttonNext = document.querySelector('#next');
    //const buttonPrev = document.querySelector('#prev');

    sElement.addEventListener('click', function() {
        onSubmit(iElement, errElement, hopsElement, maltElement, abvElement[0], abvElement[1], yearElement[0], yearElement[1], monthElement[0], monthElement[1])
    });

    pgbutton[1].addEventListener('click', function() { getNewPage(true); });
    pgbutton[0].addEventListener('click', function() { getNewPage(false); });

}



//ersätter mellanslag med understreck i sökningar:
let check_underscore = (str) => {
    let newStr = str.replace(/\s+/g, '_');
    return newStr;
}

//form submit:
let onSubmit = (e, efield, hfield, mfield, abv_gt, abv_lt, year_one, year_two, month_one, month_two) => {

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
        if (page > 1) {showHide("1", ".prevNextButtons", 0);}
        else {showHide("0.1", ".prevNextButtons", 0);}
        showHide("1", ".prevNextButtons", 1);

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

    let mess="";
    efield.style.opacity=0;

    //LÄGG TILL CHECK FÖR IFALL SAMTLIGA FÄLT ÄR BLANKA!


    let g1 = new Date(2020, 07);
    let g2 = new Date(2020, 08);
    if (g1.getTime() < g2.getTime()) {alert("g1 is lesser than g2");}
    else if (g1.getTime() > g2.getTime()) {alert("g1 is greater than g2");}
    else {alert("both are equal");}




    //Effektivisera koden nedan med externa funktioner!

    let abv_check = [abv_gt, abv_lt];
    for (let i=0;i<abv_check.length;i++) {
        abv_check[i].className="none";
        if (abv_check[i].value.length > 0) {
            if ((abv_check[i].value < alco_min) || (abv_check[i].value > alco_max)) {
                mess+=`Input måste vara ${alco_min} - ${alco_max}.`;
                abv_check[i].className="formError";
            }
        }
        if ((abv_check[0].value == abv_check[1].value) && (abv_check[0].value.length > 0)) {
            mess+="Input får inte vara samma.\r";
            abv_check[i].className="formError";
        }

    }

    if (abv_gt.value > abv_lt.value) {
        mess+="gt får inte vara större än lt.\r";
        abv_check[0].className="formError";
        abv_check[1].className="formError";
    }

    //if (e.value.length <= 0) {passed=false;mess+="Sökrutan får inte vara tom! \r test";e.className="formError";}

    if (mess.length > 0) {efield.style.opacity=1;}
    else {fetcher(url, renderFirstBeer);}
    efield.textContent = mess;

}