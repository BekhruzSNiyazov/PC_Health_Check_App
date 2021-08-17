const round = (number) => Math.round(number * 10) / 10;
const generate_background_color = (percent) => percent > 75 ? "#eb4646" : percent > 50 ? "#ebeb26" : "#15e626";

const generate = (text, percent, gb) => {
    const heading = gb ? addHeading(`${text} (${percent}%, ${gb[0]}GiB/${gb[1]}GiB)`, 3)
        : addHeading(text + " (" + percent + "%)", 3);
    heading.classes = "content";
    heading.update();

    const [used, free, outerDiv] = generate_bar(percent);
    return [heading, used, free, outerDiv];
}

const generate_disk_usage = (total, used_gb, free_gb, percent) => {
    const heading = addHeading(`Disk Usage (${used_gb}GiB/${total}GiB, ${free_gb}GiB free)`, 3);
    heading.classes = "content";
    heading.update();

    const [used, free, outerDiv] = generate_bar(percent);
    return [heading, used, free, outerDiv];
}

const generate_bar = (percent) => {
    const outerDiv = document.createElement("div");
    outerDiv.className = "content stats";
    outerDiv.style.display = "flex";
    outerDiv.style.backgroundColor = getCookie("app-theme") === "dark" ? "gray" : "lightgray";
    outerDiv.style.borderRadius = "10px";

    const used = document.createElement("div");
    used.style.width = percent + "%";
    used.style.backgroundColor = generate_background_color(percent);
    used.style.borderRadius = "10px";

    const free = document.createElement("p");
    free.style.width = 100 - percent + "%";

    outerDiv.appendChild(used);
    outerDiv.appendChild(free);
    document.body.appendChild(outerDiv);

    return [used, free, outerDiv];
}

const ram_stats = async () => [await eel.ram_usage()(), [round(await eel.ram_gb_used()()), round(await eel.ram_total()())]];

const separate = () => addHTML("<br style='clear: both;'>");

const update = (elements, percent, gb) => {
    elements[0].element.innerText = elements[0].element.innerText.split("(")[0] + "(" + percent + (gb ? `%, ${gb[0]}GiB/${gb[1]}GiB)` : "%)");
    elements[1].style.width = percent + "%";
    elements[1].style.backgroundColor = generate_background_color(percent);
    elements[2].style.width = 100 - percent + "%";
    elements[3].style.backgroundColor = getCookie("app-theme") === "dark" ? "gray" : "lightgray";
}

const update_disk_usage = (elements, total, used, free, percent) => {
    elements[0].element.innerText = `Disk Usage (${used}GiB/${total}GiB, ${free}GiB free)`;
    elements[1].style.width = percent + "%";
    elements[1].style.backgroundColor = generate_background_color(percent);
    elements[2].style.width = 100 - percent + "%";
    elements[3].style.backgroundColor = getCookie("app-theme") === "dark" ? "gray" : "lightgray";
}
