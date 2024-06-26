document.addEventListener('DOMContentLoaded', () => {
    const acceptButton = document.getElementById('acceptCookies');
    const declineButton = document.getElementById('declineCookies');
    const cookieConsent = document.getElementById('cookieConsent');

    acceptButton.addEventListener('click', () => {
        setCookie('cookiesAccepted', true, 365);
        cookieConsent.style.transform = 'translateY(100%)';
    });

    declineButton.addEventListener('click', () => {
        setCookie('cookiesAccepted', false, 365);
        cookieConsent.style.transform = 'translateY(100%)';
    });

    checkCookie();
});

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
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
        setTimeout(() => {
            document.getElementById('cookieConsent').style.transform = 'translateY(100%)';
        }, 20000); // 20000 milliseconds = 20 seconds delay
    } else if (cookiesAccepted === "false" || cookiesAccepted === "") {
        document.getElementById('cookieConsent').style.transform = 'translateY(0)';
    }
}