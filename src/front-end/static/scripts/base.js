// creating the navbar
const navbar = createNavBar();

navbar.setTitle("PC Health Check App");
navbar.addItem("logo", "../static/images/icon.png");
navbar.addItem("button", [getCookie("app-theme") === "dark" ? "dark" : "light", "<i class=\"fas fa-adjust\"></i>", "toggle();"], "right");
navbar.addItem("link", ["Home", "index.html"]);
navbar.addItem("link", ["Settings", "settings.html"]);

// this function sets the size of the navbar logo to 50
let fixIconSize = () => document.getElementById("navbar-image").getElementsByTagName("img")[0].width = "50";

// this function manages the theme toggling
let toggle = () => {
    toggleTheme();
    fixIconSize();

    if (getCookie("app-theme") === "light") {
        setCookie("app-theme", "dark");
    } else {
        setCookie("app-theme", "light");
    }
    document.getElementById("nav").getElementsByTagName("button")[1].className = "btn btn-" + getCookie("app-theme") + " ripple-surface"
    document.getElementById("view-button").className = "btn btn-" + getCookie("app-theme") + " ripple-surface";
}

fixIconSize();

// changing the app theme to dark if the user was using the dark mode during the previous session
if (!checkCookie("app-theme")) {
    setCookie("app-theme", "light");
} else if (getCookie("app-theme") === "dark") {
    toggleTheme();
    fixIconSize();
}
