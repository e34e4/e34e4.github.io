import React from "react";
import "./MatrixRain.css";

// #region constants
// Katakana + latin + digits, like the classic "digital rain".
const GLYPHS =
  "アィウェオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const FONT_SIZE = 18;
const FONT = `${FONT_SIZE}px "Courier New", ui-monospace, monospace`;
const FRAME_INTERVAL = 66; // ms, ~15 fps is enough for the falling glyphs
const HEAD_COLOR = "#dcffe4";
const TAIL_COLOR = "rgba(0, 255, 90, 0.9)";
// #endregion

// #region component
/**
 * Canvas with the Matrix "digital rain", used as the background of the home page.
 * Based on the idea of https://github.com/jcubic/cmatrix, without the jQuery plugin.
 */
const MatrixRain = () => {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let columns = 0;
    let drops = [];
    let rafId = null;
    let lastFrame = 0;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = FONT;
      return { width, height };
    };

    const reset = () => {
      const { width, height } = size();
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      columns = Math.max(1, Math.floor(width / FONT_SIZE));
      // Start each column somewhere above the top edge, so they do not fall in a row.
      drops = new Array(columns)
        .fill(0)
        .map(() => Math.round((Math.random() * -height) / FONT_SIZE));
    };

    const draw = (time) => {
      rafId = window.requestAnimationFrame(draw);
      if (time - lastFrame < FRAME_INTERVAL) return;
      lastFrame = time;

      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      // Fade the previous frame, this is what creates the fading tail.
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = FONT;
      for (let column = 0; column < columns; column++) {
        const glyph = GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
        const x = column * FONT_SIZE;
        const y = drops[column] * FONT_SIZE;

        // The leading glyph is brighter than the rest of the tail.
        ctx.fillStyle = HEAD_COLOR;
        ctx.fillText(glyph, x, y - FONT_SIZE);
        ctx.fillStyle = TAIL_COLOR;
        ctx.fillText(glyph, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[column] = 0;
        }
        drops[column] += 1;
      }
    };

    const onResize = () => {
      reset();
      if (prefersReducedMotion) {
        // Draw a single static frame for users who do not want motion.
        ctx.font = FONT;
        ctx.fillStyle = TAIL_COLOR;
        for (let column = 0; column < columns; column++) {
          const glyph = GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
          ctx.fillText(glyph, column * FONT_SIZE, Math.random() * canvas.clientHeight);
        }
      }
    };

    reset();
    if (prefersReducedMotion) {
      onResize();
    } else {
      rafId = window.requestAnimationFrame(draw);
    }
    window.addEventListener("resize", onResize);

    return () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="matrix-rain" aria-hidden="true" />;
};
// #endregion

export default MatrixRain;
