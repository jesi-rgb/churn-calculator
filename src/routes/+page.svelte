<script lang="ts">
    import Input from '$lib/components/Input.svelte'
    import Range from '$lib/components/Range.svelte'

    import LineChart from '$lib/components/LineChart.svelte'

    let nClients = 9000,
        ltv = 3600,
        churnRate = 0.1,
        churnRateGraphext = 0.05,
        nAccManagers = 200,
        nAccManagersGraphext = 60,
        accManagerSalary = 30000,
        months = 1

    $: data = Array(months)
        .fill(1)
        .map((e, i) => {
            return deltaRevenueChurned * (i + 1)
        })

    $: labels = Array(months)
        .fill(1)
        .map((e, i) => e + i * 1)

    $: accManagerSalaryMonthly = Math.floor(accManagerSalary * 1.3)

    $: deltaRevenueChurned = nClients * ltv * churnRate
    $: deltaCost = nAccManagers * accManagerSalaryMonthly

    $: deltaRevenueChurnGraphext = nClients * ltv * churnRateGraphext
    $: deltaCostGraphext = nAccManagersGraphext * accManagerSalaryMonthly

    $: totalChurnedRevenue = deltaRevenueChurned * months
    $: totalCost = deltaCost * months

    $: totalRevenue = (nClients * ltv - nClients * ltv * churnRate) * months
    $: totalRevenueGraphext =
        (nClients * ltv - nClients * ltv * churnRateGraphext) * months

    $: totalRevenueChurnGraphext = deltaRevenueChurnGraphext * months
    $: totalCostGraphext = deltaCostGraphext * months

    $: value = totalChurnedRevenue - totalCost
    $: valueGraphext = totalRevenueChurnGraphext - totalCostGraphext

    $: difference = totalChurnedRevenue - totalRevenueChurnGraphext
</script>

<h1 class="text-center font-bold text-4xl">Churn Calculator</h1>

<div class="w-3/4 mx-auto text-sm md:text-base">
    <section class="my-5 rounded-xl border border-primary/20 p-3 shadow-sm">
        <div class="flex flex-col md:flex-row justify-between">
            <div class="md:w-1/3">
                <div>Churned Revenue</div>
                <div
                    class="tooltip"
                    data-tip="Total amount of money lost due to clients that churned"
                >
                    <div class="font-bold text-xl font-mono text-error">
                        {totalChurnedRevenue.toLocaleString()}€
                    </div>
                </div>
            </div>

            <div class="md:w-1/3 md:text-center">
                <div>Churned Revenue Diff</div>
                <div class="font-bold text-xl font-mono">
                    {difference.toLocaleString()}€
                </div>
            </div>

            <div class="md:text-right md:w-1/3">
                <div>Churned Revenue (Graphext)</div>
                <div class="font-bold text-xl font-mono text-primary">
                    {totalRevenueChurnGraphext.toLocaleString()}€
                </div>
            </div>
        </div>

        <div class="flex flex-col md:flex-row justify-between mt-4">
            <div class="text-left">
                <div>
                    Total Revenue: <span class="font-bold font-mono"
                        >{totalRevenue.toLocaleString()}€</span
                    >
                </div>
                <div>
                    Total Cost: <span class="font-bold font-mono"
                        >{totalCost.toLocaleString()}€</span
                    >
                </div>
            </div>

            <div class="text-left md:text-right">
                <div>
                    Total Revenue (Graphext): <span class="font-bold font-mono"
                        >{totalRevenueGraphext.toLocaleString()}€</span
                    >
                </div>
                <div>
                    Total Cost (Graphext): <span class="font-bold font-mono"
                        >{totalCostGraphext.toLocaleString()}€</span
                    >
                </div>
            </div>
        </div>
    </section>

    <h2 class="font-bold text-2xl mt-5">Income</h2>
    <Input name="No. Clients" bind:value={nClients} min={0} step={10} />
    <Input name="LTV" bind:value={ltv} min={0} step={10} />

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
            valueDisplay={(churnRate * 100).toFixed(0) + '%'}
        />
        <Range
            min={0}
            max={1}
            step={0.01}
            name="Churn Rate (Graphext)"
            bind:value={churnRateGraphext}
            valueDisplay={(churnRateGraphext * 100).toFixed(0) + '%'}
        />
        <Range
            min={1}
            max={100}
            step={1}
            name="Years"
            valueDisplay={months}
            bind:value={months}
        />
    </div>
</div>
