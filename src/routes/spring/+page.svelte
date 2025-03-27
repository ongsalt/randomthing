<script lang="ts">
    import { Spring } from "$lib/animation/spring";

    const xAnimator = new Spring(0, 150, .8);
    const x = xAnimator.getReadable();

    const yAnimator = new Spring(0, 150, .8);
    const y = yAnimator.getReadable();

    function reposition(event: MouseEvent) {
        xAnimator.animateTo(event.clientX)
        yAnimator.animateTo(event.clientY)
    }

    let positionCss = $derived(`top: ${$y}px; left: ${$x}px;`)
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<main onpointerdown={reposition}>
    <div class="box" style={positionCss}></div>
    <p> Try clicking somewhere in this page </p>
</main>


<style>
    main {
        inset: 0;
        position: fixed;

        &>p {
            font-size: 5rem;
            opacity: .1;
            pointer-events: none;
        }
    }

    .box {
        position: fixed;
        width: 1rem;
        height: 1rem;
        background-color: black;
    }
</style>