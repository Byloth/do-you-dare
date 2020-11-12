<template>
    <div id="home-page" class="container">
        <main>
            <card>
                <logo />
                <p>Questo è un paragrafo di prova.</p>
            </card>
            <h1 class="title">
                Do you dare?
            </h1>
        </main>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({ name: "HomePage" });
</script>

<style lang="scss" scoped>
    .container
    {
        align-items: center;
        display: flex;
        justify-content: center;
        margin: 0 auto;
        min-height: 100vh;
        text-align: center;

        & > main
        {
            & > .title
            {
                color: #35495E;
                display: block;
                font-family:
                    "Quicksand",
                    "Source Sans Pro",
                    -apple-system,
                    BlinkMacSystemFont,
                    "Segoe UI",
                    Roboto,
                    "Helvetica Neue",
                    Arial,
                    sans-serif;

                font-size: 100px;
                font-weight: 300;
                letter-spacing: 1px;
            }

            p
            {
                margin: 1em 0px;
            }
        }
    }
</style>
