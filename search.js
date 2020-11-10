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

    fetchData(url, renderFirstBeer);

    e.preventDefault();
}



//fetching data from API
function fetchData(url, callback) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            callback(data);

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

        }).catch(error => console.log(error));

}


const formElement = document.querySelector('form');
const mainElement = document.querySelector('main');


formElement.addEventListener('submit', onSubmit);


buttonNext.addEventListener('click', getNext);
buttonPrev.addEventListener('click', getPrev);




function getNext(e) {

    console.log("Next page");

    page++;

    if(page > 1)
    {
        document.getElementById("prev").disabled = false;
    }

    const url = `${API}?beer_name=${searchStr}&per_page=${pageSize}&page=${page}`;

    fetchData(url, renderFirstBeer);

    e.preventDefault();
}


function getPrev(e) {

    if(page == 1)
    {

        document.getElementById("prev").disabled = true;
    }
    else
    {
        console.log("Go to prev page");

        page--;

        const url = `${API}?beer_name=${searchStr}&per_page=${pageSize}&page=${page}`;

        fetchData(url, renderFirstBeer);

        e.preventDefault();  

        console.log(url);
    }

}


function render(data) {
    const ulElement = document.createElement('ul');

    console.log("result count", data.length);

    for (let i = 0; i < data.length; i++) {

        const beer = data[i];

        const liElement = document.createElement('li');
        liElement.textContent = beer.name;
        ulElement.appendChild(liElement);
    }
    mainElement.appendChild(ulElement);
   
}


function renderFirstBeer(data) {
    mainElement.innerHTML = '';

    for (let i = 0; i < data.length; i++) {
        const pElement = document.createElement('p');

        pElement.textContent = data[i].name;

        mainElement.appendChild(pElement);
    }
 buttonNext.classList.remove('display-none');
 buttonPrev.classList.remove('display-none');
}
