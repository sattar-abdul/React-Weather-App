import { useEffect, useRef } from "react";

const rand = (min, max) => Math.random() * (max - min) + min;

const createRain = (count, width, height) =>
  Array.from({ length: count }, () => ({
    x: rand(0, width),
    y: rand(-height, height),
    vx: rand(-0.4, 0.1),
    vy: rand(4.5, 8.5),
    len: rand(10, 18),
    alpha: rand(0.25, 0.5),
  }));

const createSnow = (count, width, height) =>
  Array.from({ length: count }, () => ({
    x: rand(0, width),
    y: rand(-height, height),
    r: rand(0.8, 2.2),
    vx: rand(-0.25, 0.25),
    vy: rand(0.35, 0.9),
    drift: rand(0, Math.PI * 2),
    alpha: rand(0.4, 0.9),
  }));

const createFog = (count, width, height) =>
  Array.from({ length: count }, () => ({
    x: rand(-200, width),
    y: rand(height * 0.2, height * 0.8),
    r: rand(120, 260),
    speed: rand(0.02, 0.08),
    alpha: rand(0.08, 0.18),
  }));

export default function WeatherEffectsCanvas({ effect }) {
  const canvasRef = useRef(null);
  const lastTimeRef = useRef(0);
  const stateRef = useRef({
    type: "",
    particles: [],
    fog: [],
    lightningAlpha: 0,
    nextLightningAt: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const { innerWidth, innerHeight, devicePixelRatio } = window;
      canvas.width = innerWidth * devicePixelRatio;
      canvas.height = innerHeight * devicePixelRatio;
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      const type = effect?.type ?? "";
      const particleCount = Math.floor((innerWidth * innerHeight) / 12000);
      stateRef.current.particles =
        type === "rain"
          ? createRain(particleCount * 6, innerWidth, innerHeight)
          : type === "snow"
          ? createSnow(particleCount * 3, innerWidth, innerHeight)
          : [];

      stateRef.current.fog =
        type === "mist"
          ? createFog(12, innerWidth, innerHeight)
          : [];
    };

    resize();
    window.addEventListener("resize", resize);

    let animationId = 0;
    const draw = () => {
      const now = performance.now();
      const last = lastTimeRef.current || now;
      const dt = Math.min(0.05, (now - last) / 1000);
      lastTimeRef.current = now;

      const type = effect?.type ?? "";
      const isHeavyRain = Boolean(effect?.heavyRain);
      const { innerWidth: w, innerHeight: h } = window;
      ctx.clearRect(0, 0, w, h);

      if (type === "rain") {
        ctx.lineWidth = 1.1;
        stateRef.current.particles.forEach((p) => {
          ctx.strokeStyle = `rgba(255,255,255,${p.alpha})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.vx * 2, p.y + p.len);
          ctx.stroke();

          p.x += p.vx;
          p.y += p.vy;
          if (p.y > h + 20 || p.x < -20) {
            p.x = rand(0, w);
            p.y = rand(-h * 0.3, 0);
          }
        });
        if (isHeavyRain) {
          const now = performance.now();
          if (now > stateRef.current.nextLightningAt) {
            stateRef.current.lightningAlpha = rand(0.6, 1);
            stateRef.current.nextLightningAt = now + rand(2500, 6500);
          }
          stateRef.current.lightningAlpha = Math.max(
            0,
            stateRef.current.lightningAlpha - 0.06
          );
          if (stateRef.current.lightningAlpha > 0) {
            ctx.fillStyle = `rgba(255,255,255,${
              stateRef.current.lightningAlpha * 0.6
            })`;
            ctx.fillRect(0, 0, w, h);
          }
        }
      } else if (type === "snow") {
        stateRef.current.particles.forEach((p) => {
          ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();

          p.drift += 0.008;
          p.x += p.vx + Math.sin(p.drift) * 0.28;
          p.y += p.vy;
          if (p.y > h + 10) {
            p.y = rand(-40, -10);
            p.x = rand(0, w);
          }
        });
      } else if (type === "mist") {
        ctx.save();
        ctx.filter = "blur(18px)";
        stateRef.current.fog.forEach((f) => {
          const gradient = ctx.createRadialGradient(
            f.x,
            f.y,
            10,
            f.x,
            f.y,
            f.r
          );
          gradient.addColorStop(0, `rgba(255,255,255,${f.alpha})`);
          gradient.addColorStop(1, "rgba(255,255,255,0)");
          ctx.fillStyle = gradient;
          ctx.fillRect(f.x - f.r, f.y - f.r, f.r * 2, f.r * 2);

          f.x += f.speed;
          if (f.x > w + 200) f.x = -200;
        });
        ctx.restore();
      } else if (type === "clear") {
        const gradient = ctx.createRadialGradient(
          w * 0.18,
          h * 0.2,
          20,
          w * 0.18,
          h * 0.2,
          220
        );
          const pulse = 0.5 + Math.sin(Date.now() / 2000) * 0.2;
        gradient.addColorStop(0, `rgba(255,255,255,${0.35 * pulse})`);
        gradient.addColorStop(0.4, `rgba(255,255,255,${0.2 * pulse})`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
      }

      animationId = window.requestAnimationFrame(draw);
    };

    animationId = window.requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationId);
    };
  }, [effect]);

  return <canvas ref={canvasRef} className="weather-canvas" />;
}
