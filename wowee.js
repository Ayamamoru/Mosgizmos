const tracks = [
    { name: 'Bubbly - Good Kid', file: 'Bubbly.mp3' },
    { name: 'Wall - Good Kid', file: 'Wall.mp3' },
    { name : 'Madeleine - Good Kid ft. Loupe', file: "Madeleine (ft. Loupe).mp3" },
    { name: 'Julie - The Fur.', file: 'Julie.mp3' }
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

let _lastRequestedFile = null;
let _triedEncodeURI = false;

function setAudioSource(file) {
    _lastRequestedFile = file;
    _triedEncodeURI = false;
    audio.src = new URL(file, document.baseURI).href;
    audio.load();
}

function loadTrack(index) {
    currentTrack = index;
    setAudioSource(tracks[index].file);
    if (trackName) trackName.textContent = tracks[index].name;
    if (isPlaying) {
        audio.play().catch(() => {});
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
        audio.play().catch(() => {});
        if (playBtn) playBtn.textContent = '⏸';
        reel1?.classList.add('spinning');
        reel2?.classList.add('spinning');
    }
    isPlaying = !isPlaying;
}

function nextTrack() {
    if (isLooping) {
        // If looping, restart the current track
        audio.currentTime = 0;
        if (isPlaying) audio.play().catch(() => {});
    } else {
        // Otherwise go to next track
        currentTrack = (currentTrack + 1) % tracks.length;
        loadTrack(currentTrack);
        if (isPlaying) audio.play().catch(() => {});
    }
}

function prevTrack() {
    if (isLooping) {
        // makes the thing loop the current track
        audio.currentTime = 0;
        if (isPlaying) audio.play().catch(() => {});
    } else {
        // otherwise it goes to the prev track
        currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
        loadTrack(currentTrack);
        if (isPlaying) audio.play().catch(() => {});
    }
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
    if (_lastRequestedFile && !_triedEncodeURI) {
        _triedEncodeURI = true;
        audio.src = new URL(encodeURI(_lastRequestedFile), document.baseURI).href;
        audio.load();
        if (isPlaying) audio.play().catch(() => {});
        return;
    }
    console.error('Audio error loading', audio.src, e);
});

// dragg the progress weee
let isDraggingProgress = false;
function updateProgressFromMouse(e) {
    if (!progressBar) return;
    const rect = progressBar.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    if (audio.duration) {
        audio.currentTime = percent * audio.duration;
    }
}
progressBar?.addEventListener('mousedown', () => {
    isDraggingProgress = true;
});
document.addEventListener('mousemove', (e) => {
    if (isDraggingProgress) updateProgressFromMouse(e);
});
document.addEventListener('mouseup', () => {
    isDraggingProgress = false;
});
progressBar?.addEventListener('click', (e) => {
    updateProgressFromMouse(e);
});

// drag the volume www
let isDraggingVolume = false;
function updateVolumeFromMouse(e) {
    if (!volumeSlider) return;
    const rect = volumeSlider.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.volume = percent;
    if (volumeLevel) volumeLevel.style.width = (percent * 100) + '%';
}
volumeSlider?.addEventListener('mousedown', () => {
    isDraggingVolume = true;
});
document.addEventListener('mousemove', (e) => {
    if (isDraggingVolume) updateVolumeFromMouse(e);
});
document.addEventListener('mouseup', () => {
    isDraggingVolume = false;
});
volumeSlider?.addEventListener('click', (e) => {
    updateVolumeFromMouse(e);
});

if (trackName) trackName.textContent = tracks[currentTrack].name;
if (volumeLevel) volumeLevel.style.width = (audio.volume * 100) + '%';

if (isLooping && loopBtn) loopBtn.classList.add('active');

loadTrack(currentTrack);