<template>
    <div class="card">
        <div class="card-spacer"></div>
        <div class="card-content">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";

    import HtmlElementStyle from "@/utils/html-element-style";

    interface CardData
    {
        isDragging: boolean;
        startPosition: { x: number, y: number };

        style?: HtmlElementStyle;
    }

    export default Vue.extend({
        name: "Card",

        data: function(): CardData
        {
            return {
                isDragging: false,
                startPosition: { x: 0, y: 0 }
            };
        },

        mounted: function(): void
        {
            this.style = new HtmlElementStyle(this.$el as HTMLElement);
            this.style.transition.boxShadow.set({ duration: 200, timingFunction: "ease-in-out" });
            this.style.transition.transform.timingFunction = "ease-in-out";

            console.log(this.style);

            window.addEventListener("mouseup", this.onMouseUp, { passive: true });
            window.addEventListener("mousemove", this.onMouseMove, { passive: true });

            this.$el.addEventListener("mousedown", this.onMouseDown, { passive: true });
        },
        destroyed: function(): void
        {
            this.$el.removeEventListener("mousedown", this.onMouseDown);

            window.removeEventListener("mousemove", this.onMouseMove);
            window.removeEventListener("mouseup", this.onMouseUp);
        },

        methods: {
            _startDrag(evt: MouseEvent): void
            {
                if (!this.isDragging)
                {
                    this.startPosition = { x: evt.clientX, y: evt.clientY };

                    this.isDragging = true;

                    this.style!.transition.transform.duration = null;
                }
            },
            _drag(evt: MouseEvent): void
            {
                if (this.isDragging)
                {
                    const currentPosition = { x: evt.clientX, y: evt.clientY };

                    const x = currentPosition.x - this.startPosition.x;
                    const y = currentPosition.y - this.startPosition.y;

                    this.style!.transform.translate.set({ x, y });
                    this.style!.transform.rotate.set({ x: y / 25, y: x / 25, z: x / 50 });
                }
            },
            _stopDrag(evt: MouseEvent): void
            {
                if (this.isDragging)
                {
                    this.isDragging = false;

                    this.style!.transition.transform.duration = 200;
                    this.style!.transform.set(null);
                }
            },

            onMouseDown(evt: Event): void { this._startDrag(evt as MouseEvent); },
            onMouseMove(evt: Event): void { this._drag(evt as MouseEvent); },
            onMouseUp(evt?: Event): void { this._stopDrag(evt as MouseEvent); }
        }
    });
</script>

<style lang="scss" scoped>
    .card
    {
        background-color: #FFFFFF;
        border: 1px solid #000000;
        border-radius: 1em;
        box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.25);
        cursor: grab;
        margin: auto;
        overflow: hidden;
        position: relative;
        transition: box-shadow 200ms ease-in-out; //, transform 200ms ease-in-out;
        user-select: none;
        width: 18.75em;

        &:active
        {
            box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.25);
            cursor: grabbing;
        }

        & > .card-content
        {
            align-items: center;
            bottom: 0px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            left: 0px;
            position: absolute;
            right: 0px;
            text-align: center;
            top: 0px;
        }
        & > .card-spacer
        {
            padding: 70% 50%;
        }
    }
</style>
