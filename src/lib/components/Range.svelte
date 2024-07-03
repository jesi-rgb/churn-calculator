<script lang="ts">
    export let name;

    export let value: number;

    export let valueDisplay;

    export let min = 0;
    export let max = 1;
    export let step = 0.01;
</script>

<div class="flex flex-col items-center w-full md:flex-row mb-2">
    <label for={name} class="w-full md:w-1/2"
        >{name}
        <span class="font-bold tabular-nums">{valueDisplay}</span></label
    >
    <input
        {name}
        class="range range-xs md:w-1/2"
        type="range"
        {min}
        {max}
        {step}
        bind:value
    />
</div>
