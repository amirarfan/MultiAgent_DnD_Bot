class AudioService {
  private static instance: AudioService;
  private audio: HTMLAudioElement | null = null;
  private playedSongs: Set<number> = new Set();
  private preloadedAudio: HTMLAudioElement | null = null;
  private isPreloading: boolean = false;
  private readonly CHRISTMAS_SONGS = [
    'https://ia903101.us.archive.org/0/items/mariahcareyalliwantforchristmasisyou_201912/Mariah%20Carey%20-%20All%20I%20Want%20For%20Christmas%20Is%20You.mp3',
    'https://ia904602.us.archive.org/4/items/wham-last-christmas-extended-version-of-original-45-mix-m-128s-re-creation/Wham%21%20-%20Last%20Christmas%20%28Extended%20Version%20of%20Original%2045%20Mix%29%20%5BM128%27s%20Re-creation%5D.mp3',
    'https://archive.org/download/ChristmasMichaelBuble/It%27s%20Beginning%20To%20Look%20A%20Lot%20Like%20Christmas.mp3',
    'https://archive.org/download/dean-martin-let-it-snow-let-it-snow-let-it-snow/Dean%20Martin%20-%20Let%20It%20Snow%21%20Let%20It%20Snow%21%20Let%20It%20Snow%21.mp3',
    'https://archive.org/download/y-2mate.com-bobby-helms-jingle-bell-rock-lyrics/y2mate.com%20-%20Bobby%20Helms%20%20Jingle%20Bell%20Rock%20Lyrics.mp3',
    'https://archive.org/download/tvtunes_8269/Burl%20Ives%20-%20A%20Holly%20Jolly%20Christmas.mp3',
    'https://archive.org/download/ChristmasSongsFelizNavidad1/Christmas%20Songs%20-%20Feliz%20Navidad%281%29.mp3'
  ];

  private constructor() {
    this.preloadNextSong();
  }

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
  }

  private async preloadSong(url: string): Promise<HTMLAudioElement> {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      
      const timeoutId = setTimeout(() => {
        reject(new Error('Audio loading timeout'));
      }, 5000); 
      audio.addEventListener('canplaythrough', () => {
        clearTimeout(timeoutId);
        resolve(audio);
      });

      audio.addEventListener('error', () => {
        clearTimeout(timeoutId);
        reject(new Error('Failed to load audio'));
      });

      audio.src = url;
      audio.load();
    });
  }

  private async preloadNextSong(): Promise<void> {
    if (this.isPreloading) return;
    this.isPreloading = true;

    try {
      const songUrl = this.getRandomUnplayedSong();
      this.preloadedAudio = await this.preloadSong(songUrl);
      this.preloadedAudio.loop = true;
    } catch (error) {
      console.error('Failed to preload song, trying next one:', error);
      const failedIndex = this.CHRISTMAS_SONGS.indexOf(this.preloadedAudio?.src || '');
      if (failedIndex !== -1) {
        this.playedSongs.delete(failedIndex);
      }
      await this.preloadNextSong();
    } finally {
      this.isPreloading = false;
    }
  }

  private getRandomUnplayedSong(): string {
    if (this.playedSongs.size === this.CHRISTMAS_SONGS.length) {
      this.playedSongs.clear();
    }

    const availableIndices = Array.from(
      { length: this.CHRISTMAS_SONGS.length },
      (_, i) => i
    ).filter(index => !this.playedSongs.has(index));

    const randomIndex = Math.floor(Math.random() * availableIndices.length);
    const selectedIndex = availableIndices[randomIndex];
    
    this.playedSongs.add(selectedIndex);
    
    return this.CHRISTMAS_SONGS[selectedIndex];
  }

  public async initializeChristmasAudio(): Promise<void> {
    this.cleanup();
    
    if (!this.preloadedAudio) {
      await this.preloadNextSong();
    }
    
    this.audio = this.preloadedAudio;
    this.preloadNextSong();
  }

  public async play(): Promise<void> {
    try {
      await this.initializeChristmasAudio();
      if (this.audio) {
        await this.audio.play();
      }
    } catch (error) {
      console.error('Playback failed, trying next song:', error);
      this.cleanup();
      return this.play();
    }
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
