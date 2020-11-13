const mainElement = document.querySelector("main");

let globalURL;
let PageStr;
let page = 1;

const API = 'https://api.punkapi.com/v2/beers?';
let searchStr;
let lastPage = false;
let pageSize = 10;

let alco_min = 3;
let alco_max = 68;

let today = new Date();
let startyear = 2005;


//göm/visa prev+next-knappar:
let showHide = (mode, cls, no) => {
	const myElement = document.querySelectorAll(cls);
	myElement[no].style.opacity = mode;
}


//skapar prev+next knappar:
let createButtons = (contElement) => {

	let pgbutton = [];
	for (let i = 0; i < 2; i++) {
		pgbutton[i] = createNewElement("button", contElement, {
			type: 'button',
			class: 'prevNextButtons',
			name: "button"
		}, "");
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

	//typ av element, parent element, attribut (klasser, id, etc.), textContent:

	const contElement = createNewElement("article", mainElement, {
		class: 'formcontainer'
	}, "");

	const formElement = createNewElement("form", contElement, {}, "");

	const errElement = createNewElement("span", formElement, {
		class: 'errorfield'
	}, "");
	errElement.style.opacity = 0;

	const iElement = createNewElement("input", formElement, {
		type: 'text',
		placeholder: 'Search for beer...🍺',
		name: 'beerSearch',
		maxLength: 50
	}, "");

	const hopsElement = createNewElement("input", formElement, {
		type: 'text',
		placeholder: 'Search for hop...',
		name: 'hopSearch',
		maxLength: 40
	}, "");

	const maltElement = createNewElement("input", formElement, {
		type: 'text',
		placeholder: 'Search for malt...',
		name: 'maltSearch',
		maxLength: 40
	}, "");

	//element för alkoholhalt:
	const alkWrapper = createNewElement("span", formElement, {
		class: 'alcoholfield'
	}, "%");

	let abvElement = [];
	for (let i = 0; i < 2; i++) {
		abvElement[i] = createNewElement("input", alkWrapper, {
			type: 'number',
			placeholder: 'Greater than...',
			name: 'abv_gtSearch',
			maxLength: 3,
			step: 0.1,
			max: alco_max,
			min: alco_min
		}, "");
		if (i == 1) {
			abvElement[i].name = "abv_ltSearch";
			abvElement[i].placeholder = "Lesser than...";
		}
	}


	//element för datum år:
	const dateWrapper = createNewElement("span", formElement, {
		class: 'alcoholfield'
	}, "From");


	let yearElement = [];
	let monthElement = [];
	for (let i = 0; i < 2; i++) {

		if (i == 1) {
			const dateBefore = createNewElement("span", dateWrapper, {}, "To");
		}
		yearElement[i] = createNewElement("select", dateWrapper, {
			name: 'year' + i,
			id: 'year' + i
		}, "");
		monthElement[i] = createNewElement("select", dateWrapper, {
			name: 'month' + i,
			id: 'month' + i
		}, "");

		for (let j = startyear - 1; j <= today.getFullYear(); j++) {
			let optElement = document.createElement("option");
			if (j > startyear - 1) {
				optElement.value = j;
				optElement.textContent = j;
			}
			yearElement[i].appendChild(optElement);
		}

		for (let j = 0; j <= 12; j++) {
			let optElement = document.createElement("option");
			if (j > 0) {
				optElement.value = j;
				optElement.textContent = j;
			}
			monthElement[i].appendChild(optElement);
		}
	}


	const sElement = createNewElement("button", formElement, {
		type: 'button',
		id: 'searchButton'
	}, "Search");

	const sectElement = createNewElement("section", contElement, {
		class: 'searchList'
	}, "");

	pgbutton = createButtons(contElement);


	//block/none, class
	showHide("0.1", ".prevNextButtons", 0);
	showHide("0.1", ".prevNextButtons", 1);

	//const buttonNext = document.querySelector('#next');
	//const buttonPrev = document.querySelector('#prev');

	sElement.addEventListener('click', function () {
		onSubmit(iElement, errElement, hopsElement, maltElement, abvElement[0], abvElement[1], yearElement[0], yearElement[1], monthElement[0], monthElement[1])
	});

	pgbutton[1].addEventListener('click', function () {
		getNewPage(true);
	});
	pgbutton[0].addEventListener('click', function () {
		getNewPage(false);
	});

	//laddar in sparade sökresultat
	page = search_pages_saved;
	if (firstSearch) {
		firstSearch = false;
	} else {
		renderFirstBeer(searchBeer_saved[page]);
	}

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
	pageStr = "per_page=" + pageSize + "&page=" + page;
	if (e.value.length > 0) {
		newStr = check_underscore(e.value);
		url += "&beer_name=" + newStr;
	}
	if (hfield.value.length > 0) {
		newStr = check_underscore(hfield.value);
		url += "&hops=" + newStr;
	}
	if (mfield.value.length > 0) {
		newStr = check_underscore(mfield.value);
		url += "&malt=" + newStr;
	}
	if (abv_gt.value.length > 0) {
		url += "&abv_gt=" + abv_gt.value;
	}
	if (abv_lt.value.length > 0) {
		url += "&abv_lt=" + abv_lt.value;
	}

	if ((year_one.value.length > 0) && (month_one.value.length > 0)) {
		url += "&brewed_after=" + month_one.value + "-" + year_one.value;
	}
	if ((year_two.value.length > 0) && (month_two.value.length > 0)) {
		url += "&brewed_before=" + month_two.value + "-" + year_two.value;
	}


	globalURL = url;
	//alert(API+pageStr+globalURL);

	//const url = `${API}?beer_name=${e.value}&per_page=${pageSize}&page=${page}`;
	//const url = `${API}?per_page=${pageSize}&page=${page}&beer_name=${e.value}`;

	validateForm(API + pageStr + url, e, efield, hfield, mfield, abv_gt, abv_lt, year_one, year_two, month_one, month_two);

	//e.preventDefault();
}


//funktion för att gå till nästa eller föregående sida:
let getNewPage = (e) => {
	if (e) {
		page++;
		if (page > 1) {
			document.getElementById("prev").disabled = false;
		}
	} else {
		if (page > 1) {
			page--;
		} else {
			document.getElementById("prev").disabled = true;
		}
	}


	//const url = `${API}beer_name=${searchStr}&per_page=${pageSize}&page=${page}`;
	pageStr = "per_page=" + pageSize + "&page=" + page;

	//console.log(searchBeer_saved[page-1]);
	if (e) {
		if (page <= search_pages_saved) {
			renderFirstBeer(searchBeer_saved[page]);
		} else {
			search_pages_saved = page;
			fetcher(API + pageStr + globalURL, renderFirstBeer);
		}
	} else {
		renderFirstBeer(searchBeer_saved[page]);
	}

	//e.preventDefault();
}


let renderFirstBeer = (data) => {
	//console.log(data);
	searchBeer_saved[page] = data;
	//console.log(searchBeer_saved);

	//console.log(data[0].name);
	//console.log(searchBeer_saved[0].name);

	let sElement = document.querySelector(".searchList");
	//mainElement.appendChild(sElement);
	removeAllChildNodes(sElement);

	//block/none, class
	if (page > 1) {
		showHide("1", ".prevNextButtons", 0);
	} else {
		showHide("0.1", ".prevNextButtons", 0);
	}
	showHide("1", ".prevNextButtons", 1);

	for (let i = 0; i < data.length; i++) {


		const ppElement = createNewElement("p", sElement, {}, "");

		const pElement = createNewElement("p", ppElement, {
			class: 'searchItem',
			name: data[i].id
		}, data[i].name);

		pElement.addEventListener('click', () => {
			search_pages_saved = page;
			nysida(3);
			searchVal = i;
			page_saved = 1;
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


let allLetter = (inputtxt) => {
	let letters = /^[A-Za-z]+$/;
	if (inputtxt.value.match(letters)) {
		return true;
	} else {
		return false;
	}
}


let emptyFields = (param) => {
	if (param <= 0) {
		return true;
	}
	return false;
}


let compareDates = (year_one, month_one, year_two, month_two) => {
	let g1 = new Date(year_one.value, month_one.value);
	let g2 = new Date(year_two.value, month_two.value);
	if (g1.getTime() < g2.getTime()) {
		return true;
	} else {
		return false;
	}
	//if (g1.getTime() < g2.getTime()) {alert("g1 is lesser than g2");}
	//else if (g1.getTime() > g2.getTime()) {alert("g1 is greater than g2");} //err
	//else {if (datelengths > 0) {alert("both are equal");}} //err
}


//validerar formulärets input innan den skickar vidare:
let validateForm = (url, e, efield, hfield, mfield, abv_gt, abv_lt, year_one, year_two, month_one, month_two) => {

	efield.style.opacity = 0;

	removeAllChildNodes(efield);
	const eWarnList = createNewElement("ul", efield, {}, "");


	//LÄGG TILL CHECK FÖR IFALL SAMTLIGA FÄLT ÄR BLANKA!
	let datelengths = year_one.value.length + year_two.value.length + month_one.value.length + month_two.value.length;
	if (emptyFields(e.value.length + hfield.value.length + mfield.value.length + abv_lt.value.length + abv_gt.value.length + datelengths)) {
		createNewElement("li", eWarnList, {}, "Minst ett av fälten måste fyllas i.");
	}


	if (!allLetter(hfield) && hfield.value.length > 0) {
		createNewElement("li", eWarnList, {}, "Hop: Endast bokstäver.");
	}
	if (!allLetter(mfield) && mfield.value.length > 0) {
		createNewElement("li", eWarnList, {}, "Malt: Endast bokstäver.");
	}


	if (!compareDates(year_one, month_one, year_two, month_two)) {
		if (datelengths > 0) {
			createNewElement("li", eWarnList, {}, "vänster datum måste vara lägre än höger.");
		}
	}


	//Effektivisera koden nedan med externa funktioner, om vi hinner!


	let abv_check = [abv_gt, abv_lt];
	let wrong_in = [false, false];
	for (let i = 0; i < abv_check.length; i++) {
		abv_check[i].className = "none";
		if (abv_check[i].value.length > 0) {
			if (abv_check[i].value < alco_min || abv_check[i].value > alco_max) {
				wrong_in[0] = true;
				abv_check[i].className = "formError";
			}
		}
		if (abv_check[0].value == abv_check[1].value && abv_check[0].value.length > 0) {
			wrong_in[1] = true;
			abv_check[i].className = "formError";
		}
	}


	if (wrong_in[0]) {
		createNewElement("li", eWarnList, {}, "% måste vara " + alco_min + "-" + alco_max + ".");
	}
	if (wrong_in[1]) {
		createNewElement("li", eWarnList, {}, "% får inte vara samma.");
	}
	if (parseFloat(abv_gt.value) > parseFloat(abv_lt.value)) {
		createNewElement("li", eWarnList, {}, "gt får inte vara större än lt.");
		abv_check[0].className = "formError";
		abv_check[1].className = "formError";
	}

	let warnings = eWarnList.querySelectorAll("li");
	if (warnings.length > 0) {
		efield.style.opacity = 1;
	} else {
		searchBeer_saved = [];
		search_pages_saved = 0;
		fetcher(url, renderFirstBeer);
	}

}