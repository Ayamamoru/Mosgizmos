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
const progressBar = document.getElementById('progressBar');
const currentTime = document.getElementById('currentTime');
const duration = document.getElementById('duration');
const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const volumeSlider = document.getElementById('volumeSlider');
const volumeLevel = document.getElementById('volumeLevel');

audio.volume = 0.7;
