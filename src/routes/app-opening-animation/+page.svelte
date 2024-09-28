<script lang="ts">
    import { Spring } from "$lib/animation/spring";

    const xAnimator = new Spring(0, 100, .2);
    const x = xAnimator.getReadable();

    const yAnimator = new Spring(0, 100, .2);
    const y = yAnimator.getReadable();

    function setTarget(event: MouseEvent) {
        xAnimator.animateTo(event.clientX)
        yAnimator.animateTo(event.clientY)
    }

    $: positionCss = `top: ${$y}px; left: ${$x}px;`
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main on:click={setTarget}>
    <div class="box" style={positionCss}></div>
</main>

<style>
    main {
        position: fixed;
        inset: 0;
    }
    .box {
        position: fixed;
        background: #000;
        width: 1rem;
        height: 1rem;
    }
</style>
