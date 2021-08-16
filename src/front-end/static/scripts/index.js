const heading = addHeading("Stats", 6);
heading.classes = "heading";
heading.update();

let cpu_usage, ram_usage;

const show_stats = async () => {
    // CPU usage
    cpu_usage = generate("CPU Usage", await eel.cpu_usage()());

    separate();

    // RAM usage
    ram_usage = generate("RAM Usage", await eel.ram_usage()());

    separate();

}

const update_stats = async () => {
    while (true) {
        await new Promise(r => setTimeout(r, 1000));
        update(cpu_usage, await eel.cpu_usage()());
        update(ram_usage, await eel.ram_usage()());
    }
}

show_stats();
update_stats();
