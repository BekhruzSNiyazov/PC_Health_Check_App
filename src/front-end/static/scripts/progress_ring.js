const progress_ring_code = `
<svg
    class="progress-ring"
    width="240"
    height="240">
    <circle
        class="gray-circle"
        stroke="${getCookie('app-theme') === 'light' ? 'lightgray' : 'gray'}"
        stroke-width="20"
        fill="transparent"
        r="100"
        cx="120"
        cy="120"
    />
    <circle
        class="progress-ring__circle"
        stroke="green"
        stroke-width="20"
        fill="transparent"
        r="100"
        cx="120"
        cy="120"
    />
</svg>
`;

let progressRingCounter = 0;

// custom class for progress ring charts
class ProgressRing extends basicUIObject {
    constructor(percent) {
        super();
        this.percent = percent;
        this.theme = getCookie("app-theme");
        this.hiddenId = "progress-ring-" + progressRingCounter++;
    }

    add(visible = true) {
        if (!this.added) {
            this.wrapper = this.wrap();
            this.element = document.createElement("div");
            this.wrapper.appendChild(this.element);
            body.appendChild(this.wrapper);
            this.added = true;
        } else {
            this.outerElement.style.display = "block";
        }
        this.removed = false;

        this.element.className += " " + this.classes;
        this.element.id = this.id;
        this.element.innerHTML = progress_ring_code;
        this.alignContent(this.element, "center");

        this.gray_ring = this.element.getElementsByClassName("gray-circle")[0];
        this.gray_ring.classList.remove("gray-circle");
        this.color_ring = this.element.getElementsByClassName("progress-ring__circle")[0];
        this.color_ring.classList.remove("progress-ring__circle");
        set_progress(this.color_ring, this.percent);
    }
}
