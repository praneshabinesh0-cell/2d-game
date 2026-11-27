<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>Aether Jumper — 2-Level 2D Platformer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #090d16;
      --panel-bg: rgba(15, 23, 42, 0.88);
      --border-glow: rgba(56, 189, 248, 0.45);
      --accent-cyan: #38bdf8;
      --accent-gold: #fbbf24;
      --accent-pink: #f43f5e;
      --accent-emerald: #10b981;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      user-select: none;
      -webkit-user-select: none;
    }

    body {
      background: radial-gradient(circle at top, #131c31 0%, var(--bg-dark) 75%);
      color: var(--text-main);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 12px;
      overflow-x: hidden;
    }

    .arcade-wrapper {
      width: 100%;
      max-width: 960px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* Top HUD Bar */
    .hud-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      background: var(--panel-bg);
      border: 1px solid var(--border-glow);
      border-radius: 14px;
      padding: 12px 18px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(8px);
    }

    .brand-title {
      font-family: 'Press Start 2P', monospace;
      font-size: clamp(0.75rem, 1.8vw, 1rem);
      color: var(--accent-cyan);
      text-shadow: 0 0 12px rgba(56, 189, 248, 0.5);
      letter-spacing: 0.5px;
    }

    .hud-stats {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 16px;
    }

    .stat-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(30, 41, 59, 0.85);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 10px;
      padding: 6px 12px;
      font-size: 0.85rem;
      font-weight: 700;
    }

    .stat-label {
      color: var(--text-muted);
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .stat-value {
      font-family: 'Press Start 2P', monospace;
      font-size: 0.78rem;
    }

    .val-level { color: #a78bfa; }
    .val-gems { color: var(--accent-gold); }
    .val-score { color: var(--accent-emerald); }
    .val-lives { color: var(--accent-pink); letter-spacing: 2px; }

    /* Canvas Container */
    .stage-container {
      position: relative;
      width: 100%;
      aspect-ratio: 16 / 9;
      background: #070b14;
      border-radius: 16px;
      overflow: hidden;
      border: 2px solid rgba(56, 189, 248, 0.35);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.65), 0 0 30px rgba(56, 189, 248, 0.12);
    }

    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }

    /* Overlay Screens (Start, Level Transition, Game Over, Victory) */
    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(7, 11, 20, 0.84);
      backdrop-filter: blur(6px);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px;
      z-index: 10;
      transition: opacity 0.25s ease;
    }

    .overlay.hidden {
      opacity: 0;
      pointer-events: none;
    }

    .overlay-badge {
      font-family: 'Press Start 2P', monospace;
      font-size: 0.68rem;
      padding: 6px 12px;
      border-radius: 999px;
      background: rgba(56, 189, 248, 0.16);
      border: 1px solid rgba(56, 189, 248, 0.45);
      color: var(--accent-cyan);
      margin-bottom: 14px;
      text-transform: uppercase;
    }

    .overlay h1 {
      font-family: 'Press Start 2P', monospace;
      font-size: clamp(1.15rem, 3.2vw, 2rem);
      line-height: 1.4;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #ffffff 0%, #38bdf8 55%, #818cf8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .overlay p {
      max-width: 540px;
      color: #cbd5e1;
      font-size: clamp(0.85rem, 1.5vw, 0.98rem);
      line-height: 1.6;
      margin-bottom: 20px;
    }

    .summary-grid {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 22px;
    }

    .summary-card {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(148, 163, 184, 0.25);
      border-radius: 12px;
      padding: 10px 16px;
      min-width: 125px;
    }

    .summary-card .label {
      font-size: 0.7rem;
      color: var(--text-muted);
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    .summary-card .num {
      font-family: 'Press Start 2P', monospace;
      font-size: 0.9rem;
      color: var(--accent-gold);
    }

    /* Arcade Buttons */
    .btn-arcade {
      font-family: 'Press Start 2P', monospace;
      font-size: clamp(0.75rem, 1.5vw, 0.9rem);
      color: #090d16;
      background: linear-gradient(180deg, #7dd3fc 0%, #38bdf8 50%, #0284c7 100%);
      border: 2px solid #bae6fd;
      border-radius: 12px;
      padding: 14px 26px;
      cursor: pointer;
      box-shadow: 0 6px 0 #0369a1, 0 12px 24px rgba(2, 132, 199, 0.45);
      transition: transform 0.1s ease, box-shadow 0.1s ease, filter 0.15s ease;
    }

    .btn-arcade:hover {
      filter: brightness(1.08);
      transform: translateY(-2px);
      box-shadow: 0 8px 0 #0369a1, 0 16px 28px rgba(2, 132, 199, 0.55);
    }

    .btn-arcade:active {
      transform: translateY(4px);
      box-shadow: 0 2px 0 #0369a1, 0 6px 12px rgba(2, 132, 199, 0.4);
    }

    .btn-gold {
      background: linear-gradient(180deg, #fde68a 0%, #fbbf24 55%, #d97706 100%);
      border-color: #fef3c7;
      box-shadow: 0 6px 0 #92400e, 0 12px 24px rgba(217, 119, 6, 0.45);
    }

    .btn-gold:hover {
      box-shadow: 0 8px 0 #92400e, 0 16px 28px rgba(217, 119, 6, 0.55);
    }

    .btn-gold:active {
      box-shadow: 0 2px 0 #92400e, 0 6px 12px rgba(217, 119, 6, 0.4);
    }

    /* Footer Controls Legend & Mobile Touch Controls */
    .controls-bar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: var(--panel-bg);
      border: 1px solid rgba(148, 163, 184, 0.2);
      border-radius: 14px;
      padding: 10px 16px;
      font-size: 0.82rem;
      color: var(--text-muted);
    }

    .key-hints {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 14px;
    }

    .key-cap {
      display: inline-block;
      background: #1e293b;
      color: #f8fafc;
      border: 1px solid #475569;
      border-bottom-width: 3px;
      border-radius: 6px;
      padding: 2px 7px;
      font-family: monospace;
      font-weight: 700;
      font-size: 0.78rem;
      margin-right: 4px;
    }

    .sound-toggle {
      background: rgba(30, 41, 59, 0.9);
      color: var(--text-main);
      border: 1px solid rgba(148, 163, 184, 0.3);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
    }

    .sound-toggle:hover {
      border-color: var(--accent-cyan);
    }

    /* Touch Controls for Mobile/Tablet */
    .touch-controls {
      display: none;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      padding: 4px 2px;
    }

    .touch-group {
      display: flex;
      gap: 12px;
    }

    .touch-btn {
      width: 62px;
      height: 54px;
      border-radius: 14px;
      background: rgba(30, 41, 59, 0.92);
      border: 2px solid rgba(56, 189, 248, 0.45);
      color: #f8fafc;
      font-family: 'Press Start 2P', monospace;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 0 rgba(15, 23, 42, 0.9);
      touch-action: manipulation;
    }

    .touch-btn:active, .touch-btn.pressed {
      background: rgba(56, 189, 248, 0.35);
      transform: translateY(3px);
    }

    .touch-btn.jump-btn {
      width: 112px;
      border-color: rgba(251, 191, 36, 0.6);
      color: var(--accent-gold);
    }

    @media (max-width: 768px) {
      .touch-controls {
        display: flex;
      }
      .key-hints {
        display: none;
      }
    }
  </style>
</head>
<body>
  <div class="arcade-wrapper">
    <!-- Top HUD -->
    <header class="hud-bar">
      <div class="brand-title">AETHER JUMPER</div>
      <div class="hud-stats">
        <div class="stat-pill">
          <span class="stat-label">Stage</span>
          <span class="stat-value val-level" id="hud-level">1 / 2</span>
        </div>
        <div class="stat-pill">
          <span class="stat-label">Gems</span>
          <span class="stat-value val-gems" id="hud-gems">0 / 0</span>
        </div>
        <div class="stat-pill">
          <span class="stat-label">Score</span>
          <span class="stat-value val-score" id="hud-score">0000</span>
        </div>
        <div class="stat-pill">
          <span class="stat-label">Lives</span>
          <span class="stat-value val-lives" id="hud-lives">♥♥♥</span>
        </div>
      </div>
    </header>

    <!-- Main Game Viewport -->
    <main class="stage-container" id="stage-container">
      <canvas id="gameCanvas"></canvas>

      <!-- Start / Level Transition / Game Over / Victory Overlay -->
      <div class="overlay" id="game-overlay">
        <div class="overlay-badge" id="overlay-badge">2-LEVEL ARCADE EDITION</div>
        <h1 id="overlay-title">AETHER JUMPER</h1>
        <p id="overlay-desc">
          Leap across floating sky ruins, collect energy gems, and reach the dimensional portal!
          Use <strong>Double Jump</strong> in mid-air to cross wide chasms and dodge hazards.
        </p>
        <div class="summary-grid hidden" id="overlay-stats">
          <div class="summary-card">
            <div class="label">Score</div>
            <div class="num" id="stat-final-score">0</div>
          </div>
          <div class="summary-card">
            <div class="label">Gems Collected</div>
            <div class="num" id="stat-final-gems">0</div>
          </div>
          <div class="summary-card">
            <div class="label">Lives Left</div>
            <div class="num" id="stat-final-lives">3</div>
          </div>
        </div>
        <button class="btn-arcade" id="overlay-btn">START LEVEL 1</button>
      </div>
    </main>

    <!-- Touch Controls (Visible on mobile/tablet viewports) -->
    <div class="touch-controls" id="touch-controls">
      <div class="touch-group">
        <button class="touch-btn" id="btn-left" aria-label="Move Left">◀</button>
        <button class="touch-btn" id="btn-right" aria-label="Move Right">▶</button>
      </div>
      <div class="touch-group">
        <button class="touch-btn jump-btn" id="btn-jump" aria-label="Jump">JUMP</button>
      </div>
    </div>

    <!-- Bottom Controls & Audio Bar -->
    <footer class="controls-bar">
      <div class="key-hints">
        <span><span class="key-cap">A</span><span class="key-cap">D</span> or <span class="key-cap">◀</span><span class="key-cap">▶</span> Move</span>
        <span><span class="key-cap">W</span> / <span class="key-cap">▲</span> / <span class="key-cap">Space</span> Jump &amp; Double Jump</span>
        <span><span class="key-cap">R</span> Restart Stage</span>
      </div>
      <button class="sound-toggle" id="sound-btn">🔊 SFX: ON</button>
    </footer>
  </div>

  <script>
    /**
     * AETHER JUMPER — Complete 2-Level 2D Platformer
     * Virtual resolution: 960 x 540 (16:9), scaled responsively to container.
     */
    (function () {
      const canvas = document.getElementById('gameCanvas');
      const ctx = canvas.getContext('2d');
      const stageContainer = document.getElementById('stage-container');

      // Virtual coordinate space for consistent physics across all screen sizes
      const WORLD_W = 960;
      const WORLD_H = 540;

      // UI Elements
      const hudLevel = document.getElementById('hud-level');
      const hudGems = document.getElementById('hud-gems');
      const hudScore = document.getElementById('hud-score');
      const hudLives = document.getElementById('hud-lives');

      const overlay = document.getElementById('game-overlay');
      const overlayBadge = document.getElementById('overlay-badge');
      const overlayTitle = document.getElementById('overlay-title');
      const overlayDesc = document.getElementById('overlay-desc');
      const overlayStats = document.getElementById('overlay-stats');
      const statFinalScore = document.getElementById('stat-final-score');
      const statFinalGems = document.getElementById('stat-final-gems');
      const statFinalLives = document.getElementById('stat-final-lives');
      const overlayBtn = document.getElementById('overlay-btn');
      const soundBtn = document.getElementById('sound-btn');

      // --- Web Audio API Synthesizer for Retro Arcade SFX (No external files needed) ---
      let soundEnabled = true;
      let audioCtx = null;

      function playTone(freq, endFreq, duration, type = 'square', volume = 0.08) {
        if (!soundEnabled) return;
        try {
          if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
          }
          if (audioCtx.state === 'suspended') {
            audioCtx.resume();
          }
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          if (endFreq) {
            osc.frequency.exponentialRampToValueAtTime(endFreq, audioCtx.currentTime + duration);
          }
          gain.gain.setValueAtTime(volume, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + duration);
        } catch (e) {
          // Ignore audio context restrictions if blocked
        }
      }

      const sfx = {
        jump: () => playTone(260, 520, 0.14, 'square', 0.07),
        doubleJump: () => playTone(390, 780, 0.16, 'triangle', 0.09),
        gem: () => {
          playTone(660, 990, 0.09, 'sine', 0.09);
          setTimeout(() => playTone(990, 1320, 0.12, 'sine', 0.08), 55);
        },
        stomp: () => playTone(220, 90, 0.15, 'sawtooth', 0.09),
        hurt: () => playTone(190, 65, 0.3, 'sawtooth', 0.11),
        portal: () => {
          playTone(440, 660, 0.12, 'triangle', 0.09);
          setTimeout(() => playTone(660, 880, 0.14, 'triangle', 0.09), 90);
          setTimeout(() => playTone(880, 1180, 0.22, 'triangle', 0.09), 180);
        }
      };

      soundBtn.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        soundBtn.textContent = soundEnabled ? '🔊 SFX: ON' : '🔇 SFX: OFF';
      });

      // --- Responsive Canvas Resizing ---
      function resizeCanvas() {
        const rect = stageContainer.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.max(1, Math.floor(rect.width * dpr));
        canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      }
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      // --- Parallax Starfield & Distant Mountains ---
      const stars = Array.from({ length: 65 }, (_, i) => ({
        x: (i * 173) % WORLD_W,
        y: (i * 97) % (WORLD_H - 120),
        size: (i % 3) + 1,
        speed: 0.15 + (i % 4) * 0.1,
        alpha: 0.35 + (i % 5) * 0.12
      }));

      // --- Level Definitions (2 Distinct Levels) ---
      const LEVELS = [
        // LEVEL 1: Introductory Sky Ruins (Platforms, Gems, Spikes, Exit Portal)
        {
          id: 1,
          name: 'STAGE 1: SKY RUINS',
          skyTop: '#0b132b',
          skyBottom: '#1c2541',
          accent: '#38bdf8',
          platformFill: '#1e293b',
          platformTop: '#38bdf8',
          spawn: { x: 64, y: 400 },
          portal: { x: 875, y: 112, w: 42, h: 58 },
          platforms: [
            // Starting safe ground
            { x: 0, y: 470, w: 300, h: 70 },
            // Gap with spikes below -> mid island
            { x: 355, y: 470, w: 260, h: 70 },
            // Right lower island
            { x: 675, y: 470, w: 285, h: 70 },
            // Ascending stepping platforms
            { x: 210, y: 365, w: 145, h: 22 },
            { x: 430, y: 315, w: 160, h: 22 },
            { x: 660, y: 265, w: 155, h: 22 },
            // Upper left bonus ledge
            { x: 75, y: 235, w: 150, h: 22 },
            // Final portal platform
            { x: 770, y: 170, w: 175, h: 24 }
          ],
          movingPlatforms: [],
          spikes: [
            // Hazard cluster on central ground
            { x: 455, y: 454, w: 60, h: 16 },
            // Hazard on right lower platform
            { x: 760, y: 454, w: 60, h: 16 }
          ],
          enemies: [],
          gems: [
            { x: 265, y: 325 },
            { x: 495, y: 275 },
            { x: 135, y: 195 },
            { x: 385, y: 195 },
            { x: 725, y: 225 },
            { x: 825, y: 425 },
            { x: 795, y: 130 }
          ]
        },

        // LEVEL 2: Crimson Citadel (Moving Platforms, Patrolling Drones, Spikes, Final Portal)
        {
          id: 2,
          name: 'STAGE 2: CRIMSON CITADEL',
          skyTop: '#160b28',
          skyBottom: '#2d1436',
          accent: '#f43f5e',
          platformFill: '#241734',
          platformTop: '#f43f5e',
          spawn: { x: 52, y: 400 },
          portal: { x: 882, y: 92, w: 42, h: 58 },
          platforms: [
            // Left launch deck
            { x: 0, y: 470, w: 210, h: 70 },
            // Central fortified island (with patrolling enemy)
            { x: 385, y: 430, w: 250, h: 26 },
            // Lower right outpost
            { x: 740, y: 465, w: 220, h: 75 },
            // Mid-left upper ledge
            { x: 65, y: 265, w: 165, h: 22 },
            // High central bridge (with patrolling enemy)
            { x: 345, y: 225, w: 235, h: 22 },
            // Final Victory Portal platform
            { x: 785, y: 150, w: 165, h: 24 }
          ],
          movingPlatforms: [
            // Horizontal ferry between start and central island
            { x: 230, y: 455, w: 110, h: 18, minX: 225, maxX: 355, minY: 455, maxY: 455, vx: 1.45, vy: 0 },
            // Vertical elevator on right side
            { x: 655, y: 340, w: 95, h: 18, minX: 655, maxX: 655, minY: 225, maxY: 410, vx: 0, vy: -1.65 },
            // High horizontal shuttle to final portal
            { x: 605, y: 175, w: 95, h: 18, minX: 595, maxX: 745, minY: 175, maxY: 175, vx: 1.6, vy: 0 }
          ],
          spikes: [
            { x: 145, y: 454, w: 45, h: 16 },
            { x: 485, y: 414, w: 45, h: 16 },
            { x: 810, y: 449, w: 60, h: 16 },
            { x: 440, y: 209, w: 45, h: 16 }
          ],
          enemies: [
            // Lower central patrol drone (can be stomped from above!)
            { x: 400, y: 402, w: 28, h: 28, minX: 392, maxX: 602, vx: 1.7 },
            // Upper bridge patrol drone
            { x: 360, y: 197, w: 28, h: 28, minX: 352, maxX: 548, vx: 2.05 },
            // Lower right guard
            { x: 755, y: 437, w: 28, h: 28, minX: 748, maxX: 925, vx: 1.55 }
          ],
          gems: [
            { x: 290, y: 405 },
            { x: 430, y: 380 },
            { x: 580, y: 380 },
            { x: 135, y: 220 },
            { x: 462, y: 165 },
            { x: 695, y: 270 },
            { x: 895, y: 415 },
            { x: 675, y: 130 },
            { x: 825, y: 110 }
          ]
        }
      ];

      // --- Game State ---
      const state = {
        mode: 'START', // 'START' | 'PLAYING' | 'LEVEL_CLEAR' | 'GAME_OVER' | 'VICTORY'
        levelIndex: 0,
        score: 0,
        totalGems: 0,
        lives: 3,
        maxLives: 3,
        shakeTimer: 0,
        time: 0,
        platforms: [],
        movingPlatforms: [],
        spikes: [],
        enemies: [],
        gems: [],
        particles: [],
        portal: null
      };

      // --- Player Entity ---
      const player = {
        x: 64,
        y: 400,
        w: 28,
        h: 36,
        vx: 0,
        vy: 0,
        speed: 4.3,
        jumpForce: -11.4,
        gravity: 0.54,
        maxFall: 13,
        grounded: false,
        jumpsUsed: 0,
        maxJumps: 2,
        facing: 1,
        invulnTimer: 0,
        coyoteTimer: 0,
        jumpBufferTimer: 0,
        ridingPlatform: null
      };

      // --- Input Handling ---
      const keys = {
        left: false,
        right: false,
        jumpPressed: false
      };

      function triggerJumpInput() {
        player.jumpBufferTimer = 8; // 8 frames jump buffer for crisp controls
      }

      window.addEventListener('keydown', (e) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space', ' '].includes(e.key)) {
          e.preventDefault();
        }
        const k = e.key.toLowerCase();
        if (k === 'arrowleft' || k === 'a') keys.left = true;
        if (k === 'arrowright' || k === 'd') keys.right = true;
        if (k === 'arrowup' || k === 'w' || e.code === 'Space') {
          if (!keys.jumpPressed) {
            keys.jumpPressed = true;
            if (state.mode === 'PLAYING') {
              triggerJumpInput();
            }
          }
        }
        if (k === 'r' && state.mode === 'PLAYING') {
          loadLevel(state.levelIndex, true);
        }
      });

      window.addEventListener('keyup', (e) => {
        const k = e.key.toLowerCase();
        if (k === 'arrowleft' || k === 'a') keys.left = false;
        if (k === 'arrowright' || k === 'd') keys.right = false;
        if (k === 'arrowup' || k === 'w' || e.code === 'Space') {
          keys.jumpPressed = false;
          // Variable jump height when releasing jump early
          if (player.vy < -4) {
            player.vy *= 0.62;
          }
        }
      });

      // Touch Controls Binding
      function bindTouchButton(id, onDown, onUp) {
        const btn = document.getElementById(id);
        if (!btn) return;
        const start = (e) => {
          e.preventDefault();
          btn.classList.add('pressed');
          onDown();
        };
        const end = (e) => {
          e.preventDefault();
          btn.classList.remove('pressed');
          if (onUp) onUp();
        };
        btn.addEventListener('touchstart', start, { passive: false });
        btn.addEventListener('touchend', end, { passive: false });
        btn.addEventListener('touchcancel', end, { passive: false });
        btn.addEventListener('mousedown', start);
        btn.addEventListener('mouseup', end);
        btn.addEventListener('mouseleave', end);
      }

      bindTouchButton('btn-left', () => (keys.left = true), () => (keys.left = false));
      bindTouchButton('btn-right', () => (keys.right = true), () => (keys.right = false));
      bindTouchButton(
        'btn-jump',
        () => {
          if (state.mode === 'PLAYING') triggerJumpInput();
        },
        () => {
          if (player.vy < -4) player.vy *= 0.62;
        }
      );

      // --- Particle System ---
      function spawnParticles(x, y, color, count = 12, speed = 3.5) {
        for (let i = 0; i < count; i++) {
          const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
          const mag = (0.4 + Math.random() * 0.8) * speed;
          state.particles.push({
            x,
            y,
            vx: Math.cos(angle) * mag,
            vy: Math.sin(angle) * mag - 0.8,
            life: 24 + Math.floor(Math.random() * 14),
            maxLife: 38,
            size: 2.5 + Math.random() * 3,
            color
          });
        }
      }

      // --- Level Management ---
      function loadLevel(index, keepRunStats = false) {
        state.levelIndex = index;
        const lvl = LEVELS[index];

        // Deep-clone level geometry so moving platforms, enemies, and gems reset cleanly
        state.platforms = lvl.platforms.map((p) => ({ ...p }));
        state.movingPlatforms = lvl.movingPlatforms.map((mp) => ({
          ...mp,
          dx: 0,
          dy: 0
        }));
        state.spikes = lvl.spikes.map((s) => ({ ...s }));
        state.enemies = lvl.enemies.map((en) => ({ ...en, alive: true }));
        state.gems = lvl.gems.map((g, idx) => ({
          x: g.x,
          y: g.y,
          collected: false,
          bobOffset: idx * 0.7
        }));
        state.portal = { ...lvl.portal };
        state.particles = [];

        respawnPlayer();

        if (!keepRunStats && index === 0) {
          state.score = 0;
          state.totalGems = 0;
          state.lives = state.maxLives;
        }

        updateHUD();
      }

      function respawnPlayer() {
        const lvl = LEVELS[state.levelIndex];
        player.x = lvl.spawn.x;
        player.y = lvl.spawn.y;
        player.vx = 0;
        player.vy = 0;
        player.grounded = false;
        player.jumpsUsed = 0;
        player.invulnTimer = 55;
        player.coyoteTimer = 0;
        player.jumpBufferTimer = 0;
        player.ridingPlatform = null;
        spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#38bdf8', 16, 3);
      }

      function updateHUD() {
        const collectedInStage = state.gems.filter((g) => g.collected).length;
        hudLevel.textContent = `${state.levelIndex + 1} / ${LEVELS.length}`;
        hudGems.textContent = `${collectedInStage} / ${state.gems.length}`;
        hudScore.textContent = String(state.score).padStart(4, '0');
        hudLives.textContent = '♥'.repeat(Math.max(0, state.lives)) + '♡'.repeat(Math.max(0, state.maxLives - state.lives));
      }

      // --- Overlay Screens Controller ---
      function showOverlay(mode) {
        state.mode = mode;
        overlay.classList.remove('hidden');
        overlayStats.classList.add('hidden');
        overlayBtn.classList.remove('btn-gold');

        if (mode === 'START') {
          overlayBadge.textContent = '2-LEVEL ARCADE EDITION';
          overlayTitle.textContent = 'AETHER JUMPER';
          overlayDesc.innerHTML =
            'Traverse floating sky ruins, collect energy gems, and reach the exit portal! Use <strong>Double Jump</strong> in mid-air to clear wide gaps and stomp patrolling drones.';
          overlayBtn.textContent = 'START LEVEL 1';
        } else if (mode === 'LEVEL_CLEAR') {
          overlayBadge.textContent = 'STAGE 1 COMPLETE!';
          overlayTitle.textContent = 'PORTAL ACTIVATED';
          overlayDesc.innerHTML =
            'Great run! Prepare for <strong>Stage 2: Crimson Citadel</strong> featuring moving platforms, patrolling security drones, and tighter jumps.';
          overlayStats.classList.remove('hidden');
          statFinalScore.textContent = state.score;
          statFinalGems.textContent = state.totalGems;
          statFinalLives.textContent = state.lives;
          overlayBtn.textContent = 'ENTER LEVEL 2';
        } else if (mode === 'GAME_OVER') {
          overlayBadge.textContent = 'OUT OF LIVES';
          overlayTitle.textContent = 'GAME OVER';
          overlayDesc.innerHTML =
            'The sky abyss claimed your runner. Reset your circuit and try conquering both stages again!';
          overlayStats.classList.remove('hidden');
          statFinalScore.textContent = state.score;
          statFinalGems.textContent = state.totalGems;
          statFinalLives.textContent = '0';
          overlayBtn.textContent = 'TRY AGAIN';
        } else if (mode === 'VICTORY') {
          overlayBadge.textContent = 'ALL 2 STAGES CLEARED!';
          overlayTitle.textContent = 'VICTORY!';
          overlayDesc.innerHTML =
            'You conquered both the Sky Ruins and the Crimson Citadel! Masterful platforming across the Aether realm.';
          overlayStats.classList.remove('hidden');
          statFinalScore.textContent = state.score;
          statFinalGems.textContent = state.totalGems;
          statFinalLives.textContent = state.lives;
          overlayBtn.textContent = 'PLAY AGAIN';
          overlayBtn.classList.add('btn-gold');
        }
      }

      function hideOverlay() {
        overlay.classList.add('hidden');
        state.mode = 'PLAYING';
      }

      overlayBtn.addEventListener('click', () => {
        if (state.mode === 'START' || state.mode === 'GAME_OVER' || state.mode === 'VICTORY') {
          loadLevel(0, false);
          hideOverlay();
        } else if (state.mode === 'LEVEL_CLEAR') {
          loadLevel(1, true);
          hideOverlay();
        }
      });

      // --- Collision Helpers ---
      function rectsOverlap(a, b) {
        return (
          a.x < b.x + b.w &&
          a.x + a.w > b.x &&
          a.y < b.y + b.h &&
          a.y + a.h > b.y
        );
      }

      function hurtPlayer() {
        if (player.invulnTimer > 0) return;
        sfx.hurt();
        state.lives -= 1;
        state.shakeTimer = 14;
        spawnParticles(player.x + player.w / 2, player.y + player.h / 2, '#f43f5e', 22, 4.5);
        updateHUD();

        if (state.lives <= 0) {
          showOverlay('GAME_OVER');
        } else {
          respawnPlayer();
        }
      }

      // --- Main Physics & Gameplay Step ---
      function update() {
        state.time += 1;
        if (state.shakeTimer > 0) state.shakeTimer -= 1;

        // Update particles even during overlays for visual polish
        for (let i = state.particles.length - 1; i >= 0; i--) {
          const pt = state.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.vy += 0.12;
          pt.life -= 1;
          if (pt.life <= 0) state.particles.splice(i, 1);
        }

        if (state.mode !== 'PLAYING') return;

        if (player.invulnTimer > 0) player.invulnTimer -= 1;

        // 1. Update Moving Platforms
        for (const mp of state.movingPlatforms) {
          const prevX = mp.x;
          const prevY = mp.y;
          mp.x += mp.vx;
          mp.y += mp.vy;

          if (mp.vx !== 0 && (mp.x <= mp.minX || mp.x >= mp.maxX)) {
            mp.x = Math.max(mp.minX, Math.min(mp.maxX, mp.x));
            mp.vx *= -1;
          }
          if (mp.vy !== 0 && (mp.y <= mp.minY || mp.y >= mp.maxY)) {
            mp.y = Math.max(mp.minY, Math.min(mp.maxY, mp.y));
            mp.vy *= -1;
          }
          mp.dx = mp.x - prevX;
          mp.dy = mp.y - prevY;
        }

        // Carry player if standing on a moving platform
        if (player.grounded && player.ridingPlatform) {
          player.x += player.ridingPlatform.dx;
          player.y += player.ridingPlatform.dy;
        }

        // 2. Horizontal Movement
        if (keys.left && !keys.right) {
          player.vx = -player.speed;
          player.facing = -1;
        } else if (keys.right && !keys.left) {
          player.vx = player.speed;
          player.facing = 1;
        } else {
          player.vx *= 0.72;
          if (Math.abs(player.vx) < 0.15) player.vx = 0;
        }

        player.x += player.vx;
        // Keep within horizontal screen boundaries
        if (player.x < 0) player.x = 0;
        if (player.x + player.w > WORLD_W) player.x = WORLD_W - player.w;

        const allSolids = [...state.platforms, ...state.movingPlatforms];

        // Resolve Horizontal Platform Collisions
        for (const plat of allSolids) {
          if (rectsOverlap(player, plat)) {
            if (player.vx > 0) {
              player.x = plat.x - player.w;
            } else if (player.vx < 0) {
              player.x = plat.x + plat.w;
            }
            player.vx = 0;
          }
        }

        // 3. Jump & Double Jump Logic (with Coyote Time & Jump Buffering)
        if (player.grounded) {
          player.coyoteTimer = 6;
          player.jumpsUsed = 0;
        } else if (player.coyoteTimer > 0) {
          player.coyoteTimer -= 1;
        }

        if (player.jumpBufferTimer > 0) {
          player.jumpBufferTimer -= 1;
          if (player.coyoteTimer > 0) {
            // Primary ground/coyote jump
            player.vy = player.jumpForce;
            player.grounded = false;
            player.coyoteTimer = 0;
            player.jumpBufferTimer = 0;
            player.jumpsUsed = 1;
            player.ridingPlatform = null;
            sfx.jump();
            spawnParticles(player.x + player.w / 2, player.y + player.h, '#94a3b8', 8, 2.2);
          } else if (player.jumpsUsed < player.maxJumps) {
            // Mid-air Double Jump
            player.vy = player.jumpForce * 0.92;
            player.jumpBufferTimer = 0;
            player.jumpsUsed = 2;
            sfx.doubleJump();
            spawnParticles(player.x + player.w / 2, player.y + player.h, '#38bdf8', 12, 3);
          }
        }

        // 4. Vertical Gravity & Platform Collisions
        player.vy = Math.min(player.vy + player.gravity, player.maxFall);
        player.y += player.vy;
        player.grounded = false;
        player.ridingPlatform = null;

        for (const plat of allSolids) {
          if (rectsOverlap(player, plat)) {
            if (player.vy > 0) {
              // Landing on top of platform
              player.y = plat.y - player.h;
              player.vy = 0;
              player.grounded = true;
              player.jumpsUsed = 0;
              if (plat.dx !== undefined) {
                player.ridingPlatform = plat;
              }
            } else if (player.vy < 0) {
              // Hitting head on underside of platform
              player.y = plat.y + plat.h;
              player.vy = 0;
            }
          }
        }

        // 5. Pitfall Check
        if (player.y > WORLD_H + 30) {
          hurtPlayer();
          return;
        }

        // 6. Spike Hazards Check (slightly forgiving hitbox)
        for (const sp of state.spikes) {
          const spikeHitbox = { x: sp.x + 5, y: sp.y + 4, w: sp.w - 10, h: sp.h - 4 };
          if (rectsOverlap(player, spikeHitbox)) {
            hurtPlayer();
            return;
          }
        }

        // 7. Patrolling Enemies (Level 2)
        for (const en of state.enemies) {
          if (!en.alive) continue;
          en.x += en.vx;
          if (en.x <= en.minX || en.x >= en.maxX) {
            en.x = Math.max(en.minX, Math.min(en.maxX, en.x));
            en.vx *= -1;
          }

          if (rectsOverlap(player, en)) {
            // Stomp check: player falling onto top half of enemy
            const playerBottomPrev = player.y + player.h - player.vy;
            if (player.vy > 0 && playerBottomPrev <= en.y + en.h * 0.55) {
              en.alive = false;
              player.vy = player.jumpForce * 0.78;
              player.jumpsUsed = 1;
              state.score += 250;
              sfx.stomp();
              spawnParticles(en.x + en.w / 2, en.y + en.h / 2, '#fb923c', 18, 4);
              updateHUD();
            } else {
              hurtPlayer();
              return;
            }
          }
        }

        // 8. Collectible Gems
        for (const gem of state.gems) {
          if (gem.collected) continue;
          const gemBox = { x: gem.x - 11, y: gem.y - 11, w: 22, h: 22 };
          if (rectsOverlap(player, gemBox)) {
            gem.collected = true;
            state.totalGems += 1;
            state.score += 100;
            sfx.gem();
            spawnParticles(gem.x, gem.y, '#fbbf24', 12, 3);
            updateHUD();
          }
        }

        // 9. Exit Portal Check
        if (state.portal && rectsOverlap(player, state.portal)) {
          sfx.portal();
          // Bonus points for remaining gems in stage
          state.score += 300;
          updateHUD();
          spawnParticles(
            state.portal.x + state.portal.w / 2,
            state.portal.y + state.portal.h / 2,
            '#10b981',
            28,
            5
          );

          if (state.levelIndex < LEVELS.length - 1) {
            showOverlay('LEVEL_CLEAR');
          } else {
            showOverlay('VICTORY');
          }
        }
      }

      // --- Rendering ---
      function drawBackground(lvl) {
        const grad = ctx.createLinearGradient(0, 0, 0, WORLD_H);
        grad.addColorStop(0, lvl.skyTop);
        grad.addColorStop(1, lvl.skyBottom);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, WORLD_W, WORLD_H);

        // Twinkling Parallax Stars
        for (const st of stars) {
          const sx = (st.x - state.time * st.speed + WORLD_W * 10) % WORLD_W;
          const pulse = 0.75 + 0.25 * Math.sin(state.time * 0.04 + st.x);
          ctx.fillStyle = `rgba(226, 232, 240, ${st.alpha * pulse})`;
          ctx.fillRect(sx, st.y, st.size, st.size);
        }

        // Distant Silhouette Peaks
        ctx.fillStyle = 'rgba(10, 15, 30, 0.45)';
        ctx.beginPath();
        ctx.moveTo(0, WORLD_H);
        ctx.lineTo(0, 390);
        ctx.lineTo(140, 290);
        ctx.lineTo(310, 410);
        ctx.lineTo(500, 260);
        ctx.lineTo(700, 395);
        ctx.lineTo(860, 285);
        ctx.lineTo(WORLD_W, 360);
        ctx.lineTo(WORLD_W, WORLD_H);
        ctx.closePath();
        ctx.fill();

        // Subtle Stage Watermark in Sky
        ctx.font = '700 13px "Press Start 2P", monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.14)';
        ctx.fillText(lvl.name, 22, 34);
      }

      function drawPlatform(plat, lvl, isMoving = false) {
        // Platform body
        ctx.fillStyle = isMoving ? '#293548' : lvl.platformFill;
        ctx.beginPath();
        ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 6);
        ctx.fill();

        // Glowing top trim
        ctx.fillStyle = isMoving ? '#fbbf24' : lvl.platformTop;
        ctx.beginPath();
        ctx.roundRect(plat.x, plat.y, plat.w, 5, [6, 6, 0, 0]);
        ctx.fill();

        // Subtle tech grid lines inside platforms
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        for (let gx = plat.x + 24; gx < plat.x + plat.w - 8; gx += 24) {
          ctx.beginPath();
          ctx.moveTo(gx, plat.y + 6);
          ctx.lineTo(gx, plat.y + plat.h - 2);
          ctx.stroke();
        }
      }

      function drawSpikes(sp) {
        const toothW = 15;
        const count = Math.floor(sp.w / toothW);
        for (let i = 0; i < count; i++) {
          const sx = sp.x + i * toothW;
          ctx.fillStyle = '#f43f5e';
          ctx.beginPath();
          ctx.moveTo(sx, sp.y + sp.h);
          ctx.lineTo(sx + toothW / 2, sp.y);
          ctx.lineTo(sx + toothW, sp.y + sp.h);
          ctx.closePath();
          ctx.fill();

          // Metallic highlight edge
          ctx.fillStyle = '#fda4af';
          ctx.beginPath();
          ctx.moveTo(sx + toothW / 2, sp.y);
          ctx.lineTo(sx + toothW / 2 + 3, sp.y + sp.h);
          ctx.lineTo(sx + toothW, sp.y + sp.h);
          ctx.closePath();
          ctx.fill();
        }
      }

      function drawGem(gem) {
        if (gem.collected) return;
        const bob = Math.sin(state.time * 0.08 + gem.bobOffset) * 4;
        const gx = gem.x;
        const gy = gem.y + bob;

        ctx.save();
        ctx.translate(gx, gy);

        // Outer aura
        ctx.fillStyle = 'rgba(251, 191, 36, 0.2)';
        ctx.beginPath();
        ctx.arc(0, 0, 14, 0, Math.PI * 2);
        ctx.fill();

        // Diamond shape
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(9, 0);
        ctx.lineTo(0, 10);
        ctx.lineTo(-9, 0);
        ctx.closePath();
        ctx.fill();

        // Inner shine
        ctx.fillStyle = '#fef3c7';
        ctx.beginPath();
        ctx.moveTo(0, -6);
        ctx.lineTo(4, -1);
        ctx.lineTo(0, 3);
        ctx.lineTo(-4, -1);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }

      function drawEnemy(en) {
        if (!en.alive) return;
        const hover = Math.sin(state.time * 0.14 + en.x * 0.05) * 2;
        const ex = en.x;
        const ey = en.y + hover;

        // Drone chassis
        ctx.fillStyle = '#fb923c';
        ctx.beginPath();
        ctx.roundRect(ex, ey + 4, en.w, en.h - 4, 8);
        ctx.fill();

        // Stompable top spring cap
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(ex + 6, ey, en.w - 12, 5);

        // Glowing visor eye
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(ex + 4, ey + 11, en.w - 8, 8);
        const eyeOffset = en.vx >= 0 ? 5 : -3;
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(ex + en.w / 2 - 3 + eyeOffset, ey + 13, 6, 4);
      }

      function drawPortal(portal) {
        if (!portal) return;
        const cx = portal.x + portal.w / 2;
        const cy = portal.y + portal.h / 2;
        const pulse = Math.sin(state.time * 0.1) * 3;

        // Portal Arch Frame
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.roundRect(portal.x, portal.y, portal.w, portal.h, [20, 20, 4, 4]);
        ctx.stroke();

        // Swirling Vortex Core
        const vortexGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 24 + pulse);
        vortexGrad.addColorStop(0, '#ecfdf5');
        vortexGrad.addColorStop(0.5, '#10b981');
        vortexGrad.addColorStop(1, 'rgba(16, 185, 129, 0.05)');
        ctx.fillStyle = vortexGrad;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 15 + pulse * 0.4, 23 + pulse * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Floating "EXIT" label
        ctx.font = '700 9px "Press Start 2P", monospace';
        ctx.fillStyle = '#6ee7b7';
        ctx.textAlign = 'center';
        ctx.fillText('EXIT', cx, portal.y - 8);
        ctx.textAlign = 'left';
      }

      function drawPlayer() {
        // Blink during invulnerability frames
        if (player.invulnTimer > 0 && Math.floor(player.invulnTimer / 4) % 2 === 0) {
          return;
        }

        ctx.save();
        const px = player.x;
        const py = player.y;

        // Jetpack / Scarf trail accent
        ctx.fillStyle = '#38bdf8';
        const scarfX = player.facing === 1 ? px - 5 : px + player.w - 1;
        const scarfWave = Math.sin(state.time * 0.25) * 3;
        ctx.fillRect(scarfX, py + 12 + scarfWave, 6, 11);

        // Suit Body
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.roundRect(px + 2, py + 8, player.w - 4, player.h - 10, 7);
        ctx.fill();

        // Helmet
        ctx.fillStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.roundRect(px, py, player.w, 18, 8);
        ctx.fill();

        // Visor
        ctx.fillStyle = '#0284c7';
        const visorX = player.facing === 1 ? px + 10 : px + 3;
        ctx.beginPath();
        ctx.roundRect(visorX, py + 5, 15, 7, 3);
        ctx.fill();

        // Visor Reflection
        ctx.fillStyle = '#bae6fd';
        ctx.fillRect(visorX + 2, py + 6, 6, 2);

        // Animated Boots
        ctx.fillStyle = '#38bdf8';
        const stride = player.grounded && Math.abs(player.vx) > 0.3 ? Math.sin(state.time * 0.35) * 3 : 0;
        ctx.fillRect(px + 4, py + player.h - 5 + stride, 7, 5);
        ctx.fillRect(px + player.w - 11, py + player.h - 5 - stride, 7, 5);

        // Double-jump charge indicator pips above head when airborne
        if (!player.grounded && player.jumpsUsed < player.maxJumps) {
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(px + player.w / 2, py - 7, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      function render() {
        ctx.save();
        const scaleX = canvas.width / WORLD_W;
        const scaleY = canvas.height / WORLD_H;
        ctx.scale(scaleX, scaleY);

        // Screen shake on damage
        if (state.shakeTimer > 0) {
          const sx = (Math.random() - 0.5) * 8;
          const sy = (Math.random() - 0.5) * 8;
          ctx.translate(sx, sy);
        }

        const lvl = LEVELS[state.levelIndex];
        drawBackground(lvl);

        // Static & Moving Platforms
        for (const plat of state.platforms) drawPlatform(plat, lvl, false);
        for (const mp of state.movingPlatforms) drawPlatform(mp, lvl, true);

        // Hazards, Gems, Portal, Enemies, Player
        for (const sp of state.spikes) drawSpikes(sp);
        for (const gem of state.gems) drawGem(gem);
        drawPortal(state.portal);
        for (const en of state.enemies) drawEnemy(en);
        drawPlayer();

        // Particles
        for (const pt of state.particles) {
          ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
          ctx.fillStyle = pt.color;
          ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
        }
        ctx.globalAlpha = 1;

        ctx.restore();
      }

      // --- Fixed-Timestep Game Loop ---
      let lastTime = 0;
      let accumulator = 0;
      const STEP = 1000 / 60;

      function gameLoop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const delta = Math.min(timestamp - lastTime, 100);
        lastTime = timestamp;
        accumulator += delta;

        while (accumulator >= STEP) {
          update();
          accumulator -= STEP;
        }

        render();
        requestAnimationFrame(gameLoop);
      }

      // Initialize Level 1 preview behind Start Overlay and boot loop on window load
      window.onload = function () {
        loadLevel(0, false);
        showOverlay('START');
        requestAnimationFrame(gameLoop);
      };
    })();
  </script>
</body>
</html>
