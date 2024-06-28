<script lang="ts">
    import type { Snapshot } from "./$types";
    import { encode } from "./lib";

    // should save to localstorage
    export const snapshot: Snapshot = {
        capture() {
            return { configString, morse, text };
        },
        restore(save) {
            configString = save.configString
            morse = save.morse
            text = save.text
        },
    };

    let configString = {
        dot: ".",
        dash: "-",
        separator: " ",
        letterSpacing: "1",
        wordSpacing: "2",
    };

    $: config = {
        dots: configString.dot.split(","),
        dashes: configString.dash.split(","),
        separators: configString.separator.split(","),
        letterSpacing: parseInt(configString.letterSpacing),
        wordSpacing: parseInt(configString.wordSpacing),
    };

    let morse = "";
    let text = "";
    let isError = false;

    $: try {
        isError = false;
        morse = encode(text, config);
    } catch {
        isError = true;
    }
</script>

<h1>Morse encoder</h1>
<p>international morse code only</p>
<p>
    if more than 1 value is supplied all values will be rotated after each use
</p>
<p>
    every field accept multiple value (use comma as separator; whitespace is
    significant)
</p>

<section>
    <div>
        <label for="dot">Dots</label>
        <input id="dot" type="text" bind:value={configString.dot} />
    </div>
    <div>
        <label for="dash">Dashes</label>
        <input id="dash" type="text" bind:value={configString.dash} />
    </div>
    <div>
        <label for="separator">Separator</label>
        <input id="separator" type="text" bind:value={configString.separator} />
    </div>
    <div>
        <label for="letter-spacing">Separator between letter amount</label>
        <input
            id="letter-spacing"
            type="number"
            bind:value={configString.letterSpacing}
        />
    </div>
    <div>
        <label for="word-spacing">Separator between word amount</label>
        <input
            id="word-spacing"
            type="number"
            bind:value={configString.wordSpacing}
        />
    </div>
</section>

<section>
    <div>
        <label for="input"> Text </label>
        <textarea bind:value={text} name="text" id="text" cols="50" rows="5"
        ></textarea>
    </div>
    <div>
        <label for="input"> Morse </label>
        <textarea bind:value={morse} name="morse" id="morse" cols="50" rows="5"
        ></textarea>
    </div>
    {#if isError}
        <p>Unsupported character</p>
    {/if}
</section>

<style>
    label {
        display: block;
    }

    section {
        border: 1px solid light-dark(#00000015, #ffffff40);
        padding: 1rem;
    }
</style>
