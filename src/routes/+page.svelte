<script lang="ts">
    import Input from "$lib/components/Input.svelte";
    import Range from "$lib/components/Range.svelte";

    let hovered: boolean = false;

    let nClients = 9000,
        acv = 3600,
        estimatedLifeTime = 2,
        churnRate = 0.1,
        churnRateGraphext = 0.05,
        nAccManagers = 200,
        nAccManagersGraphext = 60,
        clientsPerManagerMonth = 20,
        accManagerSalary = 30000,
        years = 1;

    $: churnRateGraphext =
        churnRateGraphext <= churnRate ? churnRateGraphext : churnRate;

    $: clientsPerManagerYear = clientsPerManagerMonth * 12;

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

    $: ltv = acv * estimatedLifeTime; //how much per year times how many years we assume
    $: ltvCurrentLoss = ltv * nClients * churnRate;
    $: ltvGraphextLoss = ltv * nClients * churnRateGraphext;

    //differences
    $: differenceChurnedRevenue =
        totalChurnedRevenue - totalRevenueChurnGraphext;

    $: differenceTotalCost = totalCost - totalCostGraphext;

    $: differenceRevenue = totalRevenueGraphext - totalRevenue;

    $: ltvLossDifference = ltvCurrentLoss - ltvGraphextLoss;

    $: combinedDifference =
        differenceRevenue + differenceTotalCost + ltvLossDifference;
</script>

<h1 class="font-bold text-4xl mb-5">Churn Calculator</h1>

<div class="flex gap-3 items-baseline justify-end mb-5">
    <div class="text-xl">Total Amount Saved</div>
    <div
        class="tooltip"
        data-tip="Total amount is the sum of the highlighted blue values"
    >
        <div
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
    </div>
</div>
<div class="mx-auto text-sm md:text-base">
    <div class="overflow-x-auto">
        <table class="table table-xs border md:table-lg tabular-nums">
            <thead>
                <tr class="text-right">
                    <th></th>
                    <th>Currently</th>
                    <th>Using Graphext</th>
                    <th>Difference</th>
                </tr>
            </thead>
            <tbody>
                <tr class="">
                    <th class="flex flex-col"
                        >Churned Revenue <span
                            class="text-xs font-semibold opacity-50"
                            >(money lost due to churn over {years}
                            {years == 1 ? "year" : "years"})</span
                        >
                    </th>
                    <td class="text-right text-error"
                        >{totalChurnedRevenue.toLocaleString()}€</td
                    >
                    <td class="text-right text-primary"
                        >{totalRevenueChurnGraphext.toLocaleString()}€</td
                    >
                    <td class="text-right font-semibold"
                        >{differenceChurnedRevenue.toLocaleString()}€</td
                    >
                </tr>
                <tr class="">
                    <th class="flex flex-col"
                        >Total Revenue <span
                            class="text-xs font-semibold opacity-50"
                            >(net amount of money earned over {years}
                            {years == 1 ? "year" : "years"})</span
                        >
                    </th>
                    <td class="text-right">{totalRevenue.toLocaleString()}€</td>
                    <td class="text-right"
                        >{totalRevenueGraphext.toLocaleString()}€</td
                    >
                    <td class:hovered class="text-right font-semibold"
                        >{differenceRevenue.toLocaleString()}€</td
                    >
                </tr>

                <tr class="">
                    <th class="flex flex-col"
                        >Total Cost <span
                            class="text-xs font-semibold opacity-50"
                            >(money spent on salaries in {years}
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
                <tr class="">
                    <th class="flex flex-col transition-colors"
                        >Lifetime Value Lost <span
                            class="text-xs font-semibold opacity-50"
                            >(fraction lost due to churn based on estimated
                            client LTV)</span
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
            </tbody>
        </table>
    </div>

    <h2 class="font-bold text-2xl mt-5">Revenue</h2>
    <Input name="№ Clients" bind:value={nClients} min={0} step={10} />
    <Input
        name="Annual Contract Value (avg)"
        bind:value={acv}
        min={0}
        step={10}
    />

    <Input
        name="Estimated Client Lifetime"
        bind:value={estimatedLifeTime}
        min={0}
        step={0.5}
    />

    <h2 class="font-bold text-2xl mt-5">Churn</h2>
    <div class="w-full">
        <Range
            min={0}
            max={1}
            step={0.01}
            name="Churn Rate (annual)"
            bind:value={churnRate}
            valueDisplay={(churnRate * 100).toFixed(0) + "%"}
        />
        <Range
            min={0}
            max={1}
            step={0.01}
            name="Churn Rate (annual, with Predictive Model)"
            bind:value={churnRateGraphext}
            valueDisplay={(churnRateGraphext * 100).toFixed(0) + "%"}
        />
        <Range
            min={0.5}
            max={100}
            step={0.5}
            name="Years"
            valueDisplay={years}
            bind:value={years}
        />
    </div>

    <h2 class="font-bold text-2xl mt-5">Cost</h2>
    <Input
        name="Account Manager Salary (Annual)"
        bind:value={accManagerSalary}
        min={0}
        step={500}
    />

    <Input name="№ Acc Managers" bind:value={nAccManagers} min={0} />
    <Input
        name="№ Acc Managers (with Model)"
        bind:value={nAccManagersGraphext}
        min={0}
    />

    <Input
        name="Clients per Acc. Manager (month)"
        bind:value={clientsPerManagerMonth}
        min={0}
    />
</div>

<style>
    .hovered {
        @apply text-primary transition-all duration-100 transform -translate-y-1;
    }
</style>
