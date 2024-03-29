const round = (number) => Math.round(number * 10) / 10;
const generate_background_color = (percent) => percent > 75 ? "#eb4646" : percent > 50 ? "#ebeb26" : "#15e626";
const fix_view_button = () => document.getElementById("view-button").className = "btn btn-" + getCookie("app-theme") + " ripple-surface";

const set_progress = (circle, percent) => {
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;
    circle.style.strokeDashoffset = circumference - percent / 100 * circumference;
    circle.setAttribute("stroke", generate_background_color(percent));
}

const get_disk_usage_percent = async () => {
    const [total, used] = await eel.disk_usage()();

    return round(100 - total / 100 * used);
}

const generate_cpu_heading = (cpu_usage, cpu_speed) => {
    const heading = new Heading("CPU (" + cpu_usage + "%, " + cpu_speed + "GHz)", 3, "left");
    return heading;
}

const generate_ram_heading = (percent, gb) => {
    const heading = new Heading(`RAM (${percent}%, ${gb[0]}GiB/${gb[1]}GiB)`, 3, "left");
    return heading;
}

const generate_disk_heading = (total, used_gb, free_gb, percent) => {
    const heading = new Heading(`Disk (${used_gb}GiB/${total}GiB, ${free_gb}GiB free)`, 3, "left");
    return heading;
}

const generate_cpu_info = (cpu_usage, cpu_speed) => {
    const heading = generate_cpu_heading(cpu_usage, cpu_speed);
    heading.classes = "content";
    heading.add();
    const [used, free, outerDiv] = generate_bar(cpu_usage);
    return [heading, used, free, outerDiv];
}

const generate_ram_usage = (percent, gb) => {
    const heading = generate_ram_heading(percent, gb);
    heading.classes = "content";
    heading.add();
    const [used, free, outerDiv] = generate_bar(percent);
    return [heading, used, free, outerDiv];
}

const generate_disk_usage = (total, used_gb, free_gb, percent) => {
    const heading = generate_disk_heading(total, used_gb, free_gb, percent);
    heading.classes = "content";
    heading.add();
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

const update_ram_heading = (heading, percent, gb) => {
    heading.element.innerText = heading.element.innerText.split("(")[0] + "(" + percent + `%, ${gb[0]}GiB/${gb[1]}GiB)`;
}

const update_disk_heading = (heading, total, used, free) => {
    heading.element.innerText = `Disk (${used}GiB/${total}GiB, ${free}GiB free)`;
}

const update_cpu_heading = (heading, cpu_usage, cpu_speed) => {
    heading.element.innerText = "CPU (" + cpu_usage + "%, " + cpu_speed + "GHz)";
}

const update_ram_usage = (elements, percent, gb) => {
    update_ram_heading(elements[0], percent, gb);
    elements[1].style.width = percent + "%";
    elements[1].style.backgroundColor = generate_background_color(percent);
    elements[2].style.width = 100 - percent + "%";
    elements[3].style.backgroundColor = getCookie("app-theme") === "dark" ? "gray" : "lightgray";
}

const update_disk_usage = (elements, total, used, free, percent) => {
    update_disk_heading(elements[0], total, used, free, percent);
    elements[1].style.width = percent + "%";
    elements[1].style.backgroundColor = generate_background_color(percent);
    elements[2].style.width = 100 - percent + "%";
    elements[3].style.backgroundColor = getCookie("app-theme") === "dark" ? "gray" : "lightgray";
}

const update_cpu_info = (elements, cpu_usage, cpu_speed) => {
    update_cpu_heading(elements[0], cpu_usage, cpu_speed);
    elements[1].style.width = cpu_usage + "%";
    elements[1].style.backgroundColor = generate_background_color(cpu_usage);
    elements[2].style.width = 100 - cpu_usage + "%";
    elements[3].style.backgroundColor = getCookie("app-theme") === "dark" ? "gray" : "lightgray";
}
