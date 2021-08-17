const stats_heading = addHeading("Stats", 5);
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

const about = async () => {
    const about_heading = addHeading("About your PC", 5);
    about_heading.classes = "heading";
    about_heading.update();

    const username_at_name = addHeading(await eel.username()() + "@" + await eel.pc_name()(), 3);
    username_at_name.classes = "content";
    username_at_name.update();

    const operating_system = addText("Operating system: " + await eel.operating_system()());
    operating_system.classes = "content";
    operating_system.update();

    const processor = addText("Processor: " + await eel.processor()());
    processor.classes = "content";
    processor.update();

    const memory = addText("Memory: " + round(await eel.ram_total()()) + " GiB of RAM");
    memory.classes = "content";
    memory.update();
}

show_stats();
update_stats();
