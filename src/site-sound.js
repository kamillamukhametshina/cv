const players = new Set();
let initialized = false;
function suspended() { return document.hidden || document.documentElement.hasAttribute('data-viewer-open'); }
function sync() { players.forEach(player => player.sync()); }

// Every clip stays silent, including floating videos and repeated playback.
export function silenceVideo(video) {
  video.defaultMuted = true;
  const mute = () => { if (!video.muted) video.muted = true; if (video.volume !== 0) video.volume = 0; };
  mute();
  video.addEventListener('volumechange', mute);
}

export function registerSoundVideo(video) {
  if (!initialized) {
    initialized = true;
    document.addEventListener('visibilitychange', sync);
    document.addEventListener('portfolio-viewer-change', sync);
  }
  silenceVideo(video);
  video.loop = true;
  const player = { visible: false, pending: false, disposed: false,
    async sync() {
      if (!this.visible || suspended() || this.disposed) { video.pause(); return; }
      if (this.pending || !video.paused || !video.getAttribute('src')) return;
      this.pending = true;
      try { await video.play(); }
      catch { /* Unsupported media stays stopped. */ }
      finally {
        this.pending = false;
        if (this.disposed || !this.visible || suspended()) video.pause();
      }
    },
  };
  players.add(player);
  return {
    setVisible(visible) { player.visible = visible; player.sync(); },
    dispose() { player.disposed = true; video.pause(); players.delete(player); },
  };
}
