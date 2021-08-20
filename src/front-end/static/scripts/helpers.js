const round = (number) => Math.round(number * 10) / 10;
const generate_background_color = (percent) => percent > 75 ? "#eb4646" : percent > 50 ? "#ebeb26" : "#15e626";

const generate_disk_usage = (total, used_gb, free_gb, percent) => {
    const heading = addHeading(`Disk (${used_gb}GiB/${total}GiB, ${free_gb}GiB free)`, 3);
    heading.classes = "content";
    heading.update();

    const [used, free, outerDiv] = generate_bar(percent);
    return [heading, used, free, outerDiv];
}

const generate_cpu_heading = (cpu_usage, cpu_speed) => {
    const heading = addHeading("CPU (" + cpu_usage + "%, " + cpu_speed + "GHz)", 3);
    heading.classes = "content";
    heading.update();
    return heading;
}

const generate_cpu_info = (cpu_usage, cpu_speed) => {
    const heading = generate_cpu_heading(cpu_usage, cpu_speed);
    const [used, free, outerDiv] = generate_bar(cpu_usage);
    return [heading, used, free, outerDiv];
}

const generate_ram_usage = (percent, gb) => {
    const heading = addHeading(`RAM (${percent}%, ${gb[0]}GiB/${gb[1]}GiB)`, 3);
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

const update_ram_usage = (elements, percent, gb) => {
    elements[0].element.innerText = elements[0].element.innerText.split("(")[0] + "(" + percent + `%, ${gb[0]}GiB/${gb[1]}GiB)`;
    elements[1].style.width = percent + "%";
    elements[1].style.backgroundColor = generate_background_color(percent);
    elements[2].style.width = 100 - percent + "%";
    elements[3].style.backgroundColor = getCookie("app-theme") === "dark" ? "gray" : "lightgray";
}

const update_disk_usage = (elements, total, used, free, percent) => {
    elements[0].element.innerText = `Disk (${used}GiB/${total}GiB, ${free}GiB free)`;
    elements[1].style.width = percent + "%";
    elements[1].style.backgroundColor = generate_background_color(percent);
    elements[2].style.width = 100 - percent + "%";
    elements[3].style.backgroundColor = getCookie("app-theme") === "dark" ? "gray" : "lightgray";
}

const update_cpu_info = (elements, cpu_usage, cpu_speed) => {
    elements[0].element.innerText = "CPU (" + cpu_usage + "%, " + cpu_speed + "GHz)";
    elements[1].style.width = cpu_usage + "%";
    elements[1].style.backgroundColor = generate_background_color(cpu_usage);
    elements[2].style.width = 100 - cpu_usage + "%";
    elements[3].style.backgroundColor = getCookie("app-theme") === "dark" ? "gray" : "lightgray";
}
