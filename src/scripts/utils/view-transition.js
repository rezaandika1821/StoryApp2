// Fungsi transisi custom dengan Animation API (jika tersedia)
export async function withViewTransition(callback) {
  const mainContent = document.querySelector('#main-content');
  if (!mainContent) {
    await callback();
    return;
  }

  // Jika Animation API tersedia, gunakan animasi custom
  if (Element.prototype.animate) {
    // Fade out
    await mainContent.animate([
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(0.98)' }
    ], {
      duration: 200,
      easing: 'ease-in',
      fill: 'forwards'
    }).finished;

    await callback();

    // Fade in
    await mainContent.animate([
      { opacity: 0, transform: 'scale(1.02)' },
      { opacity: 1, transform: 'scale(1)' }
    ], {
      duration: 300,
      easing: 'ease-out',
      fill: 'forwards'
    }).finished;
    return;
  }

  // Fallback: View Transition API jika ada
  if (document.startViewTransition) {
    await document.startViewTransition(() => {
      return Promise.resolve(callback()).then(() => new Promise(resolve => requestAnimationFrame(resolve)));
    });
    return;
  }

  // Fallback biasa
  await callback();
}