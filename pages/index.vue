<template>
    <main id="home-page">
        <card>
            <logo />
            <p>Questo è un paragrafo di prova.</p>
        </card>
        <h1 class="title">
            Do you dare?
        </h1>
    </main>
</template>

<script lang="ts">
    import Vue from "vue";

    export default Vue.extend({ name: "HomePage" });
</script>

<style lang="scss" scoped>
    @keyframes fade-in
    {
        0% { opacity: 0; }
        75% { opacity: 0; }
        100% { opacity: 1; }
    }
    @keyframes slide-down
    {
        0% { margin-top: -164px; }
        50% { margin-top: -164px; }
        100% { margin-top: 419px; }
    }

    #home-page
    {
        align-items: center;
        display: flex;
        height: 100vh;
        justify-content: center;
        margin: 0;
        text-align: center;

        & > .card
        {
            animation: fade-in 2000ms ease-in-out;
            margin-bottom: 133px;
            position: absolute;

            p
            {
                margin: 1em 0px;
            }
        }
        & > .title
        {
            animation: slide-down 2000ms ease-in-out;
            color: #35495E;
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
            margin-top: 419px;
            position: absolute;
        }
    }
</style>
