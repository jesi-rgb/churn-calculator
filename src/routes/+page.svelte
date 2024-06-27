<script lang="ts">
    import Input from "$lib/components/Input.svelte";
    import Range from "$lib/components/Range.svelte";

    let nClients = 9000,
        ltv = 3600,
        churnRate = 0.1,
        churnRateGraphext = 0.05,
        nAccManagers = 200,
        nAccManagersGraphext = 60,
        accManagerSalary = 30000,
        years = 1;

    $: churnRateGraphext =
        churnRateGraphext <= churnRate ? churnRateGraphext : churnRate;

    $: accManagerSalaryYearly = Math.floor(accManagerSalary * 1.3);

    // delta meaning 1 year in all instances
    $: deltaRevenueChurned = nClients * ltv * churnRate;
    $: deltaCost = nAccManagers * accManagerSalaryYearly;

    $: deltaRevenueChurnGraphext = nClients * ltv * churnRateGraphext;
    $: deltaCostGraphext = nAccManagersGraphext * accManagerSalaryYearly;

    $: totalChurnedRevenue = deltaRevenueChurned * years;
    $: totalCost = deltaCost * years;

    $: totalRevenue = (nClients * ltv - nClients * ltv * churnRate) * years;
    $: totalRevenueGraphext =
        (nClients * ltv - nClients * ltv * churnRateGraphext) * years;

    $: totalRevenueChurnGraphext = deltaRevenueChurnGraphext * years;
    $: totalCostGraphext = deltaCostGraphext * years;

    //differences
    $: differenceChurnedRevenue =
        totalChurnedRevenue - totalRevenueChurnGraphext;

    $: differenceTotalCost = totalCost - totalCostGraphext;

    $: differenceRevenue = totalRevenueGraphext - totalRevenue;

    $: combinedDifference = differenceRevenue + differenceTotalCost;
</script>

<h1 class="text-center font-bold text-4xl">Churn Calculator</h1>

<div class="mx-auto text-sm md:text-base">
    <div class="overflow-x-auto">
        <table class="table table-xs md:table-lg tabular-nums">
            <thead>
                <tr class="text-right">
                    <th></th>
                    <th>Currently</th>
                    <th>Using Graphext</th>
                    <th>Difference</th>
                </tr>
            </thead>
            <tbody>
                <!-- row 1 -->
                <tr class="">
                    <th class="flex flex-col"
                        >Churned Revenue <span
                            class="text-xs font-semibold opacity-50"
                            >(money lost due to churn)</span
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
                <!-- row 2 -->
                <!-- row 3 -->
                <tr class="">
                    <th class="flex flex-col"
                        >Total Revenue <span
                            class="text-xs font-semibold opacity-50"
                            >(net amount of money earned)</span
                        >
                    </th>
                    <td class="text-right">{totalRevenue.toLocaleString()}€</td>
                    <td class="text-right"
                        >{totalRevenueGraphext.toLocaleString()}€</td
                    >
                    <td class="text-right font-semibold"
                        >{differenceRevenue.toLocaleString()}€</td
                    >
                </tr>

                <tr class="">
                    <th class="flex flex-col"
                        >Total Cost <span
                            class="text-xs font-semibold opacity-50"
                            >(money spent on salaries)</span
                        >
                    </th>
                    <td class="text-right">{totalCost.toLocaleString()}€</td>
                    <td class="text-right"
                        >{totalCostGraphext.toLocaleString()}€</td
                    >
                    <td class="text-right font-semibold"
                        >{differenceTotalCost.toLocaleString()}€</td
                    >
                </tr>

                <tr class="">
                    <th></th>
                    <td class="text-right"></td>
                    <td class="text-right font-bold">Total Amount Saved</td>
                    <td class="text-right font-semibold"
                        >{combinedDifference.toLocaleString()}€</td
                    >
                </tr>
            </tbody>
        </table>
    </div>

    <h2 class="font-bold text-2xl mt-5">Income</h2>
    <Input name="No. Clients" bind:value={nClients} min={0} step={10} />
    <Input name="Annual Contract Value" bind:value={ltv} min={0} step={10} />

    <div class="divider my-0"></div>
    <h2 class="font-bold text-2xl mt-5">Cost</h2>

    <Input
        name="Account Manager Salary (Annual)"
        bind:value={accManagerSalary}
        min={0}
        step={500}
    />

    <Input name="No. Acc Managers" bind:value={nAccManagers} min={0} />
    <Input
        name="No. Acc Managers (Graphext)"
        bind:value={nAccManagersGraphext}
        min={0}
    />

    <div class="mt-5 w-full">
        <Range
            min={0}
            max={1}
            step={0.01}
            name="Churn Rate"
            bind:value={churnRate}
            valueDisplay={(churnRate * 100).toFixed(0) + "%"}
        />
        <Range
            min={0}
            max={1}
            step={0.01}
            name="Churn Rate (Graphext)"
            bind:value={churnRateGraphext}
            valueDisplay={(churnRateGraphext * 100).toFixed(0) + "%"}
        />
        <Range
            min={1}
            max={100}
            step={1}
            name="Years"
            valueDisplay={years}
            bind:value={years}
        />
    </div>
</div>
