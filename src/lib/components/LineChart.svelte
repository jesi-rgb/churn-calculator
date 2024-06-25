<script>
    import { onMount } from 'svelte'
    import Chart from 'chart.js/auto'

    export let data = []
    export let labels = []
    export let title = 'Line Chart'

    let chartElement
    let chart

    onMount(() => {
        const ctx = chartElement.getContext('2d')
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: title,
                        data: data,
                        fill: false,
                        borderColor: 'rgb(75, 192, 192)',
                        tension: 0.1
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })

        return () => {
            chart.destroy()
        }
    })
</script>

<canvas height={100} bind:this={chartElement}></canvas>
