const API = 'https://api.punkapi.com/v2/beers';
let page = 1;
let searchStr;
let lastPage = false;
let pageSize = 10;
const buttonNext = document.querySelector('#next');
const buttonPrev = document.querySelector('#prev');

//creating an event 
function onSubmit(e) {
    
    searchStr = e.target[0].value;

    const url = `${API}?beer_name=${searchStr}&per_page=${pageSize}&page=${page}`;

    fetcher(url, renderFirstBeer);

    e.preventDefault();
}


const formElement = document.querySelector('form');
const mainElement = document.querySelector('main');

formElement.addEventListener('submit', onSubmit);

//buttonNext.addEventListener('click', getNext);
//buttonPrev.addEventListener('click', getPrev);

buttonNext.addEventListener('click', function() {getNewPage(true);});
buttonPrev.addEventListener('click', function() {getNewPage(false);});

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
    sElement.innerHTML = '';
    

    for (let i = 0; i < data.length; i++) {
        const pElement = document.createElement('p');
      pElement.setAttribute('name', value= data[i].id)

        pElement.textContent = data[i].name;

        sElement.appendChild(pElement);

        pElement.addEventListener('click', () => {
            window.location.href = `info.html?name=${data[i].id}` 
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
 buttonNext.classList.remove('display-none');
 buttonPrev.classList.remove('display-none');
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

//ta fram alla element i beer info page
