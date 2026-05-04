<script>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { base } from '$app/paths';
  import { audioEngine } from '$lib/AudioEngine.js';
  import PlaySurface from '$lib/PlaySurface.svelte';
  import Oscilloscope from '$lib/Oscilloscope.svelte';
  import Icons from '$lib/Icons.svelte';

  export let initialMode = 'oscillator';

  const lessons = [
    { id: 'oscillator', icon: 'wave', label: 'Oscillator' },
    { id: 'filter', icon: 'filter', label: 'Filter' },
    { id: 'envelope', icon: 'adsr', label: 'Envelope' }
  ];

  let mode = initialMode;
  let dark = false;

  $: if (mode !== audioEngine.mode) audioEngine.setMode(mode);

  onMount(async () => {
    await audioEngine.init();
  });

  const pickMode = async (m) => {
    mode = m;
    await goto(`${base}/${m}`);
  };

  const start = async ({ detail }) => {
    await audioEngine.resume();
    if (mode !== 'envelope') audioEngine.startContinuous(detail.x, detail.y);
  };
  const move = ({ detail }) => {
    if (mode !== 'envelope') audioEngine.updateContinuous(detail.x, detail.y);
  };
  const end = () => mode !== 'envelope' && audioEngine.stop();
  const tap = async () => {
    if (mode !== 'envelope') return;
    await audioEngine.resume();
    audioEngine.triggerEnvelope();
  };
</script>

<main class="mx-auto flex min-h-screen max-w-5xl flex-col gap-4 p-4">
  <header class="flex items-center justify-between rounded-2xl bg-white/70 p-3 shadow-sm dark:bg-slate-900/70">
    <a class="flex items-center gap-2 text-xl font-semibold" href={`${base}/oscillator`}><span class="text-accent-500">WAPS</span> Learn</a>
    <nav class="flex gap-2" aria-label="Lesson modes">
      {#each lessons as lesson}
        <button class="min-h-11 min-w-11 rounded-xl p-2 {mode === lesson.id ? 'bg-accent-500 text-white' : 'bg-slate-200 dark:bg-slate-800'}" aria-label={lesson.label} on:click={() => pickMode(lesson.id)}>
          <Icons type={lesson.icon} />
        </button>
      {/each}
    </nav>
  </header>

  <section class="relative">
    <PlaySurface {mode} on:start={start} on:move={move} on:end={end} on:tap={tap} />
    <div class="pointer-events-none absolute bottom-3 left-3 right-3">
      <Oscilloscope analyser={audioEngine.analyser} />
    </div>
  </section>

  <footer class="flex items-center justify-between rounded-2xl bg-white/70 p-3 dark:bg-slate-900/70">
    <p class="text-sm text-slate-600 dark:text-slate-300">{mode[0].toUpperCase() + mode.slice(1)} mode</p>
    <button class="min-h-11 min-w-11 rounded-xl bg-slate-200 p-2 dark:bg-slate-800" aria-label="Toggle dark mode" on:click={() => { dark = !dark; document.documentElement.classList.toggle('dark', dark); }}>
      ◐
    </button>
  </footer>
</main>
