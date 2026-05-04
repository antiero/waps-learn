<script>
  export let type = 'wave';
  export let className = 'w-6 h-6';
</script>

{#if type === 'wave'}
  <svg class={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 12c2 0 2-8 4-8s2 16 4 16 2-16 4-16 2 8 4 8 2-4 4-4"/></svg>
{:else if type === 'filter'}
  <svg class={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h4l4 12 4-12h6"/><path d="M3 18h18"/></svg>
{:else}
  <svg class={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 20V8l5-4v16"/><path d="M8 8h5l3 12h5"/></svg>
{/if}
