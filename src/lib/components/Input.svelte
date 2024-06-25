<script lang="ts">
    export let name
    export let min
    export let max
    export let value
    export let step = 1
</script>

<div
    class="gap-2 p-1 flex flex-col md:flex-row justify-between md:items-center mb-3"
>
    <label for={name} class="">{name}</label>
    <input
        id={name}
        class="md:w-1/2 w-full font-mono text-right input input-bordered input-sm"
        type="number"
        inputmode="numeric"
        min={min != undefined ? min : ''}
        max={max != undefined ? max : ''}
        {step}
        bind:value
    />
</div>
