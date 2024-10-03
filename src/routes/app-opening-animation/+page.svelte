<script lang="ts">
    import { GestureHandler } from "$lib/animation/gesture-handler";
    import type { Rect } from "$lib/animation/interface";
    import { Spring } from "$lib/animation/spring";
    import { SpringRect } from "$lib/animation/spring-rect";
    import { vec2d } from "$lib/animation/utils";

    /**
     * Note that everything is bottom anchored
     */

    let scalingFactor = 750;
    const iconBound: Rect = {
        x: 60,
        y: 600,
        height: 50,
        width: 50,
    };
    let iconBorderRadius = 10

    const appBound: Rect = {
        x: 20,
        y: 20,
        width: 300,
        height: 700,
    };
    let appBorderRadius = 42

    let isTargetHome = true;

    const stiffness = 225
    const dampingRatio = .95
    const boxAnimator = new SpringRect(iconBound, stiffness, dampingRatio);
    const borderRadiusAnimator = new Spring(iconBorderRadius, stiffness, dampingRatio);
    const borderRadius = borderRadiusAnimator.getReadable();
    const box = boxAnimator.getReadable();
    // TOD: handle negative size better
    $: boxStyle = `bottom: ${$box.y}px; left: ${$box.x}px; width: ${Math.abs($box.width)}px; height: ${Math.abs($box.height)}px; border-radius: ${$borderRadius}px`;
    const gestureHandler = new GestureHandler();

    gestureHandler.addBeforeStartListener(() => {
        gestureHandler.x = $box.x;
        gestureHandler.y = $box.y;
    });

    gestureHandler.addOnDragListener((position, _, displacement) => {
        if (!isTargetHome) {
            // TODO: proper mapping and decaying
            const scale = 1 - displacement.y / scalingFactor;
            const size = vec2d(appBound.width, appBound.height).multiply(scale);
            boxAnimator.setSize(size);
            position.x += (-(scale - 1) * appBound.width) / 2;
            // position.y += -(scale - 1) * appBound.height;
            borderRadiusAnimator.snapTo(appBorderRadius * scale);
            boxAnimator.moveTo(position);
        } else {
            boxAnimator.moveTo(position);
        }
    });

    gestureHandler.addOnReleaseListener((_, velocity) => {
        // TODO: determine if we should animate back to home or not

        isTargetHome = !isTargetHome;
        if (isTargetHome) {
            boxAnimator.animateTo(iconBound, velocity, scalingFactor / 50);
            borderRadiusAnimator.animateTo(iconBorderRadius);
        } else {
            boxAnimator.animateTo(appBound, velocity, scalingFactor / 50);
            borderRadiusAnimator.animateTo(appBorderRadius);
        }
    });

    function toggle() {
        isTargetHome = !isTargetHome;
        if (isTargetHome) {
            boxAnimator.animateTo(iconBound);
            borderRadiusAnimator.animateTo(iconBorderRadius);
        } else {
            boxAnimator.animateTo(appBound);
            borderRadiusAnimator.animateTo(appBorderRadius);
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<main>
    <section
        class="display"
        on:pointerup={gestureHandler.onPointerUp}
        on:pointermove={gestureHandler.onPointerMove}
    >
        <div
            class="box"
            style={boxStyle}
            on:pointerdown={gestureHandler.onPointerDown}
        >
            <!-- never gonna give you up -->
        </div>
    </section>
    <section class="control">
        <p>try dragging thing around</p>
        <h2>Settings</h2>
        <!-- <button> home </button> -->
        <!-- <button> app </button> -->
        <button on:click={toggle}> toggle </button> <br />
        scaling factor:<input type="number" bind:value={scalingFactor} />
        <div>
            <h3>Icon bound</h3>
            x:<input type="number" bind:value={iconBound.x} /><br />
            y:<input type="number" bind:value={iconBound.y} /><br />
            width:<input type="number" bind:value={iconBound.width} /><br />
            height:<input type="number" bind:value={iconBound.height} /><br />
        </div>
        <div>
            <h3>Screen bound</h3>
            x:<input type="number" bind:value={appBound.x} /><br />
            y:<input type="number" bind:value={appBound.y} /><br />
            width:<input type="number" bind:value={appBound.width} /><br />
            height:<input type="number" bind:value={appBound.height} /><br />
        </div>
        <p>settings will be applied next time you toggle</p>
        <hr />
        <h2>Status</h2>
        <p>
            x:{$box.x} <br />
            y:{$box.y} <br />
            width:{$box.width} <br />
            height:{$box.height}
        </p>
    </section>
</main>

<style>
    main {
        position: fixed;
        inset: 0;
        display: grid;
        grid-template-columns: 1fr auto;
    }

    .box {
        position: fixed;
        /* bottom: 0; */
        background: #e3e3e3;
        /* pointer-events: none; */
    }

    section.control {
        width: 200px;
        background-color: #f8f8f8;
        border-left: 1px solid #e3e3e3;
        padding: 1rem;
        box-sizing: border-box;
    }

    input {
        width: 80px;
    }
</style>
