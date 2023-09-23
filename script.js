let shortLinkBtn = document.querySelector("#short-link-btn");
let userlink = document.querySelector("#shortlink");
const workingSection = document.querySelector(".working-section");

let error = document.querySelector(".error");
let showShortLink = document.querySelector(".generated-link-section");
let originallink = document.querySelector("#original-link");
let genreratedLink = document.querySelector("#generated-link");
let menuBar = document.querySelector("#menu-bar");


let storedLinks;

let fetchShortLink = (url) => {
    url = "https://api.shrtco.de/v2/shorten?url=" + url;

    return fetch(url).then((response) => {


        return response.json();
    });
}

let shortOriginalLink = () => {


    if (userlink.value === "") {

        error.style.display = "block"
        error.textContent = "Please add a link";

        setTimeout(() => {
            error.style.display = "none"
            error.textContent = "";
        }, 3000)

        return;
    }

    let res = fetchShortLink(userlink.value)
    res.then((res) => {



        let shortenLink;
        shortenLink = res.result.full_short_link;


        let template = document.querySelector(".template");
        const clonedLinkSection = template.cloneNode(true);
        clonedLinkSection.classList.remove("template")

        let originalLinkElement = clonedLinkSection.querySelector("#original-link");
        let generatedLinkElement = clonedLinkSection.querySelector("#generated-link");


        originalLinkElement.href = userlink.value;
        originalLinkElement.textContent = userlink.value;

        generatedLinkElement.href = shortenLink;
        generatedLinkElement.textContent = shortenLink;
        clonedLinkSection.style.display = "flex";

        workingSection.appendChild(clonedLinkSection);

    })
        .catch(() => {

            error.style.display = "block"
            error.textContent = "Something went wrong";



            setTimeout(() => {
                error.style.display = "none"
                error.textContent = "";
            }, 3000)
        });

}


let copyLink = async (e) => {

    try {
        e.stopPropagation();


        let buttonclicked = e.target;
        let parentNode = buttonclicked.parentElement.parentElement;
        if (buttonclicked.id === "copy-link") {
            buttonclicked.style.backgroundColor = "black";
            buttonclicked.textContent = "Copied!"

        }

        setTimeout(() => {
            buttonclicked.style.backgroundColor = "Cyan";
            buttonclicked.textContent = "Copy"
        }, 2000);

        await navigator.clipboard.writeText(parentNode.querySelector("#generated-link").href);

    }
    catch {
        //handle any error
    }
}


let showMobileNav = () => {

    let mobileNav = document.querySelector(".mobile-nav");
    mobileNav.style.display = mobileNav.style.display == "block" ? "none" : "block";
}



shortLinkBtn.addEventListener("click", shortOriginalLink)

menuBar.addEventListener("click", showMobileNav)

workingSection.addEventListener("click", copyLink)


