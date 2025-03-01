

var customCSS = `
.not-hidden {
    display: block;
}
.box-nav-bar {
    background-size: auto 100% !important;
}
.nav-bar-item:first-child {
    background-size: auto 100% !important;
}
.nav-bar-item {
    background-size: auto 123% !important;
}
.btn-build.current-quest {
    min-width: 0;
    padding: 3px 9px;
    background: linear-gradient(to bottom, #0bac00 0%,#0e7a1e 100%);
}
.btn-build.current-quest:hover {
    background: linear-gradient(to bottom, #13c600 0%,#129e23 100%);
}

#toggleButton.toggle-on {
    background-color: green;
}

#toggleButton {
    width: 35px;
    height: 18px;
    margin-left: 5px;
    background-color: red;
    border: none;
    border-radius: 15px;
    position: relative;
    cursor: pointer;
}

#toggleButton:before {
    content: '';
    position: absolute;
    top: 3px;
    left: 5px;
    width: 12px;
    height: 12px;
    background-color: white;
    border-radius: 50%;
    transition: transform 0.3s, background-color 0.3s;
}

.toggle-on:before {
    transform: translateX(12px);
}

.warn_90 {
    color: red;
}

.village-duration, .village-caries, .village-arrive {
    display: block;
    margin-top: 0px;
    font-size: 87%;
    line-height: 11px;
}

 /* darker background image */
#ds_body {
    backdrop-filter: brightness(0.4);
}

 /* small css change to make the body full page */
html, body {
    height: -webkit-fill-available;
    margin: 0;
    padding: 0;
}
body {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}
#bottom {
    position: inherit;
}
#bottom.bottom_sticky {
    position: sticky;
}
`;
GM_addStyle(customCSS);

//apply bottom sticky beacause of custom css :D
const resizeObserver = new ResizeObserver(() => {
    const pageHeight = document.documentElement.scrollHeight;
    const dsBodyHeight = document.getElementById('ds_body').offsetHeight;
    const htmlBody = document.querySelector('html');
    const bottom = document.querySelector('#bottom');
    if (dsBodyHeight !== pageHeight) {
        bottom.classList.add('bottom_sticky');
        htmlBody.style.height = 'auto';

    } else {
        bottom.classList.remove('bottom_sticky');
    }
});
if (document.getElementById('main_layout')) {
    resizeObserver.observe(document.getElementById('main_layout'));
}
