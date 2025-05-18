import './App.css';
import * as Tone from 'tone';
import { useEffect, useRef, useState } from 'react';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const loopRef = useRef(null);
  const notes = ["C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4"];
  const cMajorIndexes = [0, 2, 4, 5, 7, 9, 11]; // Índices de las notas de Do mayor
  const cMajorTransitionMatrix = [ // Matriz de transición para la tonalidad de Do mayor
    [0.16, 0, 0.14, 0, 0.14, 0.14, 0, 0.14, 0, 0.14, 0, 0.14],
    [0.16, 0, 0.14, 0, 0.14, 0.14, 0, 0.14, 0, 0.14, 0, 0.14],
    [0.16, 0, 0.14, 0, 0.14, 0.14, 0, 0.14, 0, 0.14, 0, 0.14],
    [0.16, 0, 0.14, 0, 0.14, 0.14, 0, 0.14, 0, 0.14, 0, 0.14],
    [0.16, 0, 0.14, 0, 0.14, 0.14, 0, 0.14, 0, 0.14, 0, 0.14],
    [0.16, 0, 0.14, 0, 0.14, 0.14, 0, 0.14, 0, 0.14, 0, 0.14],
    [0.16, 0, 0.14, 0, 0.14, 0.14, 0, 0.14, 0, 0.14, 0, 0.14]
  ];
  let previousIndex = 0;
  let currentIndex = 0;
  let nextIndex = 0;

  const startMusic = async () => {
    await Tone.start();
    setIsPlaying(true);
    Tone.Transport.start();
    generateRandomNotes();
  };

  const stopMusic = () => {
    setIsPlaying(false);
    Tone.Transport.stop();
    loopRef.current.dispose();
  };

  useEffect(() => {
    if (isPlaying) {
      const chordProgression = [ // Circulo de Do mayor
        ['C4', 'E4', 'G4'], // Acorde de Do mayor
        ['A4', 'C4', 'E4'], // Acorde de La menor
        ['D4', 'F4', 'A4'], // Acorde de Re menor
        ['G4', 'B4', 'D4'], // Acorde de Sol mayor
      ];
      const synth = new Tone.PolySynth().toDestination();
      let chordIndex = 0;
      loopRef.current = new Tone.Loop(() => {
        synth.volume.value = -6; // Ajusta el volumen del sintetizador
        synth.triggerAttackRelease(chordProgression[chordIndex], "1m");
        chordIndex = (chordIndex + 1) % chordProgression.length;
      }, "1m").start(0);
    }
  }, [isPlaying]);

  const generateRandomNotes = () => {
    const tone = new Tone.Synth().toDestination();
    let counter = 0;
    const randomNotesLoop = new Tone.Loop(() => {
      if (counter < 80) {
        previousIndex = currentIndex;
        currentIndex = nextIndex;
        tone.triggerAttackRelease(notes[currentIndex], "4n");

        const randomValue = Math.random() - 0.16;
        const randomCalculation = Math.floor(randomValue <= 0 ? 0 : 1 + randomValue / 0.14)
        nextIndex = cMajorIndexes[randomCalculation];
        counter++;
      } else {
        stopMusic();
        randomNotesLoop.stop();
        randomNotesLoop.dispose();
      }
    }, "4n").start(0);
  };
  

  return (
    <div>
      <button onClick={startMusic} disabled={isPlaying}>
        {isPlaying ? 'Stop' : 'Start'} Music
      </button>
    </div>
  );
}

export default App;
