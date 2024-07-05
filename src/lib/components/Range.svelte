<script lang="ts">
    import { onMount } from "svelte";
    import { ssp, queryParam } from "sveltekit-search-params";

    export let name;

    export let value: number;

    let id = name.replaceAll(" ", "").replaceAll(/[^a-zA-Z0-9]/g, "", "");

    const queryParamValue = queryParam(id, ssp.number());

    onMount(() => {
        if ($queryParamValue != null) {
            value = $queryParamValue;
        }
    });

    export let valueDisplay;

    export let min = 0;
    export let max = 1;
    export let step = 0.01;
</script>

<div class="">
    <div class="w-full mb-1">
        <div class="flex justify-between">
            <label for={name} class="w-full">{name}</label>
            <span class="font-bold tabular-nums text-right">{valueDisplay}</span
            >
        </div>
        <input
            {name}
            class="range range-xs"
            type="range"
            {min}
            {max}
            {step}
            bind:value
            on:change={() => {
                $queryParamValue = value;
            }}
        />
    </div>
    <div class="text-balance">
        <slot name="description"></slot>
    </div>
</div>
