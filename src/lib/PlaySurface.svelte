<script>
  import { createEventDispatcher } from 'svelte';
  export let mode;
  const dispatch = createEventDispatcher();
  let el;
  let point = { x: 0.5, y: 0.5, active: false };

  const update = (e) => {
    const r = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    point = { x, y, active: true };
    dispatch('move', { x, y });
  };

  const down = (e) => {
    el.setPointerCapture(e.pointerId);
    update(e);
    dispatch('start', { x: point.x, y: point.y });
    if (mode === 'envelope') dispatch('tap');
  };
  const move = (e) => point.active && update(e);
  const up = (e) => {
    point = { ...point, active: false };
    dispatch('end');
    el.releasePointerCapture(e.pointerId);
  };
</script>

<div bind:this={el} role="application" aria-label="Interactive play surface" class="relative h-[52vh] min-h-72 w-full touch-none overflow-hidden rounded-3xl bg-gradient-to-br from-sky-200 via-cyan-200 to-slate-100 dark:from-slate-800 dark:via-cyan-950 dark:to-slate-900" on:pointerdown={down} on:pointermove={move} on:pointerup={up} on:pointercancel={up}>
  {#if point.active}
    <div class="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-accent-400/70 shadow-lg" style={`left:${point.x * 100}%;top:${point.y * 100}%`} ></div>
  {/if}
</div>
