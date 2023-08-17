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
        return;
    }


    if (!userlink.value.includes(".com")) {

        error.style.display = "block"
        error.textContent = "Invalid url";
        return;
    }

    let res = fetchShortLink(userlink.value)
    res.then((res) => {


        //resetting copy link button background
        let links = document.querySelectorAll("#copy-link");

        links.forEach(element => {
            element.textContent = "Copy";
            element.style.backgroundColor = "Cyan";
        });


        hideError();

        let shortenLink;
        shortenLink = res.result.full_short_link;

        // Retrieve the existing links array from Local Storage
        storedLinks = JSON.parse(localStorage.getItem("storedLinks")) || [];

        // Add the new link and original link to the array
        storedLinks.push({ shortLink: shortenLink, originalLink: userlink.value });

        // Save the updated array back to Local Storage
        localStorage.setItem("storedLinks", JSON.stringify(storedLinks));



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
        });

}



let hideError = () => {
    error.style.display = "none"
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

userlink.addEventListener("input", hideError)

menuBar.addEventListener("click", showMobileNav)

workingSection.addEventListener("click", copyLink)


// When the page loads
document.addEventListener('DOMContentLoaded', () => {
    storedLinks = JSON.parse(localStorage.getItem("storedLinks")) || [];

    // Display stored links on the page
    for (const linkData of storedLinks) {
        const template = document.querySelector(".template");
        const clonedLinkSection = template.cloneNode(true);
        clonedLinkSection.classList.remove("template");

        const originalLinkElement = clonedLinkSection.querySelector("#original-link");
        const generatedLinkElement = clonedLinkSection.querySelector("#generated-link");

        originalLinkElement.href = linkData.originalLink;
        originalLinkElement.textContent = linkData.originalLink;

        generatedLinkElement.href = linkData.shortLink;
        generatedLinkElement.textContent = linkData.shortLink;

        clonedLinkSection.style.display = "flex";

        workingSection.appendChild(clonedLinkSection);
    }
});
