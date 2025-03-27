<script lang="ts">
    import { onDestroy, onMount } from "svelte";

    interface Props {
        src: string;
        alt?: string;
        expanded?: boolean;
    }

    let { src, alt = "test", expanded = $bindable(false) }: Props = $props();

    let container: HTMLDivElement = $state();
    let left = $state(0);
    let top = $state(0);
    let scrollX = $state(0);
    let scrollY = $state(0);

    let expandedStyles = $derived(`width: 100vw; border-radius: 0; z-index: 999;left: ${scrollX - left}px; top: ${scrollY - top}px`);
    let style = $derived(expanded ? expandedStyles : "");

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
        onScroll()
        const rects = container.getClientRects();
        left = rects[0].left;
        top = rects[0].top;
    }

    function toggle() {
        expanded = !expanded;
    }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_role_supports_aria_props -->
<div bind:this={container}>
    <img {style} {src} {alt} onclick={toggle} aria-expanded={expanded} />
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
