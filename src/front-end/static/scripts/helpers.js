const round = (number) => Math.round(number * 10) / 10;

const generate = (text, percent, gb) => {
    const heading = gb ? addHeading(`${text} (${percent}% or ${gb[0]}Gb out of ${gb[1]}Gb used)`, 3) : addHeading(text + " (" + percent + "%)", 3)
    heading.classes = "content";
    heading.update();

    const outerDiv = document.createElement("div");
    outerDiv.className = "content stats";
    outerDiv.style.display = "flex";
    outerDiv.style.backgroundColor = getCookie("app-theme") === "dark" ? "gray" : "lightgray";
    outerDiv.style.borderRadius = "10px";

    const used = document.createElement("div");
    used.style.width = percent + "%";
    used.style.backgroundColor = percent > 75 ? "#eb4646" : percent > 50 ? "#ebeb26" : "#15e626";
    used.style.borderRadius = "10px";

    const free = document.createElement("p");
    free.style.width = 100 - percent + "%";


    outerDiv.appendChild(used);
    outerDiv.appendChild(free);
    document.body.appendChild(outerDiv);

    return [heading, used, free, outerDiv];
}

const ram_stats = async () => [await eel.ram_usage()(), [round(await eel.ram_gb_used()()), round(await eel.ram_total()())]];

const separate = () => addHTML("<br style='clear: both;'>");

const update = async (elements, percent, gb) => {
    elements[0].element.innerText = elements[0].element.innerText.split("(")[0] + "(" + percent + (gb ? `% or ${gb[0]}Gb out of ${gb[1]}Gb used)` : "%)");
    elements[1].style.width = percent + "%";
    elements[1].style.backgroundColor = percent > 75 ? "#eb4646" : percent > 50 ? "#ebeb26" : "#15e626";
    elements[2].style.width = 100 - percent + "%";
    elements[3].style.backgroundColor = getCookie("app-theme") === "dark" ? "gray" : "lightgray";
}
