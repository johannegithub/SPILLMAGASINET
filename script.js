
  document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.box');

    boxes.forEach(box => {
        box.addEventListener('click', () => {
            alert(`Du klikket på ${box.innerText}`);
        });
    });

    document.getElementById('acceptCookies').addEventListener('click', () => {
        setCookie('cookiesAccepted', true, 365);
        document.getElementById('cookieConsent').style.transform = 'translateY(100%)';
    });

    document.getElementById('declineCookies').addEventListener('click', () => {
        setCookie('cookiesAccepted', false, 365);
        document.getElementById('cookieConsent').style.transform = 'translateY(100%)';
    });
});

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    let cookiesAccepted = getCookie("cookiesAccepted");
    if (cookiesAccepted === "true") {
        document.getElementById('cookieConsent').style.transform = 'translateY(100%)';
    } else if (cookiesAccepted === "false" || cookiesAccepted === "") {
        document.getElementById('cookieConsent').style.transform = 'translateY(0)';
    }
}