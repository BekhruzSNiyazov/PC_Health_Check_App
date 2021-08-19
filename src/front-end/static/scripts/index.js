const progress_ring_code = `
<svg
    class="progress-ring"
    width="120"
    height="120">
    <circle
        class="progress-ring__circle"
        stroke="white"
        stroke-width="4"
        fill="transparent"
        r="52"
        cx="60"
        cy="60"
    />
</svg>
`

const set_progress = (circle, percent) => {
    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;
    circle.style.strokeDashoffset = circumference - percent / 100 * circumference;
}

let cpu_usage_svg;

const chart_view = () => {
    remove_about();

    view_button.text = "<i class=\"fas fa-grip-lines\"></i>";
    view_button.onclick = bar_view;
    view_button.update();

    cpu_usage[0].remove();
    document.body.removeChild(cpu_usage[1].parentElement);

    ram_usage[0].remove();
    document.body.removeChild(ram_usage[1].parentElement);

    disk_usage[0].remove();
    document.body.removeChild(disk_usage[1].parentElement);

    document.getElementsByTagName("br").forEach((element) => {
        element.parentElement.removeChild(element);
    });

    document.getElementsByTagName("br").forEach((element) => {
        element.parentElement.removeChild(element);
    });

    _update = false;

    // CPU Usage
    cpu_usage_svg = addHTML(progress_ring_code);
    cpu_usage_circle = document.getElementsByTagName("circle")[0];

    set_progress(cpu_usage_circle, 40);

    about();
}

const bar_view = async () => {
    if (!_update) {
        cpu_usage_svg.remove();
        remove_about();
    }

    view_button.text = "<i class=\"fas fa-chart-pie\"></i>";
    view_button.onclick = chart_view;
    view_button.update();

    // CPU usage
    cpu_usage = generate("CPU Usage", await eel.cpu_usage()());

    separate();

    // RAM usage
    const stats = await ram_stats()
    ram_usage = generate("RAM Usage", stats[0], stats[1]);

    separate();

    // disk usage
    const [total, used, free] = await eel.disk_usage()();
    disk_usage = generate_disk_usage(total, used, free, await get_disk_usage_percent());

    about();

    _update = true;
    update_stats();

}

const view_button = addButton("<i class=\"fas fa-chart-pie\"></i>", getCookie("app-theme"), "right");
view_button.onclick = chart_view;
view_button.id = "view-button";
view_button.update();
view_button.setStyle("margin-right: 5vw; margin-top: 4vh; position: fixed;");

const stats_heading = addHeading("Stats", 5);
stats_heading.classes = "heading";
stats_heading.update();

let cpu_usage, ram_usage, disk_usage, _update = true;

const get_disk_usage_percent = async () => {
    const [total, used] = await eel.disk_usage()();

    return round(100 - total / 100 * used);
}

const show_stats = async () => {

    bar_view();

}

const update_stats = async () => {
    while (_update) {
        await new Promise(r => setTimeout(r, 1000));
        update(cpu_usage, await eel.cpu_usage()());

        const stats = await ram_stats();
        update(ram_usage, stats[0], stats[1]);

        const [total, used, free] = await eel.disk_usage()();
        update_disk_usage(disk_usage, total, used, free, await get_disk_usage_percent());
    }
}

let about_heading, username_at_name, operating_system, processor, memory;

let first_time = true;

let username_at_name_text, operating_system_text, processor_text, memory_text;

const about = async () => {

    if (first_time) {
        username_at_name_text = await eel.username()() + "@" + await eel.pc_name()();
        operating_system_text = "Operating system: " + await eel.operating_system()();
        processor_text = "Processor: " + await eel.processor()();
        memory_text = "Memory: " + round(await eel.ram_total()()) + " GiB of RAM";
        first_time = false;
    }
    about_heading = addHeading("About your PC", 5);
    about_heading.classes = "heading";
    about_heading.update();

    username_at_name = addHeading(username_at_name_text, 3);
    username_at_name.classes = "content";
    username_at_name.update();

    operating_system = addText(operating_system_text);
    operating_system.classes = "content";
    operating_system.update();

    processor = addText(processor_text);
    processor.classes = "content";
    processor.update();

    memory = addText(memory_text);
    memory.classes = "content";
    memory.update();
}

const remove_about = () => {
    about_heading.remove();
    username_at_name.remove();
    operating_system.remove();
    processor.remove();
    memory.remove();
}

show_stats();
