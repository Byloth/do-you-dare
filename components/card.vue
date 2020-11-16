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
        startPosition: { x: number, y: number};
        style?: HtmlElementStyle;

        onMouseDown: (evt: Event) => void;
        onMouseMove: (evt: Event) => void;
        onMouseUp: (evt?: Event) => void;
    }

    export default Vue.extend({
        name: "Card",

        data: function(): CardData
        {
            return {
                isDragging: false,
                startPosition: { x: 0, y: 0 },

                onMouseDown: (evt: Event): void => this.startDrag(evt as MouseEvent),
                onMouseMove: (evt: Event): void => this.drag(evt as MouseEvent),
                onMouseUp: (evt?: Event): void => this.stopDrag(evt as MouseEvent)
            };
        },

        mounted: function()
        {
            this.style = new HtmlElementStyle(this.$el as HTMLElement);

            window.addEventListener("mouseup", this.onMouseUp, { passive: true });
            window.addEventListener("mousemove", this.onMouseMove, { passive: true });

            this.$el.addEventListener("mousedown", this.onMouseDown, { passive: true });
        },
        destroyed: function()
        {
            this.$el.removeEventListener("mousedown", this.onMouseDown);

            window.removeEventListener("mousemove", this.onMouseMove);
            window.removeEventListener("mouseup", this.onMouseUp);
        },

        methods: {
            startDrag(evt: MouseEvent)
            {
                if (!this.isDragging)
                {
                    this.isDragging = true;
                    this.startPosition = { x: evt.clientX, y: evt.clientY };
                }
            },
            drag(evt: MouseEvent)
            {
                if (this.isDragging)
                {
                    const currentPosition = { x: evt.clientX, y: evt.clientY };

                    const X = currentPosition.x - this.startPosition.x;
                    const Y = currentPosition.y - this.startPosition.y;

                    this.style!.transform.translate.X = X;
                    this.style!.transform.translate.Y = Y;
                    this.style!.transform.rotate.X = -Y / 25;
                    this.style!.transform.rotate.Y = X / 25;
                    this.style!.transform.rotate.Z = X / 50;
                }
            },
            stopDrag(evt?: MouseEvent)
            {
                if (this.isDragging)
                {
                    this.isDragging = false;

                    this.style!.transform.translate.X = 0;
                    this.style!.transform.translate.Y = 0;
                    this.style!.transform.rotate.X = 0;
                    this.style!.transform.rotate.Y = 0;
                    this.style!.transform.rotate.Z = 0;
                }
            }
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
            transform: rotate(2.5deg) translateX(7.5px) translateY(-5px);
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
