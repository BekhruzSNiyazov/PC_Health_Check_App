let cpu_usage_svg, ram_usage_svg, disk_usage_svg;
let cpu_usage_text, ram_usage_text, disk_usage_text;
let cpu_cicle, ram_circle, disk_circle;
let first_row, second_row;

const chart_view = async () => {
    setCookie("stats-view", "chart");

    if (!_update_charts && !first_time) {
        view_button.text = "<i class=\"fas fa-grip-lines\"></i>";
        view_button.onclick = bar_view;
        view_button.update();

        cpu_info[0].remove();
        document.body.removeChild(cpu_info[1].parentElement);

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

        remove_about();
    }
    _update = false;

    // CPU Usage
    const cpu_usage_percent = await eel.cpu_usage()();
    const speed = await eel.cpu_speed()();
    cpu_usage_text = generate_cpu_heading(cpu_usage_percent, speed);
    cpu_usage_text.position = "center";
    cpu_usage_svg = new ProgressRing(cpu_usage_percent);

    // RAM Usage
    const stats = await ram_stats();
    ram_usage_text = generate_ram_heading(stats[0], stats[1]);
    ram_usage_text.position = "center";
    ram_usage_svg = new ProgressRing(stats[0]);


    // Disk Usage
    const [total, used, free] = await eel.disk_usage()();
    const disk_usage_percent = await get_disk_usage_percent();
    disk_usage_text  = generate_disk_heading(total, used, free, disk_usage_percent);
    disk_usage_text.position = "center";
    disk_usage_svg = new ProgressRing(disk_usage_percent);

    _update_charts = true;
    update_charts();
    
    first_row = createGrid([[cpu_usage_text, ram_usage_text, disk_usage_text]]);
    second_row = createGrid([[cpu_usage_svg, ram_usage_svg, disk_usage_svg]]);
    cpu_circle = cpu_usage_svg.color_ring;
    ram_circle = ram_usage_svg.color_ring;
    disk_circle = disk_usage_svg.color_ring;

    about();
    fix_view_button();
}

const bar_view = async () => {
    setCookie("stats-view", "bar");

    if (!_update && !first_time) {
        first_row.remove();
        second_row.remove();

        remove_about();
    }

    _update_charts = false;

    view_button.text = "<i class=\"fas fa-chart-pie\"></i>";
    view_button.onclick = chart_view;
    view_button.update();

    // CPU usage
    cpu_info = generate_cpu_info(await eel.cpu_usage()(), await eel.cpu_speed()());

    separate();

    // RAM usage
    const stats = await ram_stats()
    ram_usage = generate_ram_usage(stats[0], stats[1]);

    separate();

    // Disk Usage
    const [total, used, free] = await eel.disk_usage()();
    const disk_usage_percent = await get_disk_usage_percent();
    disk_usage = generate_disk_usage(total, used, free, disk_usage_percent);

    about();
    fix_view_button();

    _update = true;
    update_stats();

}

const view_button = addButton("<i class=\"fas fa-chart-pie\"></i>", getCookie("app-theme"), "right");
view_button.id = "view-button";
if (getCookie("stats-view") === "bar") {
    view_button.onclick = chart_view;
    view_button.update();
} else {
    view_button.text = "<i class=\"fas fa-grip-lines\"></i>";
    view_button.onclick = bar_view;
    view_button.update();
}
view_button.setStyle("margin-right: 5vw; margin-top: 4vh; position: fixed;");

const stats_heading = addHeading("Stats", 5);
stats_heading.classes = "heading";
stats_heading.update();

let cpu_info, ram_usage, disk_usage;

const update_stats = async () => {
    while (_update) {
        await new Promise(r => setTimeout(r, 1000));

        update_cpu_info(cpu_info, await eel.cpu_usage()(), await eel.cpu_speed()());

        const stats = await ram_stats();
        update_ram_usage(ram_usage, stats[0], stats[1]);

        const [total, used, free] = await eel.disk_usage()();
        update_disk_usage(disk_usage, total, used, free, await get_disk_usage_percent());
    }
}

let [_update_charts, _update] = [false, false];

const update_charts = async () => {
    while (_update_charts) {
        await new Promise(r => setTimeout(r, 1000));

        const cpu_percent = await eel.cpu_usage()();
        const cpu_speed = await eel.cpu_speed()();
        set_progress(cpu_circle, cpu_percent);
        cpu_circle.setAttribute("stroke", generate_background_color(cpu_percent));
        update_cpu_heading(cpu_usage_text, cpu_percent, cpu_speed);

        const stats = await ram_stats();
        set_progress(ram_circle, stats[0]);
        ram_circle.setAttribute("stroke", generate_background_color(stats[0]));
        update_ram_heading(ram_usage_text, stats[0], stats[1], stats[2]);
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

// using the last view the user chose on start up
if (getCookie("stats-view") === "bar") {
    bar_view();
    _update = true;
} else {
    chart_view();
    _update_charts = true;
}
