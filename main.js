document.addEventListener("DOMContentLoaded", () => {

    /* -------------------------
       Dawned OS Clock
    ------------------------- */
    function updateClock() {
        const clock = document.getElementById("topbar-center");
        const now = new Date();

        let hours = now.getHours();
        let minutes = now.getMinutes();

        hours = hours < 10 ? "0" + hours : hours;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        clock.innerText = `${hours}:${minutes}`;
    }

    setInterval(updateClock, 1000);
    updateClock();


    /* -------------------------
       App Launcher
    ------------------------- */
    window.openApp = function(url) {
        window.open(url, "_blank");
    };

});
