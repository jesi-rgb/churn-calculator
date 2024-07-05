<script lang="ts">
    import { ssp, queryParam } from "sveltekit-search-params";
    import { onMount } from "svelte";

    export let name;
    export let min: undefined | number = undefined;
    export let max: undefined | number = undefined;
    export let value: number;
    export let step = 1;

    let id = name.replaceAll(" ", "").replaceAll(/[^a-zA-Z0-9]/g, "", "");

    const queryParamValue = queryParam(id, ssp.number());

    onMount(() => {
        if ($queryParamValue != null) {
            value = $queryParamValue;
        }
    });
</script>

<div
    class="gap-2 flex flex-col md:flex-row justify-between md:items-center mb-3"
>
    <label for={name} class="">{name}</label>
    <input
        id={name}
        class="md:w-1/2 w-full font-mono text-right input input-bordered input-sm"
        type="number"
        inputmode="numeric"
        min={min != undefined ? min : ""}
        max={max != undefined ? max : ""}
        {step}
        bind:value
        onClick="this.select()"
        on:change={() => {
            $queryParamValue = value;
        }}
    />
</div>
