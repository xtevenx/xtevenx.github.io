(function (bubbleAnimation) {
    const _AnimationFPS = 24;

    const _BubbleBorderFactor = 0.0;
    const _BubbleSizeMax = 40;
    const _BubbleSizeMin = 25;
    const _BubbleVelocityMin = 0.05;
    const _BubbleVelocityMax = 0.1;

    const _PixelsPerBubble = 80000;

    const _BubbleArray = [];

// Global variables ----------------------------------------------------------

    const header = document.getElementById("page-header");
    const headerText = document.getElementById("page-header-text");

    let headerHeight, headerWidth, lastBubbleCreation;

// Bubble class --------------------------------------------------------------

    class Bubble {
        constructor() {
            this.radius = (_BubbleSizeMax - _BubbleSizeMin) * Math.random() + _BubbleSizeMin;
            this.diameter = 2 * (1 + _BubbleBorderFactor) * this.radius;
            this.positionX = (headerWidth - this.diameter) * Math.random();

            this.velocity = ((_BubbleVelocityMax - _BubbleVelocityMin) * Math.random() + _BubbleVelocityMin);
            this.displacement = 0;
            this.lastTimestamp = undefined;

            this.htmlObject = document.createElement("span");
            this._initHTML();
        }

        _initHTML() {
            this.htmlObject.classList.add("bubble");
            this.htmlObject.style.borderWidth = (_BubbleBorderFactor * this.radius) + "px";
            this.htmlObject.style.padding = this.radius + "px";
            this.htmlObject.style.borderRadius = (
                parseInt(this.htmlObject.style.padding, 10)
                + parseInt(this.htmlObject.style.borderWidth, 10)
            ) + "px";
            this.htmlObject.style.opacity = (this.radius / _BubbleSizeMax) + "";
            this.htmlObject.style.top = (headerHeight - this.diameter) + "px";
            this.htmlObject.style.left = this.positionX + "px";
            header.prepend(this.htmlObject);
        }

        destructor() {
            this.htmlObject.remove();
        }

        outOfFrame() {
            const outHorizontal = this.positionX >= headerWidth - this.diameter;

            const positionY = parseInt(this.htmlObject.style.top, 10) - this.translateDistance;
            const outVertical = (
                positionY <= window.scrollY - this.diameter
                || positionY > (headerHeight - this.diameter)
            );

            return outHorizontal || outVertical;
        }

        updateRender(timestamp) {
            if (this.lastTimestamp === undefined)
                this.lastTimestamp = timestamp;
            const elapsedTime = timestamp - this.lastTimestamp;

            this.displacement += elapsedTime * this.velocity;
            this.htmlObject.style.transform = "translateY(-" + this.displacement + "px)";
            this.lastTimestamp = timestamp;
        }
    }

// Header animation ----------------------------------------------------------

    function _headerAnimation(timestamp) {
        if (window.scrollY >= headerHeight) {
            window.requestAnimationFrame(_headerAnimation);
            return;
        }

        for (let i = _BubbleArray.length - 1; i >= 0; i--) {
            let bubble = _BubbleArray[i];

            if (bubble.outOfFrame()) {
                _BubbleArray.splice(i, 1);
                bubble.destructor();
            } else {
                bubble.updateRender(timestamp);
            }
        }

        if (lastBubbleCreation === undefined)
            lastBubbleCreation = 0;

        const maximumBubbles = ((headerHeight - window.scrollY) * headerWidth) / _PixelsPerBubble;
        const bubbleLifetime = (headerHeight - window.scrollY) / ((_BubbleVelocityMax + _BubbleVelocityMin) / 2);
        const bubbleCreationCooldown = bubbleLifetime / maximumBubbles;

        if (_BubbleArray.length < maximumBubbles && timestamp >= lastBubbleCreation + bubbleCreationCooldown) {
            _BubbleArray.push(new Bubble());
            lastBubbleCreation = timestamp;
        }

        setTimeout(function() {
            window.requestAnimationFrame(_headerAnimation)
        }, 1000 / _AnimationFPS);
    }

// Header resize -------------------------------------------------------------

    bubbleAnimation.onresize = function () {
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

    bubbleAnimation.onresize();
    window.requestAnimationFrame(_headerAnimation);
}(window.bubbleAnimation = {}));
