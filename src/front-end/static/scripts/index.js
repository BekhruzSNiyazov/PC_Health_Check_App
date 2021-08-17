const stats_heading = addHeading("Stats");
stats_heading.classes = "heading";
stats_heading.update();

let cpu_usage, ram_usage, disk_usage;

const get_disk_usage_percent = async () => {
    const [total, used] = await eel.disk_usage()();

    return round(100 - total / 100 * used);
}

const show_stats = async () => {
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

}

const update_stats = async () => {
    while (true) {
        await new Promise(r => setTimeout(r, 1000));
        update(cpu_usage, await eel.cpu_usage()());

        const stats = await ram_stats();
        update(ram_usage, stats[0], stats[1]);

        const [total, used, free] = await eel.disk_usage()();
        update_disk_usage(disk_usage, total, used, free, await get_disk_usage_percent());
    }
}

const about = () => {
    const about_heading = addHeading("About your PC");
    about_heading.classes = "heading";
    about_heading.update();
}

show_stats();
update_stats();
