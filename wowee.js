const tracks = [
    { name: 'Bubbly', file: 'Bubbly.mp3' },
    { name: 'Wall', file: 'Wall.mp3' },
    { name: 'Madeline', file: 'Madeline (fr.Loupe).mp3' }
];

let currentTrack=0;
let isPlaying=false;
let isLooping=false;

const audio = new Audio(tracks[0].file);
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prev.Btn');
const nextBtn = document.getElementById('nextBtn');
const loopBtn = document.getElementById('loopBtn');
const trackName = document.getElementById('trackName');
const progress = document.getElementById('progress');
