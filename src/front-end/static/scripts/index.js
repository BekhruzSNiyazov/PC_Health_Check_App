const heading = addHeading("Stats", 6);
heading.classes = "heading";
heading.update();

let cpu_usage, ram_usage;

const show_stats = async () => {
    // CPU usage
    cpu_usage = generate("CPU Usage", await eel.cpu_usage()());

    separate();

    // RAM usage
    const stats = await ram_stats()
    ram_usage = generate("RAM Usage", stats[0], stats[1]);

    separate();

}

const update_stats = async () => {
    while (true) {
        await new Promise(r => setTimeout(r, 1000));
        update(cpu_usage, await eel.cpu_usage()());

        const stats = await ram_stats();
        update(ram_usage, stats[0], stats[1]);
    }
}

show_stats();
update_stats();
