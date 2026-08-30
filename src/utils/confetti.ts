export function fireConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
  };

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '999999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles: Array<{
    x: number;
    y: number;
    w: number;
    h: number;
    dx: number;
    dy: number;
    color: string;
    rotation: number;
    dRotation: number;
    alpha: number;
  }> = [];

  const colors = ['#38A37F', '#1B4938', '#A7E8C8', '#D8F3E5', '#F3EFE6', '#D4CBBF', '#FDEED9'];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height * 0.6,
      w: Math.random() * 8 + 6,
      h: Math.random() * 8 + 4,
      dx: (Math.random() - 0.5) * 18,
      dy: (Math.random() - 1) * 16 - 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      dRotation: (Math.random() - 0.5) * 10,
      alpha: 1,
    });
  }

  let animationFrameId: number;

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeParticles = 0;

    particles.forEach((p) => {
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.35; // gravity
      p.dx *= 0.98; // drag
      p.rotation += p.dRotation;
      p.alpha -= 0.008;

      if (p.alpha > 0) {
        activeParticles++;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    });

    if (activeParticles > 0) {
      animationFrameId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrameId);
      if (document.body.contains(canvas)) {
        document.body.removeChild(canvas);
      }
    }
  }

  render();
}
