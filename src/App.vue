<template>
    <div id="app">
        <div class="aside">
            <Aside></Aside>
        </div>
        <transition>
            <div class="content">
                <router-view/>
            </div>
        </transition>
    </div>
</template>

<script>
    import Aside from '@/components/Aside/Aside'

    export default {
        name: 'App',
        components: {
            Aside
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /*text-align: center;*/
        /*color: #2c3e50;*/
        height: 100%;
        display: flex;
    }
    .aside{
        width: 240px!important;
        height: 100%;
        background-color: #d5d5d5;
    }
    .content{
        flex-grow: 1;
    }

</style>
