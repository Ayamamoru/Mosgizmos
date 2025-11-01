const tracks = [
    { name: 'Bubbly', file: 'Bubbly.mp3' },
    { name: 'Wall', file: 'Wall.mp3' },
];

let currentTrack = 0;
let isPlaying = false;
let isLooping = false;

let audio = new Audio();
audio.volume = 0.7;

const playBtn = document.getElementById('playbtn');
const prevBtn = document.getElementById('prevBtn');
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

function setAudioSource(file) {
    const encoded = './' + encodeURIComponent(file);
    audio.src = encoded;
    audio.load();
}

function loadTrack(index) {
    currentTrack = index;
    setAudioSource(tracks[index].file);
    if (trackName) trackName.textContent = tracks[index].name;
    if (isPlaying) {
        audio.play().catch((err) => {
            console.warn('Playback prevented:', err);
        });
    }
}

function togglePlay() {
    if (!audio) return;
    if (isPlaying) {
        audio.pause();
        if (playBtn) playBtn.textContent = '▶';
        reel1?.classList.remove('spinning');
        reel2?.classList.remove('spinning');
    } else {
        audio.play().catch((err) => {
            console.warn('Play() failed:', err);
        });
        if (playBtn) playBtn.textContent = '⏸';
        reel1?.classList.add('spinning');
        reel2?.classList.add('spinning');
    }
    isPlaying = !isPlaying;
}

function nextTrack() {
    currentTrack = (currentTrack + 1) % tracks.length;
    loadTrack(currentTrack);
    if (isPlaying) audio.play().catch(() => {});
}

function prevTrack() {
    currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
    loadTrack(currentTrack);
    if (isPlaying) audio.play().catch(() => {});
}

function toggleLoop() {
    isLooping = !isLooping;
    audio.loop = isLooping;
    loopBtn?.classList.toggle('active', isLooping);
}

function formatTime(seconds) {
    if (!isFinite(seconds) || seconds <= 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

playBtn?.addEventListener('click', togglePlay);
nextBtn?.addEventListener('click', nextTrack);
prevBtn?.addEventListener('click', prevTrack);
loopBtn?.addEventListener('click', toggleLoop);

audio.addEventListener('timeupdate', () => {
    if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        const percent = (audio.currentTime / audio.duration) * 100;
        if (progress) progress.style.width = percent + '%';
    } else {
        if (progress) progress.style.width = '0%';
    }
    if (currentTime) currentTime.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
    if (duration) duration.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
    if (!isLooping) {
        nextTrack();
    }
});

audio.addEventListener('error', (e) => {
    console.error('Audio error loading', audio.src, e);
});

progressBar?.addEventListener('click', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audio.duration) {
        audio.currentTime = Math.max(0, Math.min(1, percent)) * audio.duration;
    }
});

volumeSlider?.addEventListener('click', (e) => {
    const rect = volumeSlider.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.volume = Math.max(0, Math.min(1, percent));
    if (volumeLevel) volumeLevel.style.width = (Math.max(0, Math.min(1, percent)) * 100) + '%';
});

if (trackName) trackName.textContent = tracks[currentTrack].name;
if (volumeLevel) volumeLevel.style.width = (audio.volume * 100) + '%';

loadTrack(currentTrack);