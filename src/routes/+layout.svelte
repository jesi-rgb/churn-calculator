<script>
    import "../app.css";
    import Footer from "$lib/components/Footer.svelte";
</script>

<main class="my-10 mx-auto w-[95%] max-w-5xl transition-all">
    <slot />
    <Footer />
</main>
