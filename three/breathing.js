export function addBreathingEffect(object) {
  let time = 0;
  let animationId = null;

  function breathe() {
    time += 0.02;
    object.position.y = Math.sin(time) * 0.03 - 1;
    animationId = requestAnimationFrame(breathe);
  }

  breathe();

  // Return cleanup function
  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  };
}
