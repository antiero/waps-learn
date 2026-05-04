<script>
  import LessonApp from '$lib/LessonApp.svelte';
  export let data;
</script>

<svelte:head><title>WAPS Learn • {data.lesson}</title></svelte:head>
<LessonApp initialMode={data.lesson} />
