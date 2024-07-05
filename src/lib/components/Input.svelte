<script lang="ts">
    import { queryParam } from "sveltekit-search-params";

    export let name;
    export let min: undefined | number = undefined;
    export let max: undefined | number = undefined;
    export let value: number;
    export let step = 1;

    let id = name
        .toLowerCase()
        .replaceAll(" ", "")
        .replaceAll(/[^a-zA-Z0-9]/g, "", "");

    const queryParamValue = queryParam(id);

    $: $queryParamValue = value.toString();
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
    />
</div>
