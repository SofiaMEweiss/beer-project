

let listDetails = () => {

    let divElement = document.querySelector(".details");
    let olElement = document.createElement("ul");
    divElement.appendChild(olElement);

    for (let i=0;i<8;i++) {
        let liElement = document.createElement("li");
        olElement.appendChild(liElement);
        liElement.textContent="option: ";
    }

}


listDetails();