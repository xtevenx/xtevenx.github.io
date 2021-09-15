(function (bubbleAnimation) {
    const _AnimationFPS = 999;  // requestAnimationFrame caps at 60.

    const _BubbleBorderFactor = 0.0;
    const _BubbleSizeMax = 40;
    const _BubbleSizeMin = 25;
    const _BubbleVelocityMin = 0.05;
    const _BubbleVelocityMax = 0.1;

    const _PixelsPerBubble = 40000;

    const _MomentumFactor = 0.996;
    const _MouseForce = 800;
    const _AccelerationPrevention = 0.4;

    const _BubbleArray = [];

// Global variables ----------------------------------------------------------

    const header = document.getElementById("page-header");
    const headerText = document.getElementById("page-header-text");

    let headerHeight, headerWidth, lastBubbleCreation;

    let mouseX = 0, mouseY = 0;

// Bubble class --------------------------------------------------------------

    class Bubble {
        constructor() {
            this.radius = (_BubbleSizeMax - _BubbleSizeMin) * Math.random() + _BubbleSizeMin;
            this.diameter = 2 * (1 + _BubbleBorderFactor) * this.radius;
            this.positionY = headerHeight - this.diameter
            this.positionX = (headerWidth - this.diameter) * Math.random();

            this.innateVelocity = ((_BubbleVelocityMax - _BubbleVelocityMin) * Math.random() + _BubbleVelocityMin);
            this.verticalVelocity = 0;
            this.horizontalVelocity = 0;
            this.verticalDisplacement = 0;
            this.horizontalDisplacement = 0;
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
            this.htmlObject.style.top = this.positionY + "px";
            this.htmlObject.style.left = this.positionX + "px";
            header.prepend(this.htmlObject);
        }

        destructor() {
            this.htmlObject.remove();
        }

        outOfFrame() {
            this.positionX = parseInt(this.htmlObject.style.left, 10) + this.horizontalDisplacement;
            const outHorizontal = this.positionX < -this.diameter || this.positionX > headerWidth;

            this.positionY = parseInt(this.htmlObject.style.top, 10) - this.verticalDisplacement;
            const outVertical = this.positionY < window.scrollY - this.diameter || this.positionY > headerHeight;

            return outHorizontal || outVertical;
        }

        updateRender(timestamp) {
            if (this.lastTimestamp === undefined)
                this.lastTimestamp = timestamp;
            const elapsedTime = timestamp - this.lastTimestamp;

            const verticalDiff = (this.positionY + this.diameter / 2) - (mouseY + window.scrollY);
            const horizontalDiff = (this.positionX + this.diameter / 2) - mouseX;
            const mouseDistance = Math.sqrt(verticalDiff ** 2 + horizontalDiff ** 2);
            const verticalPortion = verticalDiff / mouseDistance;
            const horizontalPortion = horizontalDiff / mouseDistance;
            this.verticalVelocity -=
                _MouseForce * verticalPortion / (mouseDistance + this.diameter * _AccelerationPrevention) ** 2;
            this.horizontalVelocity +=
                _MouseForce * horizontalPortion / (mouseDistance + this.diameter * _AccelerationPrevention) ** 2;

            this.verticalVelocity *= _MomentumFactor ** elapsedTime;
            this.horizontalVelocity *= _MomentumFactor ** elapsedTime;

            this.verticalDisplacement += elapsedTime * (this.innateVelocity + this.verticalVelocity);
            this.horizontalDisplacement += elapsedTime * this.horizontalVelocity;
            this.htmlObject.style.transform =
                "translate(" + this.horizontalDisplacement + "px, -" + this.verticalDisplacement + "px)";
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

        setTimeout(function () {
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

    document.addEventListener("mousemove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
    });

    bubbleAnimation.onresize();
    window.requestAnimationFrame(_headerAnimation);
}(window.bubbleAnimation = {}));
