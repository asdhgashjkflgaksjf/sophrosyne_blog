import { useCallback, useRef } from 'react';

type SoundType = 'turn' | 'rustle' | 'flip' | 'close' | 'crinkle';

interface SoundConfig {
  frequency: number;
  duration: number;
  volume: number;
  decay: number;
}

const soundConfigs: Record<SoundType, SoundConfig> = {
  turn: { frequency: 2500, duration: 0.25, volume: 0.08, decay: 2 },
  rustle: { frequency: 3000, duration: 0.15, volume: 0.05, decay: 2.5 },
  flip: { frequency: 3500, duration: 0.12, volume: 0.06, decay: 3 },
  close: { frequency: 1500, duration: 0.3, volume: 0.1, decay: 1.5 },
  crinkle: { frequency: 4000, duration: 0.2, volume: 0.04, decay: 2 },
};

export const usePaperSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isEnabledRef = useRef(true);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!isEnabledRef.current) return;

    try {
      const audioContext = getAudioContext();
      const config = soundConfigs[type];
      
      // Create noise buffer
      const bufferSize = audioContext.sampleRate * config.duration;
      const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
      const noiseData = noiseBuffer.getChannelData(0);
      
      // Generate paper-like noise with decay
      for (let i = 0; i < noiseBuffer.length; i++) {
        const decay = Math.pow(1 - i / noiseBuffer.length, config.decay);
        // Add some randomness variation for more natural sound
        const variation = 1 + (Math.random() - 0.5) * 0.3;
        noiseData[i] = (Math.random() * 2 - 1) * decay * variation;
      }
      
      const noiseSource = audioContext.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      
      // High-pass filter for paper-like quality
      const highpassFilter = audioContext.createBiquadFilter();
      highpassFilter.type = 'highpass';
      highpassFilter.frequency.value = config.frequency;
      highpassFilter.Q.value = 0.5;
      
      // Low-pass filter to remove harsh frequencies
      const lowpassFilter = audioContext.createBiquadFilter();
      lowpassFilter.type = 'lowpass';
      lowpassFilter.frequency.value = 8000;
      lowpassFilter.Q.value = 0.3;
      
      // Gain envelope
      const gainNode = audioContext.createGain();
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(config.volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + config.duration);
      
      // Connect nodes
      noiseSource.connect(highpassFilter);
      highpassFilter.connect(lowpassFilter);
      lowpassFilter.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Play
      noiseSource.start(audioContext.currentTime);
      noiseSource.stop(audioContext.currentTime + config.duration + 0.05);
    } catch (e) {
      // Audio context might not be available
      console.debug('Paper sound unavailable:', e);
    }
  }, [getAudioContext]);

  const setEnabled = useCallback((enabled: boolean) => {
    isEnabledRef.current = enabled;
  }, []);

  const playPageTurn = useCallback(() => playSound('turn'), [playSound]);
  const playRustle = useCallback(() => playSound('rustle'), [playSound]);
  const playFlip = useCallback(() => playSound('flip'), [playSound]);
  const playClose = useCallback(() => playSound('close'), [playSound]);
  const playCrinkle = useCallback(() => playSound('crinkle'), [playSound]);

  return {
    playSound,
    playPageTurn,
    playRustle,
    playFlip,
    playClose,
    playCrinkle,
    setEnabled,
  };
};

export default usePaperSound;
