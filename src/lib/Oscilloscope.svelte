<script>
  import { onMount } from 'svelte';
  export let analyser;
  let canvas;

  onMount(() => {
    let raf;
    const ctx = canvas.getContext('2d');

    const render = () => {
      raf = requestAnimationFrame(render);
      if (!analyser) return;
      const data = new Uint8Array(analyser.fftSize);
      analyser.getByteTimeDomainData(data);
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#22d3ee');
      gradient.addColorStop(1, '#38bdf8');
      ctx.lineWidth = 3;
      ctx.strokeStyle = gradient;
      ctx.beginPath();
      for (let i = 0; i < data.length; i++) {
        const x = (i / data.length) * width;
        const y = (data[i] / 255) * height;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    render();
    return () => cancelAnimationFrame(raf);
  });
</script>

<canvas bind:this={canvas} width="900" height="220" class="w-full h-32 rounded-xl bg-slate-900/50 dark:bg-slate-800/70"></canvas>
