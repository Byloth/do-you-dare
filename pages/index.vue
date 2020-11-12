<template>
    <div id="home-page" class="container">
        <main>
            <logo />
            <h1 class="title">
                Do you dare?
            </h1>
            <div class="links">
                <a
                    href="https://nuxtjs.org/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="button--green">
                    Documentation
                </a>
                <a
                    href="https://github.com/nuxt/nuxt.js"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="button--grey">
                    GitHub
                </a>
            </div>
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
            & > .subtitle
            {
                color: #526488;
                font-size: 42px;
                font-weight: 300;
                padding-bottom: 15px;
                word-spacing: 5px;
            }
            & > .links
            {
                padding-top: 15px;

                & > .button--green
                {
                    display: inline-block;
                    border-radius: 4px;
                    border: 1px solid #3B8070;
                    color: #3B8070;
                    text-decoration: none;
                    padding: 10px 30px;

                    &:hover
                    {
                        color: #fff;
                        background-color: #3B8070;
                    }
                }
                & > .button--grey
                {
                    display: inline-block;
                    border-radius: 4px;
                    border: 1px solid #35495E;
                    color: #35495E;
                    text-decoration: none;
                    padding: 10px 30px;
                    margin-left: 15px;

                    &:hover
                    {
                        color: #fff;
                        background-color: #35495E;
                    }
                }
            }
        }
    }
</style>
