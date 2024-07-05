<script lang="ts">
    import Input from "$lib/components/Input.svelte";
    import Range from "$lib/components/Range.svelte";
    import Section from "$lib/components/Section.svelte";

    import { Tooltip } from "bits-ui";
    import { fly, fade } from "svelte/transition";

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
        cumulativeChurnNotAddresed = 0.04, //will be calculated
        percentageActuallyChurns = 0.5,
        accManagerSalary = 30000,
        mer = 3,
        percentageInvestedMarketing = 0.6,
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
        clientsNotAddressed *
        cumulativeChurnNotAddresed *
        percentageActuallyChurns *
        acv *
        years;

    // differences

    // $: differenceChurnedRevenue =
    //     totalChurnedRevenue - totalRevenueChurnGraphext;
    //
    // $: differenceRevenue = totalRevenueGraphext - totalRevenue;

    $: differenceTotalCost = totalCost - totalCostGraphext;

    $: ltvLossDifference = ltvCurrentLoss - ltvGraphextLoss;

    $: combinedDifference =
        differenceTotalCost + ltvLossDifference - valueLostNotAddressed;

    $: totalMarketingReturn =
        differenceTotalCost * mer * percentageInvestedMarketing;

    $: totalAnswer =
        ltvLossDifference + totalMarketingReturn - valueLostNotAddressed;
</script>

<head>
    <title>Churn Calculator</title>

    <meta charset="UTF-8" />
    <meta
        name="description"
        content="Churn Calculator: calculate different metrics regarding churn."
    />
    <meta name="keywords" content="Churn, Lead Scoring, Finance" />
    <meta name="author" content="Jesús Rascón, Andrés Lozano – Graphext" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<h1 class="font-bold text-4xl mb-3">Churn Calculator</h1>

<p class="opacity-50 mb-5 md:w-1/2">
    Calculate different metrics regarding customer churn and how much money is
    lost over time. Gain perspective on how much you can grow other aspects of
    your team with the help of our models.
</p>

<div
    class="flex flex-col md:flex-row text-center px-3 gap-3 mb-5 sticky bg-base-100/80 border border-base-content/10 shadow-md shadow-base-content/10 rounded-box backdrop-blur z-1 top-0 py-5"
>
    <div class="w-fit mx-auto">
        <div class="text-xl">Total Growth</div>
        <Tooltip.Root openDelay={0}>
            <Tooltip.Content
                transition={fly}
                transitionConfig={{ y: 8, duration: 150 }}
                sideOffset={0}
            >
                <div
                    class="bg-base-100 border-base-content/30 items-center w-[300px] shadow-sm rounded-btn border p-3 text-sm outline-none z-20"
                >
                    Total growth corresponds to:
                    <ol class="list list-disc list-inside">
                        <li>+ Churn Improvement Difference</li>
                        <li>+ Marketing Reinvestment Value</li>
                        <li>– Potential Value Lost</li>
                    </ol>
                </div>

                <Tooltip.Arrow
                    class="rounded-[2px] border-l border-t border-base-content/30"
                />
            </Tooltip.Content>
            <Tooltip.Trigger>
                {#key totalAnswer}
                    <div
                        class="text-3xl tabular-nums inline-block font-bold z-30"
                    >
                        {Math.round(totalAnswer).toLocaleString()}€
                    </div>
                {/key}
            </Tooltip.Trigger>
        </Tooltip.Root>
    </div>
</div>

<div class="mx-auto text-sm md:text-base">
    <table class="table table-xs md:table-md tabular-nums mb-5 -z-10">
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
                    >Churn Improvement<span
                        class="text-xs font-semibold opacity-50"
                        >(money lost due to churn based on estimated client LTV)</span
                    >
                </th>

                <td class="text-right">{ltvCurrentLoss.toLocaleString()}€</td>
                <td class="text-right">{ltvGraphextLoss.toLocaleString()}€</td>
                <td class="text-right font-semibold text-primary"
                    >{ltvLossDifference.toLocaleString()}€</td
                >
            </tr>
            <tr class="border border-base-content/10">
                <th class="flex flex-col"
                    >Resource Shift<span
                        class="text-xs font-semibold opacity-50"
                        >(money saved in salaries in {years}
                        {years == 1 ? "year" : "years"})</span
                    >
                </th>

                <td class="text-right">{totalCost.toLocaleString()}€</td>
                <td class="text-right">{totalCostGraphext.toLocaleString()}€</td
                >

                <td class="text-right font-semibold text-primary"
                    >{differenceTotalCost.toLocaleString()}€</td
                >
            </tr>
            <tr class="border border-base-content/10">
                <th class="flex flex-col"
                    >Potential Value lost<span
                        class="text-xs font-semibold opacity-50"
                        >due to unattended clients</span
                    >
                </th>

                <td class="text-right"></td>
                <td class="text-right text-error"
                    >{valueLostNotAddressed.toLocaleString()}€</td
                >

                <td class="text-right font-semibold"></td>
            </tr>
        </tbody>
    </table>

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

    <div class="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div class="flex flex-col gap-5">
            <Section>
                <h2 class="font-bold text-2xl mb-3">Revenue</h2>
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
                <h2 class="font-bold text-2xl mb-3">Resource Shift</h2>

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

                <div class=" mb-3 tabular-nums">
                    <div class="flex justify-between">
                        <div>
                            № Acc Managers necessary to address every client
                        </div>
                        <div class="font-semibold">
                            {nAccManagers}
                        </div>
                    </div>
                    <div class="text-sm opacity-70 tabular-nums">
                        Account managers needed to deal with {nClients} clients
                    </div>
                </div>

                <div class=" mb-3 tabular-nums">
                    <div class="flex justify-between">
                        <div>№ Acc Managers (with Predictive Model)</div>
                        <div class="font-semibold">
                            {nAccManagersGraphext}
                        </div>
                    </div>
                    <div class="text-sm opacity-70 tabular-nums">
                        Account managers needed to deal with {clientsAddressed} clients
                    </div>
                </div>

                <div class="flex justify-between mb-3 tabular-nums">
                    <div>Difference</div>
                    <div class="font-semibold">
                        {nAccManagers - nAccManagersGraphext}
                    </div>
                </div>
                <div class="mb-3 tabular-nums">
                    <div class="flex justify-between">
                        <div>Savings (yearly)</div>
                        <div class="font-semibold tabular-nums text-primary">
                            {(
                                (nAccManagers - nAccManagersGraphext) *
                                accManagerSalaryYearly *
                                years
                            ).toLocaleString() + "€"}
                        </div>
                    </div>
                    <div class="opacity-70 text-sm">
                        Resources available for reallocation in other areas
                    </div>
                </div>
            </Section>
        </div>

        <div class="flex flex-col h-fit gap-5">
            <Section>
                <h2 class="font-bold text-2xl mb-3">Churn Simulation</h2>
                <div class="w-full">
                    <Range
                        min={0}
                        max={0.4}
                        step={0.01}
                        name="Current Churn Rate (annual)"
                        bind:value={churnRate}
                        valueDisplay={(churnRate * 100).toFixed(0) + "%"}
                    />
                    <Range
                        min={0}
                        max={0.4}
                        step={0.01}
                        name="Predicted Churn Rate (annual)"
                        bind:value={churnRateGraphext}
                        valueDisplay={(churnRateGraphext * 100).toFixed(0) +
                            "%"}
                    />
                </div>
            </Section>

            <Section>
                <h2 class="font-bold text-2xl mb-3">Marketing Efficiency</h2>

                <Range
                    min={1}
                    max={10}
                    step={0.1}
                    bind:value={mer}
                    valueDisplay={mer.toFixed(1)}
                    name="MER (Marketing Efficiency Ratio)"
                ></Range>

                <Range
                    min={0}
                    max={1}
                    step={0.01}
                    bind:value={percentageInvestedMarketing}
                    valueDisplay={(percentageInvestedMarketing * 100).toFixed(
                        0,
                    ) + "%"}
                    name="% reinvested into Marketing"
                ></Range>

                <div class="flex justify-between mt-5 tabular-nums">
                    <div>
                        <div>Value obtained from reinvestment in marketing</div>
                    </div>

                    <div class="font-semibold text-primary">
                        {Math.round(totalMarketingReturn).toLocaleString() +
                            "€"}
                    </div>
                </div>
            </Section>

            <Section>
                <h2 class="font-bold text-2xl mb-3">
                    Predictive Model Simulation
                </h2>
                <div class="mb-3">
                    <Range
                        name="Top % of clients addressed:"
                        bind:value={topClientsAddressed}
                        valueDisplay={(topClientsAddressed * 100).toFixed(0) +
                            "%"}
                        min={0.1}
                        max={0.8}
                        step={0.05}
                    >
                        <span slot="description" class="text-sm opacity-50"
                            >The percentage of clients you're left with after
                            the model's classification: <b
                                >{Math.ceil(clientsAddressed)}</b
                            > clients
                        </span>
                    </Range>
                </div>

                <Range
                    name="Total Churn Predicted for unattended clients"
                    bind:value={cumulativeChurnNotAddresed}
                    valueDisplay={(cumulativeChurnNotAddresed * 100).toFixed(
                        0,
                    ) + "%"}
                    min={0.0}
                    max={0.6}
                    step={0.01}
                >
                    <div
                        slot="description"
                        class="text-sm opacity-50 tabular-nums"
                    >
                        <b>{Math.round(clientsNotAddressed)}</b> unattended
                        clients have a total churn probability of {(
                            cumulativeChurnNotAddresed * 100
                        ).toFixed(0)}%
                    </div>
                </Range>

                <Range
                    name="Percentage of clients actually leaving"
                    min={0}
                    max={1}
                    step={0.01}
                    bind:value={percentageActuallyChurns}
                    valueDisplay={(percentageActuallyChurns * 100).toFixed(0) +
                        "%"}
                >
                    <div slot="description" class="text-sm opacity-50">
                        Out of those we are leaving unattended, weighing in the
                        predicted churn probability
                    </div>
                </Range>

                <div class="flex justify-between tabular-nums">
                    <div>
                        <div>Value lost due to unattended clients</div>
                        <span class="text-sm tabular-nums opacity-50">
                            <b
                                >{Math.round(
                                    clientsNotAddressed *
                                        percentageActuallyChurns *
                                        cumulativeChurnNotAddresed,
                                )}</b
                            > clients would actually leave
                        </span>
                    </div>

                    <div class="font-semibold text-error">
                        {Math.round(valueLostNotAddressed).toLocaleString() +
                            "€"}
                    </div>
                </div>
            </Section>
        </div>
    </div>
</div>

<style>
    li {
        list-style-type: "   ";
    }
</style>
