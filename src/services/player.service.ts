class PlayerService {
  playerEl: HTMLAudioElement = document.createElement('audio');
  constructor() {
    const _playerEl = document.querySelector('#player') as HTMLAudioElement;
    if (!_playerEl) {
      this.playerEl = document.createElement('audio');
      document.body.appendChild(this.playerEl);
    } else {
      this.playerEl = _playerEl;
    }
  }

  playAudio(audioUrl: string, playNow: boolean = true) {
    this.playerEl.src = audioUrl;
    if (playNow) {
      return this.playerEl.play();
    }
  }
}

export default new PlayerService();
