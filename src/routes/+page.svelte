<script lang="ts">
    import Input from "$lib/components/Input.svelte";
    import Range from "$lib/components/Range.svelte";
    import Section from "$lib/components/Section.svelte";

    import { Tooltip } from "bits-ui";
    import { fly } from "svelte/transition";

    let hovered: boolean = false;

    let nClients = 9000,
        acv = 3600,
        estimatedLifeTime = 2,
        churnRate = 0.1,
        churnRateGraphext = 0.05,
        nAccManagers = 200,
        nAccManagersGraphext = 60,
        clientsPerManagerMonth = 20,
        topClientsAddressed = 0.7,
        valueLostNotAddressed = 0, //will be calculated
        percentageLostNotAddressed = 0.5, //will be calculated
        accManagerSalary = 30000,
        mer = 3,
        years = 0.5;

    $: nAccManagers = Math.ceil(nClients / clientsPerManagerMonth);
    $: nAccManagersGraphext = Math.ceil(
        (nClients * topClientsAddressed) / clientsPerManagerMonth,
    );

    $: churnRateGraphext =
        churnRateGraphext <= churnRate ? churnRateGraphext : churnRate;

    $: accManagerSalaryYearly = Math.floor(accManagerSalary * 1.3);

    // delta meaning 1 year in all instances
    $: deltaRevenueChurned = nClients * acv * churnRate;
    $: deltaCost = nAccManagers * accManagerSalaryYearly;

    $: deltaRevenueChurnGraphext = nClients * acv * churnRateGraphext;
    $: deltaCostGraphext = nAccManagersGraphext * accManagerSalaryYearly;

    $: totalChurnedRevenue = deltaRevenueChurned * years;
    $: totalCost = deltaCost * years;

    $: totalRevenue = (nClients * acv - nClients * acv * churnRate) * years;
    $: totalRevenueGraphext =
        (nClients * acv - nClients * acv * churnRateGraphext) * years;

    $: totalRevenueChurnGraphext = deltaRevenueChurnGraphext * years;
    $: totalCostGraphext = deltaCostGraphext * years;

    $: ltv = acv * estimatedLifeTime; // how much per year times how many years we assume
    $: ltvCurrentLoss = ltv * nClients * churnRate * years;
    $: ltvGraphextLoss = ltv * nClients * churnRateGraphext * years;

    $: clientsAddressed = nClients * topClientsAddressed;

    $: clientsNotAddressed = nClients * (1 - topClientsAddressed);

    $: valueLostNotAddressed =
        clientsNotAddressed * percentageLostNotAddressed * acv * years;

    // differences

    $: differenceChurnedRevenue =
        totalChurnedRevenue - totalRevenueChurnGraphext;

    $: differenceTotalCost = totalCost - totalCostGraphext;

    $: differenceRevenue = totalRevenueGraphext - totalRevenue;

    $: ltvLossDifference = ltvCurrentLoss - ltvGraphextLoss;

    $: combinedDifference = differenceTotalCost + ltvLossDifference;
</script>

<h1 class="font-bold text-4xl mb-3">Churn Calculator</h1>

<p class="opacity-50 mb-5 md:w-1/2">
    Calculate different metrics regarding customer churn and how much money is
    lost over time. Gain perspective on how much you can grow other aspects of
    your team.
</p>

<div class="flex gap-3 items-baseline justify-end mb-5">
    <div class="text-xl">Total Growth</div>

    <Tooltip.Root openDelay={0}>
        <Tooltip.Trigger>
            <div
                role="tooltip"
                on:focus={() => {
                    hovered = true;
                }}
                on:mouseover={() => {
                    hovered = true;
                }}
                on:mouseleave={() => {
                    hovered = false;
                }}
                class="text-3xl font-bold tabular-nums"
            >
                {combinedDifference.toLocaleString()}€
            </div>
        </Tooltip.Trigger>
        <Tooltip.Content
            transition={fly}
            transitionConfig={{ y: 8, duration: 150 }}
            sideOffset={0}
        >
            <div
                class="flex bg-base-100/90 border-base-content/30 items-center text-balance w-40 shadow-sm text-center justify-center rounded-input border p-3 text-sm outline-none"
            >
                Total amount is the sum of the two highlighted values
            </div>

            <Tooltip.Arrow
                class="rounded-[2px] border-l border-t border-base-content/30"
            />
        </Tooltip.Content>
    </Tooltip.Root>
</div>

<div class="mx-auto text-sm md:text-base">
    <div class="overflow-x-scroll">
        <table class="table table-xs md:table-md tabular-nums">
            <thead class="border border-base-content/30">
                <tr class="text-right border border-base-content/30">
                    <th></th>
                    <th>Currently</th>
                    <th>Using Graphext</th>
                    <th>Difference</th>
                </tr>
            </thead>
            <tbody class="border border-base-content/10">
                <tr class="border border-base-content/10">
                    <th class="flex flex-col transition-colors"
                        >Lifetime Value Lost <span
                            class="text-xs font-semibold opacity-50"
                            >(money lost due to churn based on estimated client
                            LTV)</span
                        >
                    </th>

                    <td class="text-right"
                        >{ltvCurrentLoss.toLocaleString()}€</td
                    >
                    <td class="text-right"
                        >{ltvGraphextLoss.toLocaleString()}€</td
                    >
                    <td class:hovered class="text-right font-semibold"
                        >{ltvLossDifference.toLocaleString()}€</td
                    >
                </tr>
                <tr class="border border-base-content/10">
                    <th class="flex flex-col"
                        >Total Cost <span
                            class="text-xs font-semibold opacity-50"
                            >(money spent in salaries in {years}
                            {years == 1 ? "year" : "years"})</span
                        >
                    </th>

                    <td class="text-right">{totalCost.toLocaleString()}€</td>
                    <td class="text-right"
                        >{totalCostGraphext.toLocaleString()}€</td
                    >

                    <td class:hovered class="text-right font-semibold"
                        >{differenceTotalCost.toLocaleString()}€</td
                    >
                </tr>
            </tbody>
        </table>
    </div>

    <Section>
        <Range
            min={0.25}
            max={5}
            step={0.25}
            name="Time elapsed (years)"
            valueDisplay={years}
            bind:value={years}
        />
    </Section>

    <div class="mt-5 md:grid md:grid-cols-2 md:gap-10">
        <div class="grid gap-5">
            <Section>
                <h2 class="font-bold text-2xl">Revenue</h2>
                <Input
                    name="№ Clients"
                    bind:value={nClients}
                    min={0}
                    step={10}
                />
                <Input
                    name="Annual Contract Value (avg)"
                    bind:value={acv}
                    min={0}
                    step={10}
                />

                <Input
                    name="Estimated Client Lifetime (years)"
                    bind:value={estimatedLifeTime}
                    min={0}
                    step={0.5}
                />
            </Section>

            <Section>
                <h2 class="font-bold text-2xl">Account Management Cost</h2>

                <Input
                    name="Account Manager Salary (annual)"
                    bind:value={accManagerSalary}
                    min={0}
                    step={500}
                />

                <Input
                    name="Clients per Acc. Manager (month)"
                    bind:value={clientsPerManagerMonth}
                    min={0}
                />

                <div class="flex justify-between pr-5 mb-3 tabular-nums">
                    <div>№ Acc Managers necessary to address every client</div>
                    <div class="font-semibold">
                        {nAccManagers}
                    </div>
                </div>

                <div class="flex justify-between pr-5 mb-3 tabular-nums">
                    <div>№ Acc Managers (with Predictive Model)</div>
                    <div class="font-semibold">
                        {nAccManagersGraphext}
                    </div>
                </div>

                <div class="divider"></div>

                <div class="mb-3">
                    <Range
                        name="Top % of clients addressed:"
                        bind:value={topClientsAddressed}
                        valueDisplay={`${(topClientsAddressed * 100).toFixed(0)}% of ${nClients} = ${clientsAddressed} clients`}
                        min={0.1}
                        max={0.8}
                        step={0.05}
                    ></Range>
                    <span class="text-sm opacity-50 -mt-9"
                        >The percentage of clients you're left with after the
                        model's classification
                    </span>
                </div>

                <div class="flex justify-between pr-5 mb-3 tabular-nums">
                    <div>
                        <div>Value lost due to unattended clients</div>
                        <span class="text-sm opacity-50">
                            Assuming {percentageLostNotAddressed * 100}% of
                            unattended clients leave
                        </span>

                        <input
                            type="range"
                            class="range range-xs"
                            min={0}
                            max={1}
                            step={0.1}
                            bind:value={percentageLostNotAddressed}
                        />
                    </div>

                    <div class="font-semibold">
                        {valueLostNotAddressed.toLocaleString() + "€"}
                    </div>
                </div>
            </Section>
        </div>

        <div class="grid h-fit gap-5">
            <Section>
                <h2 class="font-bold text-2xl">Marketing</h2>
                <div class="flex flex-col space-y-3">
                    <div>
                        MER (Marketing Efficiency Ratio) <span class="font-bold"
                            >{mer.toFixed(1)}</span
                        >
                    </div>
                    <input
                        type="range"
                        min={1}
                        max={10}
                        step={0.1}
                        class="range range-xs"
                        bind:value={mer}
                    />
                </div>

                <div class="flex justify-between pr-5 mt-3 tabular-nums">
                    <div>
                        <div>Value obtained from reinvestment in marketing</div>
                    </div>

                    <div class="font-semibold">
                        {(combinedDifference * mer).toLocaleString() + "€"}
                    </div>
                </div>
            </Section>

            <Section>
                <h2 class="font-bold text-2xl">Churn</h2>
                <div class="w-full">
                    <Range
                        min={0}
                        max={0.4}
                        step={0.01}
                        name="Churn Rate (annual)"
                        bind:value={churnRate}
                        valueDisplay={(churnRate * 100).toFixed(0) + "%"}
                    />
                    <Range
                        min={0}
                        max={0.4}
                        step={0.01}
                        name="Churn Rate (annual, with Predictive Model)"
                        bind:value={churnRateGraphext}
                        valueDisplay={(churnRateGraphext * 100).toFixed(0) +
                            "%"}
                    />
                </div>
            </Section>
        </div>
    </div>
</div>

<style>
    .hovered {
        @apply text-primary transition-all duration-100 transform -translate-y-1;
    }
</style>
