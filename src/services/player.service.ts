class PlayerService {
  playerEl?: HTMLAudioElement;
  constructor() {
    if (typeof window === 'undefined') return;
    const _playerEl = document.querySelector('#player') as HTMLAudioElement;
    if (!_playerEl) {
      this.playerEl = document.createElement('audio');
      document.body.appendChild(this.playerEl);
    } else {
      this.playerEl = _playerEl;
    }
  }

  playAudio(audioUrl: string, playNow: boolean = true) {
    if (!this.playerEl) throw new Error("Player has not been bound.");
    this.playerEl.src = audioUrl;
    if (playNow) {
      return this.playerEl.play();
    }
  }
}

export default new PlayerService();
