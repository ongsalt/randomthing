<script lang="ts">
    import { RICKROLL } from "$lib/constant";
    import Image from "./Image.svelte"
</script>

<main>
    <h1> Header </h1>
    <p> Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis magni adipisci sed quam reprehenderit vero blanditiis eius, eaque possimus sapiente ullam inventore, assumenda culpa rem repellendus. Iusto ad quos cupiditate! </p>
    <Image src="https://picsum.photos/1920/1080"/>
    <p> {RICKROLL} </p>
    <Image src="https://picsum.photos/1920/1080"/>
    <p> {RICKROLL} </p>
</main>

<style>
    main {
        max-width: 540px;
        margin: 2rem auto ;
    }
</style>