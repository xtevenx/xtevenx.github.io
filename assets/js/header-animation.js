const _BubbleBorderFactor = 0.0;
const _BubbleSizeMax = 40;
const _BubbleSizeMin = 20;
const _BubbleVelocityMin = 0.1;
const _BubbleVelocityMax = 0.3;

const _PixelsPerBubble = 100;
const _BubbleCreationCooldown = 700;

const _BubbleArray = [];

// Global variables ----------------------------------------------------------

const header = document.getElementById("page-header");
const headerText = document.getElementById("page-header-text");

let headerHeight, headerWidth, nextBubbleCreation;

// Bubble class --------------------------------------------------------------

class Bubble {
    constructor() {
        this.radius = (_BubbleSizeMax - _BubbleSizeMin) * Math.random() + _BubbleSizeMin;
        this.diameter = 2 * (1 + _BubbleBorderFactor) * this.radius;
        this.positionX = (headerWidth - this.diameter) * Math.random();
        this.positionY = headerHeight;

        this.originalHeaderHeight = headerHeight;
        this.velocity = ((_BubbleVelocityMax - _BubbleVelocityMin) * Math.random() + _BubbleVelocityMin);
        this.animationStart = undefined;

        this._initHTML();
    }

    _initHTML() {
        this.htmlObject = document.createElement("span");
        this.htmlObject.classList.add("bubble");
        this.htmlObject.style.borderWidth = (_BubbleBorderFactor * this.radius) + "px";
        this.htmlObject.style.padding = this.radius + "px";
        this.htmlObject.style.borderRadius = (
            parseInt(this.htmlObject.style.padding, 10)
            + parseInt(this.htmlObject.style.borderWidth, 10)
        ) + "px";
        this.htmlObject.style.top = this.positionY + "px";
        this.htmlObject.style.left = this.positionX + "px";
        header.prepend(this.htmlObject);
    }

    destructor() {
        this.htmlObject.remove();
    }

    outOfFrame() {
        const outHorizontal = this.positionX >= headerWidth - this.diameter;
        const outVertical = this.positionY <= -this.diameter;
        return outHorizontal || outVertical;
    }

    updateRender(timestamp) {
        if (this.animationStart === undefined)
            this.animationStart = timestamp;
        const elapsedTime = timestamp - this.animationStart;

        const translateDistance = elapsedTime * this.velocity;
        this.htmlObject.style.transform = "translateY(-" + translateDistance + "px)";
        this.positionY = this.originalHeaderHeight - translateDistance;
    }
}

// Header animation ----------------------------------------------------------

function _headerAnimation(timestamp) {
    for (let i = _BubbleArray.length - 1; i >= 0; i--) {
        let bubble = _BubbleArray[i];

        if (bubble.outOfFrame()) {
            _BubbleArray.splice(i, 1);
            bubble.destructor();
        } else {
            bubble.updateRender(timestamp);
        }
    }

    if (nextBubbleCreation === undefined)
        nextBubbleCreation = timestamp;

    if (_BubbleArray.length < headerWidth / _PixelsPerBubble && timestamp >= nextBubbleCreation) {
        _BubbleArray.push(new Bubble());
        nextBubbleCreation = timestamp + _BubbleCreationCooldown * (1000 / headerWidth);
    }

    window.requestAnimationFrame(_headerAnimation);
}

// Header resize -------------------------------------------------------------

function headerResize() {
    const minimumHeight = (
        parseInt(window.getComputedStyle(header).paddingTop, 10)
        + parseInt(window.getComputedStyle(header).paddingBottom, 10)
        + parseInt(window.getComputedStyle(headerText).height, 10)
    );

    headerHeight = Math.max(minimumHeight, window.innerHeight);
    headerWidth = parseInt(window.getComputedStyle(header).width, 10)

    header.style.height = headerHeight + "px";
    headerText.style.marginTop = ((headerHeight - minimumHeight) / 2) + "px";
}

// On-load functions ---------------------------------------------------------

headerResize();
window.requestAnimationFrame(_headerAnimation);
