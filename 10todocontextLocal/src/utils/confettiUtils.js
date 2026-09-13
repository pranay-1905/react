import confetti from "canvas-confetti";

/**
 * Enhanced, crisp confetti burst from the clicked checkbox location
 */
export const triggerTaskConfetti = (event) => {
  let x = 0.5;
  let y = 0.5;

  if (event && event.target) {
    const rect = event.target.getBoundingClientRect();
    x = (rect.left + rect.width / 2) / window.innerWidth;
    y = (rect.top + rect.height / 2) / window.innerHeight;
  }

  // Primary colorful burst
  confetti({
    particleCount: 35,
    spread: 65,
    origin: { x, y },
    colors: ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4"],
    ticks: 90,
    gravity: 1,
    startVelocity: 24,
    scalar: 0.85,
    disableForReducedMotion: true,
  });

  // Secondary soft sparkle pop for depth
  setTimeout(() => {
    confetti({
      particleCount: 15,
      spread: 80,
      origin: { x, y },
      colors: ["#34d399", "#a78bfa", "#fde047"],
      ticks: 70,
      gravity: 1.3,
      startVelocity: 16,
      scalar: 0.7,
      disableForReducedMotion: true,
    });
  }, 60);
};
