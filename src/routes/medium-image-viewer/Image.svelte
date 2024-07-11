<script lang="ts">
    import { onDestroy, onMount } from "svelte";

    export let src: string;
    export let alt: string = "test";
    export let expanded = false;

    let container: HTMLDivElement;
    let left = 0;
    let top = 0;
    let scrollX = 0;
    let scrollY = 0;

    $: expandedStyles = `width: 100vw; border-radius: 0; z-index: 999;left: ${scrollX - left}px; top: ${scrollY - top}px`;
    $: style = expanded ? expandedStyles : "";

    onMount(() => {
        resetRect();

        document.addEventListener("scroll", onScroll);
        window.addEventListener("resize", resetRect);
        
        return () => {
            window.removeEventListener("resize", resetRect);
            document.removeEventListener("scroll", onScroll);
        };
    });

    function onScroll() {
        if (expanded) {
            expanded = false;
        } else {
            scrollX = window.scrollX;
            scrollY = window.scrollY;
            console.log(scrollX, scrollY);
        }
    }

    function resetRect() {
        const rects = container.getClientRects();
        left = rects[0].left;
        top = rects[0].top;
    }

    function toggle() {
        expanded = !expanded;
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<!-- svelte-ignore a11y-role-supports-aria-props -->
<div bind:this={container}>
    <img {style} {src} {alt} on:click={toggle} aria-expanded={expanded} />
</div>

<style>
    div {
        width: 100%;
        /* Need at least the dimensions of the image  */
        aspect-ratio: 16/9;
        position: relative;
    }

    img {
        background-color: #00000010;
        border-radius: 0.75rem;
        inset: 0;
        position: absolute;
        transition: all 0.5s cubic-bezier(0.215, 0.610, 0.355, 1);
        border-radius: 0.75rem;
        width: 100%;
        object-fit: contain;
        display: block;
    }
</style>
