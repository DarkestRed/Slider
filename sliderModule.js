class SliderModule extends Module {


    constructor(selector, slideArr, autoScrollTime = 0, autoStop = true) {
        super(selector);
        this.slideArr = slideArr;
        this.autoScrollTime = autoScrollTime;
        this.autoStop = autoStop;
        this.paused = false;
        this.isAnim = false;
    }

    onComponentsLoading() {
        this.slideWrapper = this.get(".slider-wrapper");
        this.leftArrow = this.get(".slider-arrow-left");
        this.rightArrow = this.get(".slider-arrow-right");
        this.bubbleCon = this.get(".slider-bubbles")
    }

    onBindEvents() {
        this.rightArrow.addEventListener("click", () => this.animateLeft());
        this.leftArrow.addEventListener("click", () => this.animateRight());
        this.bubbleCon.addEventListener("click", e => this.moveSlide(e.target));
        this.container.addEventListener("mouseenter", () => this.paused = this.autoStop);
        this.container.addEventListener("mouseleave", () => this.paused = false);
    }

    onCreate() {
        this.addSlides(this.slideArr);
        this.bubblesArr = Array.prototype.slice.call(this.bubbleCon.children);
        if (this.autoScrollTime > 0) setInterval(() => {
            if (this.paused) return;
            this.animateLeft();
        }, this.autoScrollTime);
    }

    moveSlide(clicked) {
        if (clicked.matches(".bubble")) {
            clicked.classList.add("clicked");
            if (clicked.dataset.id > this.slideWrapper.firstChild.dataset.id) this.animateLeft();
            else if (clicked.dataset.id < this.slideWrapper.firstChild.dataset.id) this.animateRight();
        }
    }


    animateLeft() {
        if (this.isAnim) return;
        this.isAnim = true;
        this.animate(0, -100, 500, (value) => {
            this.slideWrapper.style.marginLeft = value + "%";
        }, () => {
            this.slideWrapper.appendChild(this.slideWrapper.firstElementChild);
            this.slideWrapper.style.marginLeft = "";
            this.isAnim = false;
            this.bubblesArr.forEach(b => b.classList.remove("active"));
            this.bubblesArr.filter(b => b.dataset.id === this.slideWrapper.firstChild.dataset.id)
                .forEach(u => u.classList.add("active"));
            if (this.get(".clicked")) {
                if (this.get(".clicked").dataset.id === this.get(".active").dataset.id)
                    this.bubblesArr.forEach(b => b.classList.remove("clicked"));
                else this.animateLeft();
            }
        });
    }

    animateRight() {
        if (this.isAnim) return;
        this.isAnim = true;
        this.slideWrapper.insertBefore(this.slideWrapper.lastElementChild, this.slideWrapper.firstElementChild);
        this.slideWrapper.style.marginLeft = "-100%";
        this.animate(-100, 0, 500, (value) => {
            this.slideWrapper.style.marginLeft = value + "%";
        }, () => {
            this.slideWrapper.style.marginLeft = "";
            this.isAnim = false;
            this.bubblesArr.forEach(b => b.classList.remove("active"));
            this.bubblesArr.filter(b => b.dataset.id === this.slideWrapper.firstChild.dataset.id)
                .forEach(u => u.classList.add("active"));
            if (this.get(".clicked")) {
                if (this.get(".clicked").dataset.id === this.get(".active").dataset.id)
                    this.bubblesArr.forEach(b => b.classList.remove("clicked"));
                else this.animateRight();
            }
        });
    }

    animate(startValue, endValue, time, onFrame, onEnd) {
        const FRAME_TIME = 15;
        let frames = time / FRAME_TIME;
        let step = (endValue - startValue) / frames;

        let up = endValue > startValue;

        let inter = setInterval(function () {
            startValue += step;
            if ((up && startValue >= endValue) || (!up && startValue <= endValue)) {
                clearInterval(inter);
                startValue = endValue;
            }
            onFrame(startValue);
            if (startValue === endValue && onEnd) onEnd();
        }, FRAME_TIME);
    }

    addSlides(slideArr) {
        slideArr.forEach(e => {
            let slide = document.createElement("div");
            let bubble = document.createElement("div");
            slide.classList.add("slider-slide");
            bubble.classList.add("bubble");
            slide.dataset.id = slideArr.indexOf(e);
            bubble.dataset.id = slideArr.indexOf(e);
            this.slideWrapper.appendChild(slide);
            this.bubbleCon.appendChild(bubble);
            slide.style.backgroundImage = "url(" + e + ")";
        });
        this.bubbleCon.firstChild.classList.add("active");
    }
}