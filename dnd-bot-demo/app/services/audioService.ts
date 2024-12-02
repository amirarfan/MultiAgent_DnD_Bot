class AudioService {
  private static instance: AudioService;
  private audio: HTMLAudioElement | null = null;
  private readonly CHRISTMAS_SONG_URL = 'https://ia903101.us.archive.org/0/items/mariahcareyalliwantforchristmasisyou_201912/Mariah%20Carey%20-%20All%20I%20Want%20For%20Christmas%20Is%20You.mp3';

  private constructor() {}

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  public initializeChristmasAudio(): void {
    if (!this.audio) {
      this.audio = new Audio(this.CHRISTMAS_SONG_URL);
      this.audio.loop = true;
    }
  }

  public play(): Promise<void> {
    if (!this.audio) {
      this.initializeChristmasAudio();
    }
    return this.audio?.play() || Promise.resolve();
  }

  public pause(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  public cleanup(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
  }
}

export const audioService = AudioService.getInstance();
