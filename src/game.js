// Echo Step: The Sonic Bridge - Complete Standalone Game Engine

(function () {
    'use strict';

    // =========================================================================
    // 1. PROCEDURAL SOUND SYNTHESIZER (Web Audio API)
    // =========================================================================
    class SoundEngine {
        constructor() {
            this.ctx = null;
            this.isMuted = false;
            this.masterVolume = 0.35;
            this.activeMelodyTimeout = null;
        }

        init() {
            if (!this.ctx && typeof window !== 'undefined' && (window.AudioContext || window.webkitAudioContext)) {
                try {
                    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                    this.ctx = new AudioContextClass();
                    this.masterGain = this.ctx.createGain();
                    this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
                    this.masterGain.connect(this.ctx.destination);
                } catch (e) {
                    console.warn('AudioContext init error:', e);
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                try { this.ctx.resume(); } catch (e) { }
            }
        }

        toggleMute() {
            this.isMuted = !this.isMuted;
            if (this.masterGain && this.ctx) {
                this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
            }
            return this.isMuted;
        }

        playLeftTone(duration = 0.35) {
            if (this.isMuted) return;
            this.init();
            if (!this.ctx) return;

            try {
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const subOsc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const panner = (this.ctx.createStereoPanner) ? this.ctx.createStereoPanner() : null;

                if (panner) panner.pan.setValueAtTime(-0.6, now);

                osc.type = 'triangle';
                osc.frequency.setValueAtTime(261.63, now);

                subOsc.type = 'sine';
                subOsc.frequency.setValueAtTime(523.25, now);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.3, now + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

                osc.connect(gain);
                subOsc.connect(gain);

                if (panner) {
                    gain.connect(panner);
                    panner.connect(this.masterGain);
                } else {
                    gain.connect(this.masterGain);
                }

                osc.start(now);
                subOsc.start(now);
                osc.stop(now + duration + 0.05);
                subOsc.stop(now + duration + 0.05);
            } catch (e) { }
        }

        playRightTone(duration = 0.35) {
            if (this.isMuted) return;
            this.init();
            if (!this.ctx) return;

            try {
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const shimmer = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const panner = (this.ctx.createStereoPanner) ? this.ctx.createStereoPanner() : null;

                if (panner) panner.pan.setValueAtTime(0.6, now);

                osc.type = 'sine';
                osc.frequency.setValueAtTime(392.00, now);

                shimmer.type = 'triangle';
                shimmer.frequency.setValueAtTime(783.99, now);

                gain.gain.setValueAtTime(0.001, now);
                gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

                osc.connect(gain);
                shimmer.connect(gain);

                if (panner) {
                    gain.connect(panner);
                    panner.connect(this.masterGain);
                } else {
                    gain.connect(this.masterGain);
                }

                osc.start(now);
                shimmer.start(now);
                osc.stop(now + duration + 0.05);
                shimmer.stop(now + duration + 0.05);
            } catch (e) { }
        }

        playShatter() {
            if (this.isMuted) return;
            this.init();
            if (!this.ctx) return;

            try {
                const now = this.ctx.currentTime;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

                gain.gain.setValueAtTime(0.35, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

                osc.connect(gain);
                gain.connect(this.masterGain);

                osc.start(now);
                osc.stop(now + 0.42);
            } catch (e) { }
        }

        playLevelComplete() {
            if (this.isMuted) return;
            this.init();
            if (!this.ctx) return;

            try {
                const notes = [261.63, 329.63, 392.00, 523.25];
                const now = this.ctx.currentTime;

                notes.forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    const time = now + idx * 0.1;

                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, time);

                    gain.gain.setValueAtTime(0.001, time);
                    gain.gain.linearRampToValueAtTime(0.25, time + 0.04);
                    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);

                    osc.connect(gain);
                    gain.connect(this.masterGain);

                    osc.start(time);
                    osc.stop(time + 0.55);
                });
            } catch (e) { }
        }

        playGrandVictory() {
            if (this.isMuted) return;
            this.init();
            if (!this.ctx) return;

            try {
                const chords = [
                    [261.63, 329.63, 392.00],
                    [293.66, 369.99, 440.00],
                    [329.63, 415.30, 493.88],
                    [523.25, 659.25, 783.99, 1046.50]
                ];

                const now = this.ctx.currentTime;
                chords.forEach((chord, chordIdx) => {
                    const time = now + chordIdx * 0.25;
                    chord.forEach(freq => {
                        const osc = this.ctx.createOscillator();
                        const gain = this.ctx.createGain();

                        osc.type = 'sine';
                        osc.frequency.setValueAtTime(freq, time);

                        gain.gain.setValueAtTime(0.001, time);
                        gain.gain.linearRampToValueAtTime(0.2, time + 0.05);
                        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.8);

                        osc.connect(gain);
                        gain.connect(this.masterGain);

                        osc.start(time);
                        osc.stop(time + 0.85);
                    });
                });
            } catch (e) { }
        }

        cancelMelody() {
            if (this.activeMelodyTimeout) {
                clearTimeout(this.activeMelodyTimeout);
                this.activeMelodyTimeout = null;
            }
        }

        // Updated to accept variable tempos
        playMelody(sequence, tempo, onNoteStart, onComplete) {
            this.cancelMelody();
            this.init();

            let idx = 0;

            const playNext = () => {
                if (idx < sequence.length) {
                    const type = sequence[idx];
                    if (type === 'left') {
                        this.playLeftTone(0.32);
                    } else {
                        this.playRightTone(0.32);
                    }

                    if (onNoteStart) onNoteStart(idx, type);
                    idx++;
                    this.activeMelodyTimeout = setTimeout(playNext, tempo);
                } else {
                    this.activeMelodyTimeout = null;
                    if (onComplete) onComplete();
                }
            };

            playNext();
        }
    }

    // =========================================================================
    // 2. PARTICLE ENGINE (Block Shattering & Footstep Effects)
    // =========================================================================
    class ParticleEngine {
        constructor(canvasId = 'fx-canvas') {
            this.canvas = document.getElementById(canvasId);
            this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
            this.particles = [];
            this.rings = [];
            this.isRunning = false;

            this.resize();
            window.addEventListener('resize', () => this.resize());
        }

        resize() {
            if (!this.canvas) return;
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        start() {
            if (this.isRunning) return;
            this.isRunning = true;
            this.loop();
        }

        loop() {
            if (!this.isRunning) return;
            this.update();
            this.render();
            requestAnimationFrame(() => this.loop());
        }

        spawnBlockShatter(x, y, color = '#f43f5e', count = 35) {
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 2 + Math.random() * 6.5;
                this.particles.push({
                    x: x + (Math.random() * 60 - 30),
                    y: y + (Math.random() * 30 - 15),
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 2.5,
                    size: 3 + Math.random() * 7,
                    color,
                    alpha: 1.0,
                    decay: 0.015 + Math.random() * 0.02,
                    gravity: 0.22,
                    rot: Math.random() * Math.PI,
                    vRot: (Math.random() - 0.5) * 0.2
                });
            }
        }

        spawnStepRing(x, y, color = '#22d3ee') {
            this.rings.push({
                x, y,
                radius: 8,
                maxRadius: 70,
                growth: 2.8,
                color,
                alpha: 0.85,
                decay: 0.03
            });
        }

        update() {
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const p = this.particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vy += p.gravity;
                p.rot += p.vRot;
                p.alpha -= p.decay;
                if (p.alpha <= 0) this.particles.splice(i, 1);
            }

            for (let i = this.rings.length - 1; i >= 0; i--) {
                const r = this.rings[i];
                r.radius += r.growth;
                r.alpha -= r.decay;
                if (r.alpha <= 0 || r.radius >= r.maxRadius) {
                    this.rings.splice(i, 1);
                }
            }
        }

        render() {
            if (!this.ctx || !this.canvas) return;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (const r of this.rings) {
                this.ctx.save();
                this.ctx.globalAlpha = Math.max(0, r.alpha);
                this.ctx.beginPath();
                this.ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
                this.ctx.strokeStyle = r.color;
                this.ctx.lineWidth = 3;
                this.ctx.shadowBlur = 12;
                this.ctx.shadowColor = r.color;
                this.ctx.stroke();
                this.ctx.restore();
            }

            for (const p of this.particles) {
                this.ctx.save();
                this.ctx.globalAlpha = Math.max(0, p.alpha);
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.rot);
                this.ctx.fillStyle = p.color;
                this.ctx.shadowBlur = 8;
                this.ctx.shadowColor = p.color;
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
                this.ctx.restore();
            }
        }
    }

    // =========================================================================
    // 3. MAIN GAME LOGIC & LEVELS
    // =========================================================================
    const LEVELS = [
        {
            level: 1,
            name: "The Whispering Steps",
            length: 4, 
            tempo: 500, // Standard pace
            blind: false,
            desc: "Listen to the 4-beat melody and hop on the corresponding blocks."
        },
        {
            level: 2,
            name: "The Dual Echoes",
            length: 6,
            tempo: 450, // Slightly faster
            blind: false,
            desc: "A 6-beat sequence. Alternate your focus between both tones."
        },
        {
            level: 3,
            name: "The Harmonic Rift",
            length: 8,
            tempo: 350, // Tempo Ramp mechanic introduced
            blind: false,
            desc: "8 steps ahead. The tempo increases to test your reflexes."
        },
        {
            level: 4,
            name: "The Chasm Symphony",
            length: 10,
            tempo: 300, 
            blind: true, // Blind Mode mechanic introduced
            desc: "10 steps. BLIND MODE: Visualizer dots are hidden during preview. Rely purely on audio."
        },
        {
            level: 5,
            name: "The Master Melody",
            length: 12,
            tempo: 220, // Extreme speed
            blind: true,
            desc: "12 high-speed beats. Pure audio memory required!"
        }
    ];

    class SonicBridgeGame {
        constructor() {
            this.sound = new SoundEngine();
            this.particles = new ParticleEngine('fx-canvas');

            this.currentLevelIndex = 0;
            this.currentStep = 0;
            this.deaths = 0;
            this.isPlayingMelody = false;
            this.isPlayerMoving = false;

            this.init();
        }

        init() {
            this.particles.start();
            this.setupUIListeners();
            
            // Connect the start screen button to load the game
            const btnStart = document.getElementById('btn-start-game');
            if (btnStart) {
                btnStart.addEventListener('click', () => {
                    document.getElementById('modal-start').classList.remove('active');
                    this.loadLevel(0);
                });
            }
        }

        setupUIListeners() {
            const btnPracLeft = document.getElementById('btn-practice-left');
            const btnPracRight = document.getElementById('btn-practice-right');
            if (btnPracLeft) {
                btnPracLeft.addEventListener('click', () => {
                    this.sound.playLeftTone();
                });
            }
            if (btnPracRight) {
                btnPracRight.addEventListener('click', () => {
                    this.sound.playRightTone();
                });
            }

            const btnJumpLeft = document.getElementById('btn-jump-left');
            const btnJumpRight = document.getElementById('btn-jump-right');
            if (btnJumpLeft) {
                btnJumpLeft.addEventListener('click', () => this.handlePlayerStep('left'));
            }
            if (btnJumpRight) {
                btnJumpRight.addEventListener('click', () => this.handlePlayerStep('right'));
            }

            const btnMute = document.getElementById('btn-toggle-sound');
            if (btnMute) {
                btnMute.addEventListener('click', () => {
                    const muted = this.sound.toggleMute();
                    btnMute.innerHTML = muted ? '🔇 Sound: Off' : '🔊 Sound: On';
                });
            }

            const btnRestartAll = document.getElementById('btn-restart-game');
            if (btnRestartAll) {
                btnRestartAll.addEventListener('click', () => {
                    document.getElementById('modal-victory').classList.remove('active');
                    this.deaths = 0;
                    this.loadLevel(0);
                });
            }

            window.addEventListener('keydown', (e) => {
                if (this.isPlayingMelody || this.isPlayerMoving) return;

                if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
                    this.handlePlayerStep('left');
                } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
                    this.handlePlayerStep('right');
                }
            });
        }

        loadLevel(levelIndex) {
            this.currentLevelIndex = levelIndex;
            this.currentStep = 0;
            const levelData = LEVELS[this.currentLevelIndex];

            levelData.sequence = Array.from({ length: levelData.length }, () =>
                Math.random() < 0.5 ? 'left' : 'right'
            );

            const levelEl = document.getElementById('hud-level-badge');
            const deathEl = document.getElementById('hud-death-count');
            const statusTitle = document.getElementById('status-title');
            const statusDesc = document.getElementById('status-desc');

            if (levelEl) levelEl.textContent = `Level ${levelData.level} / ${LEVELS.length}`;
            if (deathEl) deathEl.textContent = `${this.deaths}`;
            if (statusTitle) statusTitle.textContent = `${levelData.name}`;
            if (statusDesc) statusDesc.textContent = levelData.desc;

            this.renderBridge();
            this.renderVisualizerDots();
            this.updateAvatarPosition();

            setTimeout(() => {
                this.playCurrentLevelTune();
            }, 500);
        }

        renderBridge() {
            const bridgeContainer = document.getElementById('bridge-path-container');
            if (!bridgeContainer) return;
            bridgeContainer.innerHTML = '';

            const levelData = LEVELS[this.currentLevelIndex];
            const totalSteps = levelData.sequence.length;

            const startPlatform = document.createElement('div');
            startPlatform.className = 'platform-start';
            startPlatform.id = 'tile-start';
            startPlatform.textContent = 'START PLATFORM';
            bridgeContainer.appendChild(startPlatform);

            for (let i = 0; i < totalSteps; i++) {
                const row = document.createElement('div');
                row.className = 'bridge-row';
                row.id = `bridge-row-${i}`;

                const leftTile = document.createElement('div');
                leftTile.className = 'block-tile block-left';
                leftTile.id = `tile-${i}-left`;
                leftTile.addEventListener('click', () => {
                    if (i === this.currentStep) this.handlePlayerStep('left');
                });

                const rightTile = document.createElement('div');
                rightTile.className = 'block-tile block-right';
                rightTile.id = `tile-${i}-right`;
                rightTile.addEventListener('click', () => {
                    if (i === this.currentStep) this.handlePlayerStep('right');
                });

                row.appendChild(leftTile);
                row.appendChild(rightTile);
                bridgeContainer.appendChild(row);
            }

            const finishPlatform = document.createElement('div');
            finishPlatform.className = 'platform-finish';
            finishPlatform.id = `tile-finish`;
            finishPlatform.textContent = 'FINISH PORTAL ✦';
            bridgeContainer.appendChild(finishPlatform);

            let avatar = document.getElementById('player-avatar');
            if (!avatar) {
                avatar = document.createElement('div');
                avatar.id = 'player-avatar';
                avatar.className = 'player-avatar';
                avatar.textContent = ' ';
                document.getElementById('bridge-viewport').appendChild(avatar);
            }
            avatar.classList.remove('falling');
        }

        renderVisualizerDots() {
            const dotsContainer = document.getElementById('tune-visualizer-dots');
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';

            const levelData = LEVELS[this.currentLevelIndex];
            levelData.sequence.forEach((_, idx) => {
                const dot = document.createElement('div');
                dot.className = 'tune-dot';
                dot.id = `dot-${idx}`;
                dotsContainer.appendChild(dot);
            });
        }

        updateAvatarPosition() {
            const avatar = document.getElementById('player-avatar');
            if (!avatar) return;

            let targetElement = null;
            if (this.currentStep === 0) {
                targetElement = document.getElementById('tile-start');
            } else {
                const prevStep = this.currentStep - 1;
                const prevChoice = LEVELS[this.currentLevelIndex].sequence[prevStep];
                targetElement = document.getElementById(`tile-${prevStep}-${prevChoice}`);
            }

            if (targetElement) {
                const viewport = document.getElementById('bridge-viewport');
                const vRect = viewport.getBoundingClientRect();
                const tRect = targetElement.getBoundingClientRect();

                const x = (tRect.left + tRect.width / 2) - vRect.left;
                const y = (tRect.top + tRect.height / 2) - vRect.top - 12;

                avatar.style.left = `${x}px`;
                avatar.style.top = `${y}px`;
            }

            const bridgeContainer = document.getElementById('bridge-path-container');
            if (bridgeContainer) {
                const offset = this.currentStep * 45;
                bridgeContainer.style.bottom = `${40 - offset}px`;
            }
        }

        playCurrentLevelTune() {
            if (this.isPlayingMelody) return;
            this.isPlayingMelody = true;
            this.setJumpControlsEnabled(false);

            const statusTitle = document.getElementById('status-title');
            if (statusTitle) {
                statusTitle.innerHTML = '🎵 <em>Listen carefully to the melody...</em>';
            }

            document.querySelectorAll('.tune-dot').forEach(d => {
                d.className = 'tune-dot';
            });

            const levelData = LEVELS[this.currentLevelIndex];
            
            this.sound.playMelody(
                levelData.sequence,
                levelData.tempo,
                (noteIdx, noteType) => {
                    // Visualizer displays conditionally based on the new "Blind" mechanic
                    if (!levelData.blind) {
                        const dot = document.getElementById(`dot-${noteIdx}`);
                        if (dot) {
                            dot.className = `tune-dot ${noteType}-active`;
                        }
                    }
                },
                () => {
                    this.isPlayingMelody = false;
                    this.setJumpControlsEnabled(true);

                    document.querySelectorAll('.tune-dot').forEach(d => {
                        d.className = 'tune-dot';
                    });

                    if (statusTitle) {
                        statusTitle.innerHTML = `<strong>YOUR TURN!</strong> Step on the blocks from memory.`;
                    }
                }
            );
        }

        setJumpControlsEnabled(enabled) {
            const btnLeft = document.getElementById('btn-jump-left');
            const btnRight = document.getElementById('btn-jump-right');

            if (btnLeft) btnLeft.disabled = !enabled;
            if (btnRight) btnRight.disabled = !enabled;
        }

        handlePlayerStep(choice) {
            if (this.isPlayingMelody || this.isPlayerMoving) return;

            const levelData = LEVELS[this.currentLevelIndex];
            const correctChoice = levelData.sequence[this.currentStep];
            const chosenTile = document.getElementById(`tile-${this.currentStep}-${choice}`);

            this.isPlayerMoving = true;

            if (choice === correctChoice) {
                if (choice === 'left') {
                    this.sound.playLeftTone();
                } else {
                    this.sound.playRightTone();
                }

                if (chosenTile) {
                    chosenTile.classList.add('stepped-correct');
                    const rect = chosenTile.getBoundingClientRect();
                    this.particles.spawnStepRing(rect.left + rect.width / 2, rect.top + rect.height / 2, choice === 'left' ? '#22d3ee' : '#fb7185');
                }

                const dot = document.getElementById(`dot-${this.currentStep}`);
                if (dot) dot.classList.add('completed');

                this.currentStep++;
                this.updateAvatarPosition();

                if (this.currentStep >= levelData.sequence.length) {
                    setTimeout(() => {
                        this.handleLevelVictory();
                    }, 400);
                } else {
                    setTimeout(() => {
                        this.isPlayerMoving = false;
                    }, 200);
                }
            } else {
                this.sound.playShatter();
                this.deaths++;
                const deathEl = document.getElementById('hud-death-count');
                if (deathEl) deathEl.textContent = `${this.deaths}`;

                if (chosenTile) {
                    chosenTile.classList.add('shattered');
                    const rect = chosenTile.getBoundingClientRect();
                    this.particles.spawnBlockShatter(
                        rect.left + rect.width / 2,
                        rect.top + rect.height / 2,
                        choice === 'left' ? '#06b6d4' : '#f43f5e',
                        35
                    );
                }

                const avatar = document.getElementById('player-avatar');
                if (avatar) avatar.classList.add('falling');

                const statusTitle = document.getElementById('status-title');
                if (statusTitle) statusTitle.innerHTML = '💥 <strong style="color: #f43f5e;">WRONG BLOCK!</strong> Shattered into the abyss...';

                setTimeout(() => {
                    this.restartCurrentLevel();
                }, 850);
            }
        }

        restartCurrentLevel() {
            this.currentStep = 0;
            this.isPlayerMoving = false;

            this.renderBridge();
            this.renderVisualizerDots();
            this.updateAvatarPosition();

            this.playCurrentLevelTune();
        }

        handleLevelVictory() {
            this.sound.playLevelComplete();

            if (this.currentLevelIndex < LEVELS.length - 1) {
                const nextLevelIdx = this.currentLevelIndex + 1;
                const statusTitle = document.getElementById('status-title');
                if (statusTitle) statusTitle.innerHTML = `🌟 <strong>LEVEL COMPLETE!</strong> Preparing Level ${nextLevelIdx + 1}...`;

                setTimeout(() => {
                    this.isPlayerMoving = false;
                    this.loadLevel(nextLevelIdx);
                }, 1400);
            } else {
                this.sound.playGrandVictory();
                this.isPlayerMoving = false;

                const modal = document.getElementById('modal-victory');
                const deathSummary = document.getElementById('victory-death-summary');
                if (deathSummary) deathSummary.textContent = `Total Falls: ${this.deaths}`;
                if (modal) modal.classList.add('active');
            }
        }
    }

    function launch() {
        if (!window.sonicBridgeGame) {
            window.sonicBridgeGame = new SonicBridgeGame();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', launch);
    } else {
        launch();
    }
})();
