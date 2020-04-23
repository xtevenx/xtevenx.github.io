echo.init({
    offset: 100,
    throttle: 250,
    debounce: false
});

window.onresize = function() {
    echo.render();
}