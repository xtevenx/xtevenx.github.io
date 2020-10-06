const header = document.getElementById("page-header");
const header_text = document.getElementById("page-header-text");

function header_resize() {
    const minimumHeight = (
        parseInt(window.getComputedStyle(header).paddingTop, 10) +
        parseInt(window.getComputedStyle(header).paddingBottom, 10) +
        parseInt(window.getComputedStyle(header_text).height, 10));
    const headerHeight = Math.max(minimumHeight, window.innerHeight);

    header.style.height = headerHeight + "px";
    header_text.style.marginTop = ((headerHeight - minimumHeight) / 2) + "px";
}

header_resize();
