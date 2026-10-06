/* ==========================================================================
   AGENT-Σ // EDUCATIONAL ESCAPE ROOM & PROBABILITY LAB
   JavaScript Logic - Dynamic Question Engine, Hints, Guidance & State
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------------------------
    // 1. Audio Synthesizer (Web Audio API - Pure Synthesized Sounds)
    // ----------------------------------------------------------------------
    class SoundEngine {
        constructor() {
            this.ctx = null;
            this.muted = false;
        }

        init() {
            if (!this.ctx) {
                const AudioCtx = window.AudioContext || window.webkitAudioContext;
                if (AudioCtx) this.ctx = new AudioCtx();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        }

        toggleMute() {
            this.muted = !this.muted;
            return this.muted;
        }

        playClick() {
            if (this.muted) return;
            this.init();
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.05);
            gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.05);
        }

        playSuccess() {
            if (this.muted) return;
            this.init();
            if (!this.ctx) return;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            notes.forEach((freq, idx) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const startTime = this.ctx.currentTime + (idx * 0.08);
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, startTime);
                gain.gain.setValueAtTime(0, startTime);
                gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(startTime);
                osc.stop(startTime + 0.35);
            });
        }

        playError() {
            if (this.muted) return;
            this.init();
            if (!this.ctx) return;
            const osc1 = this.ctx.createOscillator();
            const osc2 = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc1.type = 'sawtooth';
            osc2.type = 'square';
            osc1.frequency.setValueAtTime(160, this.ctx.currentTime);
            osc2.frequency.setValueAtTime(110, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);
            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(this.ctx.destination);
            osc1.start();
            osc2.start();
            osc1.stop(this.ctx.currentTime + 0.25);
            osc2.stop(this.ctx.currentTime + 0.25);
        }

        playRoomUnlock() {
            if (this.muted) return;
            this.init();
            if (!this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(120, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(440, this.ctx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.6);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + 0.6);
        }

        playVictory() {
            if (this.muted) return;
            this.init();
            if (!this.ctx) return;
            const sequence = [
                { note: 523.25, time: 0 },
                { note: 659.25, time: 0.12 },
                { note: 783.99, time: 0.24 },
                { note: 1046.50, time: 0.36 },
                { note: 880.00, time: 0.52 },
                { note: 1046.50, time: 0.7 }
            ];
            sequence.forEach(item => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const start = this.ctx.currentTime + item.time;
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(item.note, start);
                gain.gain.setValueAtTime(0.25, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start(start);
                osc.stop(start + 0.4);
            });
        }
    }

    const sound = new SoundEngine();

    // ----------------------------------------------------------------------
    // 2. Background Animated Math Canvas
    // ----------------------------------------------------------------------
    const canvas = document.getElementById('math-canvas');
    const ctx = canvas.getContext('2d');
    let canvasWidth = canvas.width = window.innerWidth;
    let canvasHeight = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvasWidth = canvas.width = window.innerWidth;
        canvasHeight = canvas.height = window.innerHeight;
    });

    const symbols = ['Σ', 'X', 'P(X)', 'μ', 'σ', '√', '∫', 'E[X]', 'Var(X)', 'f(x)', 'dx', 'λ', 'P(A|B)'];
    const particles = [];
    for (let i = 0; i < 40; i++) {
        particles.push({
            x: Math.random() * canvasWidth,
            y: Math.random() * canvasHeight,
            text: symbols[Math.floor(Math.random() * symbols.length)],
            size: Math.random() * 16 + 14,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            alpha: Math.random() * 0.35 + 0.1
        });
    }

    function animateMathCanvas() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < -30) p.x = canvasWidth + 30;
            if (p.x > canvasWidth + 30) p.x = -30;
            if (p.y < -30) p.y = canvasHeight + 30;
            if (p.y > canvasHeight + 30) p.y = -30;

            ctx.font = `${p.size}px "Fira Code", monospace`;
            ctx.fillStyle = `rgba(0, 242, 254, ${p.alpha})`;
            ctx.fillText(p.text, p.x, p.y);
        });
        requestAnimationFrame(animateMathCanvas);
    }
    animateMathCanvas();

    // ----------------------------------------------------------------------
    // 3. ROOM METADATA & QUESTION DATABASE (35 High Quality Questions)
    // ----------------------------------------------------------------------
    const ROOMS_DATA = [
        {
            id: 1,
            title: "Probability Core",
            subtitle: "Expected Value",
            themeColor: "#00f2fe"
        },
        {
            id: 2,
            title: "Variance Vault",
            subtitle: "Variance",
            themeColor: "#10b981"
        },
        {
            id: 3,
            title: "Distribution Lab",
            subtitle: "PMF / PDF",
            themeColor: "#8b5cf6"
        },
        {
            id: 4,
            title: "Sigma Chamber",
            subtitle: "Standard Deviation",
            themeColor: "#f59e0b"
        },
        {
            id: 5,
            title: "Random Variable Lab",
            subtitle: "Random Variables",
            themeColor: "#ec4899"
        },
        {
            id: 6,
            title: "AI Probability Lab",
            subtitle: "AI Reasoning & Bayes",
            themeColor: "#6366f1"
        },
        {
            id: 7,
            title: "AGENT-Σ CORE",
            subtitle: "Final Challenge",
            themeColor: "#fbbf24"
        }
    ];

    const QUESTIONS_DATA = [
        // ================= ROOM 1: EXPECTED VALUE =================
        {
            id: 101,
            room: 1,
            topic: "Expected Value",
            question: "A machine generates discrete random values X with the following probability distribution:\n\nX:     1      2      3\nP(X): 0.2    0.5    0.3\n\nWhat is the expected value E(X)?",
            options: ["1.8", "2.1", "2.5", "3.0"],
            answer: 1,
            hint1: "Use the formula E(X) = Σ x · P(x).",
            hint2: "Multiply every value of X by its corresponding probability: (1 × 0.2) + (2 × 0.5) + (3 × 0.3).",
            explanation: "E(X) = (1 × 0.2) + (2 × 0.5) + (3 × 0.3) = 0.2 + 1.0 + 0.9 = 2.1"
        },
        {
            id: 102,
            room: 1,
            topic: "Expected Value",
            question: "Consider rolling a single fair 6-sided die. Let X be the number rolled. What is the expected value E(X)?",
            options: ["3.0", "3.5", "4.0", "3.2"],
            answer: 1,
            hint1: "A fair die has equal probabilities of 1/6 for each outcome from 1 to 6.",
            hint2: "E(X) = (1 + 2 + 3 + 4 + 5 + 6) / 6.",
            explanation: "E(X) = (1 + 2 + 3 + 4 + 5 + 6) / 6 = 21 / 6 = 3.5"
        },
        {
            id: 103,
            room: 1,
            topic: "Expected Value",
            question: "In a gaming module, a user wins $10 with probability 0.1, $5 with probability 0.3, and $0 with probability 0.6. What is the expected payout per game?",
            options: ["$2.50", "$3.00", "$1.50", "$2.00"],
            answer: 0,
            hint1: "Multiply each monetary payout by its probability and sum them up.",
            hint2: "(10 × 0.1) + (5 × 0.3) + (0 × 0.6) = 1.0 + 1.5 + 0.",
            explanation: "E(X) = (10 × 0.1) + (5 × 0.3) + (0 × 0.6) = 1.0 + 1.5 + 0 = $2.50"
        },
        {
            id: 104,
            room: 1,
            topic: "Expected Value",
            question: "Given a random variable X with expected value E(X) = 4, what is the expected value of the linear transformation Y = 3X + 2?",
            options: ["12", "14", "10", "16"],
            answer: 1,
            hint1: "Use the linearity property of expectation: E(aX + b) = a · E(X) + b.",
            hint2: "Substitute E(X) = 4 into E(3X + 2) = 3(4) + 2.",
            explanation: "E(3X + 2) = 3 · E(X) + 2 = 3(4) + 2 = 12 + 2 = 14"
        },
        {
            id: 105,
            room: 1,
            topic: "Expected Value",
            question: "A fair coin is flipped 4 times. Let X be the number of Heads. What is the expected number of Heads E(X)?",
            options: ["1", "2", "2.5", "3"],
            answer: 1,
            hint1: "For a binomial distribution, the expected value is E(X) = n · p.",
            hint2: "Here n = 4 trials and p = 0.5 probability of Heads.",
            explanation: "E(X) = n · p = 4 × 0.5 = 2"
        },

        // ================= ROOM 2: VARIANCE =================
        {
            id: 201,
            room: 2,
            topic: "Variance",
            question: "A discrete random variable X has E[X²] = 25 and E[X] = 4. What is the variance Var(X)?",
            options: ["9", "21", "16", "5"],
            answer: 0,
            hint1: "Recall the variance formula: Var(X) = E[X²] - (E[X])².",
            hint2: "Square E[X] to get 4² = 16, then subtract 16 from 25.",
            explanation: "Var(X) = E[X²] - (E[X])² = 25 - (4)² = 25 - 16 = 9"
        },
        {
            id: 202,
            room: 2,
            topic: "Variance",
            question: "If Var(X) = 3, what is the variance of the scaled random variable Y = 2X?",
            options: ["6", "12", "4", "9"],
            answer: 1,
            hint1: "Recall the variance scaling rule: Var(aX) = a² · Var(X).",
            hint2: "Here a = 2, so square 2 to get 4, then multiply by 3.",
            explanation: "Var(2X) = 2² · Var(X) = 4 × 3 = 12"
        },
        {
            id: 203,
            room: 2,
            topic: "Variance",
            question: "If Var(X) = 5, what is the variance of Y = X + 10?",
            options: ["15", "5", "50", "25"],
            answer: 1,
            hint1: "Adding a constant shift to a random variable does not change its spread/variance.",
            hint2: "Var(X + c) = Var(X).",
            explanation: "Var(X + 10) = Var(X) = 5 because constant shifts do not change dispersion."
        },
        {
            id: 204,
            room: 2,
            topic: "Variance",
            question: "A random variable X takes values 0 and 2 with equal probability 0.5. What is Var(X)?",
            options: ["0.5", "1.0", "2.0", "1.5"],
            answer: 1,
            hint1: "First calculate E(X) = (0 × 0.5) + (2 × 0.5) = 1. Then E[X²] = (0² × 0.5) + (2² × 0.5) = 2.",
            hint2: "Var(X) = E[X²] - (E[X])² = 2 - 1².",
            explanation: "E(X) = 1, E[X²] = 2. Var(X) = 2 - (1)² = 1.0"
        },
        {
            id: 205,
            room: 2,
            topic: "Variance",
            question: "For a Binomial random variable X with n = 10 trials and success probability p = 0.4, what is the variance Var(X)?",
            options: ["2.4", "4.0", "1.6", "2.0"],
            answer: 0,
            hint1: "The variance of a Binomial distribution is given by Var(X) = n · p · (1 - p).",
            hint2: "Substitute n = 10, p = 0.4, and (1 - p) = 0.6.",
            explanation: "Var(X) = n · p · (1 - p) = 10 × 0.4 × 0.6 = 2.4"
        },

        // ================= ROOM 3: PMF / PDF =================
        {
            id: 301,
            room: 3,
            topic: "PMF / PDF",
            question: "A PMF table for X is defined as:\n\nX:     1      2      3      4\nP(X): 0.2    0.3    k     0.1\n\nWhat is the value of k?",
            options: ["0.3", "0.4", "0.5", "0.2"],
            answer: 1,
            hint1: "The total sum of all probabilities in a valid PMF must equal 1.",
            hint2: "0.2 + 0.3 + k + 0.1 = 1.0 => 0.6 + k = 1.0.",
            explanation: "k = 1.0 - (0.2 + 0.3 + 0.1) = 1.0 - 0.6 = 0.4"
        },
        {
            id: 302,
            room: 3,
            topic: "PMF / PDF",
            question: "A continuous random variable X has PDF f(x) = c · x for 0 ≤ x ≤ 2 (and 0 elsewhere). What is the normalization constant c?",
            options: ["0.25", "0.5", "1.0", "0.75"],
            answer: 1,
            hint1: "The total area under a valid PDF must equal 1: ∫₀² c·x dx = 1.",
            hint2: "∫₀² x dx = [x²/2]₀² = 2. So c × 2 = 1.",
            explanation: "∫₀² c·x dx = c[x²/2]₀² = c(2) = 1 => c = 0.5"
        },
        {
            id: 303,
            room: 3,
            topic: "PMF / PDF",
            question: "Using the normalized PDF f(x) = 0.5x on 0 ≤ x ≤ 2, what is the probability P(1 ≤ X ≤ 2)?",
            options: ["0.50", "0.75", "0.25", "0.60"],
            answer: 1,
            hint1: "Integrate f(x) from x = 1 to x = 2: ∫₁² 0.5x dx.",
            hint2: "0.5 [x²/2]₁² = 0.5 (2 - 0.5) = 0.5 (1.5).",
            explanation: "P(1 ≤ X ≤ 2) = ∫₁² 0.5x dx = 0.5 [x²/2]₁² = 0.5(4/2 - 1/2) = 0.5 × 1.5 = 0.75"
        },
        {
            id: 304,
            room: 3,
            topic: "PMF / PDF",
            question: "A continuous random variable X is uniformly distributed over the interval [2, 10]. What is its constant PDF value f(x) on this interval?",
            options: ["0.10", "0.125", "0.20", "0.25"],
            answer: 1,
            hint1: "For a Uniform distribution on [a, b], the constant PDF is f(x) = 1 / (b - a).",
            hint2: "Substitute a = 2 and b = 10.",
            explanation: "f(x) = 1 / (10 - 2) = 1 / 8 = 0.125"
        },
        {
            id: 305,
            room: 3,
            topic: "PMF / PDF",
            question: "If a continuous random variable X has cumulative distribution function F(x) = x³ / 8 on [0, 2], what is P(X ≤ 1)?",
            options: ["0.125", "0.25", "0.50", "0.375"],
            answer: 0,
            hint1: "By definition of CDF, P(X ≤ x) = F(x).",
            hint2: "Evaluate F(1) = 1³ / 8.",
            explanation: "P(X ≤ 1) = F(1) = (1)³ / 8 = 1 / 8 = 0.125"
        },

        // ================= ROOM 4: STANDARD DEVIATION =================
        {
            id: 401,
            room: 4,
            topic: "Standard Deviation",
            question: "A random variable X has a variance Var(X) = 16. What is its standard deviation σ_X?",
            options: ["4", "8", "256", "2"],
            answer: 0,
            hint1: "Standard deviation is the positive square root of variance: σ = √Var(X).",
            hint2: "Take the square root of 16.",
            explanation: "σ_X = √Var(X) = √16 = 4"
        },
        {
            id: 402,
            room: 4,
            topic: "Standard Deviation",
            question: "If the standard deviation of X is σ_X = 3, what is the standard deviation of Y = 5X - 2?",
            options: ["13", "15", "45", "75"],
            answer: 1,
            hint1: "Recall σ_(aX + b) = |a| · σ_X.",
            hint2: "Multiply the scaling factor 5 by σ_X = 3. Constant offsets do not change standard deviation.",
            explanation: "σ_(5X - 2) = 5 · σ_X = 5 × 3 = 15"
        },
        {
            id: 403,
            room: 4,
            topic: "Standard Deviation",
            question: "A test score variable X has mean μ = 70 and standard deviation σ = 10. What is the Z-score for a score of X = 85?",
            options: ["1.5", "1.2", "2.0", "0.85"],
            answer: 0,
            hint1: "Use the Z-score standardization formula: Z = (X - μ) / σ.",
            hint2: "Substitute X = 85, μ = 70, σ = 10 into (85 - 70) / 10.",
            explanation: "Z = (85 - 70) / 10 = 15 / 10 = 1.5"
        },
        {
            id: 404,
            room: 4,
            topic: "Standard Deviation",
            question: "According to Chebyshev's Inequality, for ANY distribution, at least what proportion of data values must lie within k = 2 standard deviations of the mean?",
            options: ["50%", "75%", "88.9%", "95%"],
            answer: 1,
            hint1: "Chebyshev's Inequality states P(|X - μ| < kσ) ≥ 1 - 1/k².",
            hint2: "Substitute k = 2: 1 - 1/2² = 1 - 1/4 = 3/4 = 0.75.",
            explanation: "P(|X - μ| < 2σ) ≥ 1 - 1/2² = 1 - 1/4 = 0.75 (75%)"
        },
        {
            id: 405,
            room: 4,
            topic: "Standard Deviation",
            question: "A Binomial random variable X has n = 100 trials and p = 0.36. What is its standard deviation σ?",
            options: ["4.8", "6.0", "23.04", "3.6"],
            answer: 0,
            hint1: "First calculate variance Var(X) = n · p · (1 - p), then take square root.",
            hint2: "Var(X) = 100 × 0.36 × 0.64 = 23.04. σ = √23.04.",
            explanation: "Var(X) = 100 × 0.36 × 0.64 = 23.04 => σ = √23.04 = 4.8"
        },

        // ================= ROOM 5: RANDOM VARIABLES =================
        {
            id: 501,
            room: 5,
            topic: "Random Variables",
            question: "Which of the following measurements is classified as a CONTINUOUS random variable?",
            options: [
                "Number of defect items in a batch",
                "Time taken for an AI query to complete",
                "Number of students present in class",
                "Outcome of rolling a die"
            ],
            answer: 1,
            hint1: "Continuous random variables measure quantities over a continuous range (time, height, weight), not countable distinct integers.",
            hint2: "Time can take any real value in an interval.",
            explanation: "Completion time is measured on a continuous interval, making it a continuous random variable."
        },
        {
            id: 502,
            room: 5,
            topic: "Random Variables",
            question: "A single Bernoulli trial has success probability p = 0.7. What is the variance Var(X) of this Bernoulli variable?",
            options: ["0.21", "0.70", "0.30", "0.49"],
            answer: 0,
            hint1: "For a Bernoulli variable, Var(X) = p · (1 - p).",
            hint2: "Substitute p = 0.7: 0.7 × (1 - 0.7) = 0.7 × 0.3.",
            explanation: "Var(X) = p · (1 - p) = 0.7 × 0.3 = 0.21"
        },
        {
            id: 503,
            room: 5,
            topic: "Random Variables",
            question: "In 3 independent flips of a fair coin, what is the probability P(X = 2) of getting EXACTLY 2 Heads?",
            options: ["0.25", "0.375", "0.50", "0.125"],
            answer: 1,
            hint1: "Use the Binomial formula P(X = k) = C(n, k) · p^k · (1-p)^(n-k).",
            hint2: "C(3, 2) × (0.5)² × (0.5)¹ = 3 × 0.125 = 0.375.",
            explanation: "P(X = 2) = C(3, 2) (0.5)³ = 3 × 0.125 = 0.375"
        },
        {
            id: 504,
            room: 5,
            topic: "Random Variables",
            question: "A web server receives an average of λ = 4 incoming requests per minute following a Poisson distribution. What is the variance Var(X) of requests per minute?",
            options: ["2", "4", "16", "8"],
            answer: 1,
            hint1: "A key property of the Poisson distribution is that its mean and variance are equal.",
            hint2: "For Poisson(λ), E(X) = Var(X) = λ.",
            explanation: "For a Poisson distribution, Var(X) = λ = 4."
        },
        {
            id: 505,
            room: 5,
            topic: "Random Variables",
            question: "Which probability property guarantees that for a Geometric random variable X, P(X > s + t | X > s) = P(X > t)?",
            options: ["Central Limit Property", "Memoryless Property", "Independence Axiom", "Stationary Property"],
            answer: 1,
            hint1: "This property means the process 'forgets' past failed attempts.",
            hint2: "Both Geometric (discrete) and Exponential (continuous) distributions share this memoryless property.",
            explanation: "The Memoryless Property states that past history does not affect future probability distribution."
        },

        // ================= ROOM 6: AI PROBABILITY LAB =================
        {
            id: 601,
            room: 6,
            topic: "AI Reasoning & Bayes",
            question: "An AI Spam filter has P(Spam) = 0.2. A word 'URGENT' appears in 80% of spam emails P(W|Spam)=0.8 and 10% of normal emails P(W|NotSpam)=0.1. What is P(Spam | URGENT)?",
            options: ["0.67", "0.50", "0.80", "0.33"],
            answer: 0,
            hint1: "Apply Bayes' Theorem: P(Spam|W) = P(W|Spam)P(Spam) / P(W).",
            hint2: "P(W) = (0.8 × 0.2) + (0.1 × 0.8) = 0.16 + 0.08 = 0.24. Then 0.16 / 0.24 = 2/3.",
            explanation: "P(Spam|W) = (0.8 × 0.2) / [(0.8 × 0.2) + (0.1 × 0.8)] = 0.16 / 0.24 = 2/3 ≈ 0.67"
        },
        {
            id: 602,
            room: 6,
            topic: "AI Reasoning & Bayes",
            question: "An AI Vision classifier predicts 100 images as 'Cat'. Out of these 100 predictions, 80 are True Positive cats and 20 are False Positives. What is the Precision?",
            options: ["80%", "75%", "90%", "85%"],
            answer: 0,
            hint1: "Precision is calculated as Precision = True Positives / (True Positives + False Positives).",
            hint2: "Substitute TP = 80 and FP = 20: 80 / (80 + 20) = 80 / 100.",
            explanation: "Precision = TP / (TP + FP) = 80 / 100 = 0.80 (80%)"
        },
        {
            id: 603,
            room: 6,
            topic: "AI Reasoning & Bayes",
            question: "In a Reinforcement Learning setup, an AI agent gets reward +10 with prob 0.6 and penalty -5 with prob 0.4. What is the expected reward E(R)?",
            options: ["+4.0", "+3.5", "+5.0", "+2.5"],
            answer: 0,
            hint1: "Calculate expectation: E(R) = (10 × 0.6) + (-5 × 0.4).",
            hint2: "6.0 - 2.0 = +4.0.",
            explanation: "E(R) = (10 × 0.6) + (-5 × 0.4) = 6.0 - 2.0 = +4.0"
        },
        {
            id: 604,
            room: 6,
            topic: "AI Reasoning & Bayes",
            question: "A 2-state Markov chain has transition matrix: State A -> A (0.7), A -> B (0.3). If system starts in State A, what is the probability of being in State A after 1 step?",
            options: ["0.70", "0.30", "0.50", "0.80"],
            answer: 0,
            hint1: "Look directly at the transition probability P(A -> A).",
            hint2: "The transition matrix explicitly specifies P(A -> A) = 0.7.",
            explanation: "The 1-step transition probability from State A to State A is 0.70."
        },
        {
            id: 605,
            room: 6,
            topic: "AI Reasoning & Bayes",
            question: "A Neural Network Softmax layer receives equal logit scores z = [2.0, 2.0] for 2 output classes. What probability does Softmax assign to Class 1?",
            options: ["0.50", "0.73", "0.25", "1.00"],
            answer: 0,
            hint1: "Softmax formula for equal logits e^z1 / (e^z1 + e^z2).",
            hint2: "Since logit 1 = logit 2, the probabilities must be split equally (50% each).",
            explanation: "Equal logits yield equal Softmax probabilities: e²/ (e² + e²) = 1/2 = 0.50 (50%)"
        },

        // ================= ROOM 7: AGENT-Σ CORE (FINAL) =================
        {
            id: 701,
            room: 7,
            topic: "Final Challenge",
            question: "A random variable X has E[X] = 5 and Var(X) = 4. What is the value of E[X²]?",
            options: ["29", "21", "25", "9"],
            answer: 0,
            hint1: "Rearrange Var(X) = E[X²] - (E[X])² to get E[X²] = Var(X) + (E[X])².",
            hint2: "Add Var(X) = 4 and 5² = 25.",
            explanation: "E[X²] = Var(X) + (E[X])² = 4 + 25 = 29"
        },
        {
            id: 702,
            room: 7,
            topic: "Final Challenge",
            question: "Given PDF f(x) = 3x² on [0, 1], what is the expected value E[X]?",
            options: ["0.75", "0.50", "0.60", "0.80"],
            answer: 0,
            hint1: "E[X] = ∫₀¹ x · f(x) dx = ∫₀¹ 3x³ dx.",
            hint2: "3 [x⁴/4]₀¹ = 3(1/4) = 0.75.",
            explanation: "E[X] = ∫₀¹ x(3x²) dx = ∫₀¹ 3x³ dx = 3[x⁴/4]₀¹ = 3/4 = 0.75"
        },
        {
            id: 703,
            room: 7,
            topic: "Final Challenge",
            question: "System A fails with prob 0.1, System B with prob 0.2. An AI query routes to A 60% of time and B 40% of time. What is total failure probability?",
            options: ["0.14", "0.15", "0.12", "0.18"],
            answer: 0,
            hint1: "Use the Law of Total Probability: P(Fail) = P(Fail|A)P(A) + P(Fail|B)P(B).",
            hint2: "(0.1 × 0.6) + (0.2 × 0.4) = 0.06 + 0.08 = 0.14.",
            explanation: "P(Fail) = (0.1 × 0.6) + (0.2 × 0.4) = 0.06 + 0.08 = 0.14"
        },
        {
            id: 704,
            room: 7,
            topic: "Final Challenge",
            question: "X and Y are INDEPENDENT random variables with Var(X) = 9 and Var(Y) = 16. What is the standard deviation σ_(X+Y)?",
            options: ["5", "7", "25", "12"],
            answer: 0,
            hint1: "For independent variables, Var(X + Y) = Var(X) + Var(Y). Then take square root.",
            hint2: "Var(X + Y) = 9 + 16 = 25. σ = √25.",
            explanation: "Var(X + Y) = 9 + 16 = 25 => σ_(X+Y) = √25 = 5"
        },
        {
            id: 705,
            room: 7,
            topic: "Final Challenge",
            question: "An AI system's error rate per query has expected value 0.05. If 100 independent queries are processed, what is expected total number of errors?",
            options: ["5", "10", "2.5", "50"],
            answer: 0,
            hint1: "Linearity of expectation applies: E[Total] = n · E[Single Query].",
            hint2: "100 × 0.05 = 5.",
            explanation: "E[Total Errors] = 100 × 0.05 = 5"
        }
    ];

    // ----------------------------------------------------------------------
    // 4. GAME STATE MANAGEMENT & LOCAL STORAGE
    // ----------------------------------------------------------------------
    let gameState = {
        completedRooms: [],
        currentRoomId: 1,
        currentQIndex: 0,
        attemptsCount: 0,
        totalXP: 0,
        totalAttempts: 0,
        totalCorrect: 0,
        totalHintsUsed: 0,
        roomProgress: {}
    };

    function saveProgress() {
        try {
            localStorage.setItem('agent_sigma_state', JSON.stringify({
                completedRooms: gameState.completedRooms,
                currentRoomId: gameState.currentRoomId,
                currentQIndex: gameState.currentQIndex,
                attemptsCount: gameState.attemptsCount,
                totalXP: gameState.totalXP,
                totalAttempts: gameState.totalAttempts,
                totalCorrect: gameState.totalCorrect,
                totalHintsUsed: gameState.totalHintsUsed,
                roomProgress: gameState.roomProgress
            }));
        } catch (e) {
            console.error("LocalStorage save error:", e);
        }
    }

    function loadProgress() {
        try {
            const saved = localStorage.getItem('agent_sigma_state');
            if (saved) {
                const parsed = JSON.parse(saved);
                gameState.completedRooms = parsed.completedRooms || [];
                gameState.currentRoomId = parsed.currentRoomId || 1;
                gameState.currentQIndex = Number.isInteger(parsed.currentQIndex) ? parsed.currentQIndex : 0;
                gameState.attemptsCount = Number.isInteger(parsed.attemptsCount) ? parsed.attemptsCount : 0;
                gameState.totalXP = parsed.totalXP || 0;
                gameState.totalAttempts = parsed.totalAttempts || 0;
                gameState.totalCorrect = parsed.totalCorrect || 0;
                gameState.totalHintsUsed = parsed.totalHintsUsed || 0;
                gameState.roomProgress = parsed.roomProgress || {};

                // Update landing page stats preview
                const landingSavedRooms = document.getElementById('landing-saved-rooms');
                const landingSavedXP = document.getElementById('landing-saved-xp');
                const landingStats = document.getElementById('landing-stats');
                if (landingSavedRooms && landingSavedXP && landingStats) {
                    landingStats.classList.remove('hidden');
                    landingSavedRooms.textContent = `${gameState.completedRooms.length} / 7 Rooms`;
                    landingSavedXP.textContent = `${gameState.totalXP} XP`;
                }
            }
        } catch (e) {
            console.error("LocalStorage load error:", e);
        }
    }

    function resetProgress() {
        localStorage.removeItem('agent_sigma_state');
        gameState = {
            completedRooms: [],
            currentRoomId: 1,
            currentQIndex: 0,
            attemptsCount: 0,
            totalXP: 0,
            totalAttempts: 0,
            totalCorrect: 0,
            totalHintsUsed: 0,
            roomProgress: {}
        };
        energyFlowLayer.classList.remove('active');
        unlockSequence.classList.remove('active');
        unlockSequence.querySelectorAll('.unlock-step').forEach(step => step.classList.remove('visible'));
        updateGlobalHUD();
        showRoomMap();
    }

    // ----------------------------------------------------------------------
    // 5. DOM ELEMENTS
    // ----------------------------------------------------------------------
    const globalHUD = document.getElementById('global-hud');
    const landingScreen = document.getElementById('landing-screen');
    const mapScreen = document.getElementById('map-screen');
    const gameScreen = document.getElementById('game-screen');
    const victoryScreen = document.getElementById('victory-screen');
    const roomsGrid = document.getElementById('rooms-grid');
    const roomScene = document.getElementById('room-scene');
    const energyFlowLayer = document.getElementById('energy-flow-layer');
    const unlockSequence = document.getElementById('unlock-sequence');

    const btnStart = document.getElementById('btn-start');
    const btnHowToPlay = document.getElementById('btn-how-to-play');
    const modalHowToPlay = document.getElementById('how-to-play-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnModalCloseAction = document.getElementById('btn-modal-close-action');

    const btnSoundToggle = document.getElementById('btn-sound-toggle');
    const soundIconOn = document.getElementById('sound-icon-on');
    const soundIconOff = document.getElementById('sound-icon-off');
    const btnHudMap = document.getElementById('btn-hud-map');
    const btnHudSettings = document.getElementById('btn-hud-settings');

    const resetModal = document.getElementById('reset-modal');
    const btnConfirmReset = document.getElementById('btn-confirm-reset');
    const btnCancelReset = document.getElementById('btn-cancel-reset');

    const completionModal = document.getElementById('completion-modal');
    const btnContinueNextRoom = document.getElementById('btn-continue-next-room');
    const btnReturnMap = document.getElementById('btn-return-map');

    // Gameplay elements
    const agentDialogue = document.getElementById('agent-dialogue');
    const qRoomTitle = document.getElementById('q-room-title');
    const qNumberTag = document.getElementById('q-number-tag');
    const qTopicBadge = document.getElementById('q-topic-badge');
    const qText = document.getElementById('q-text');
    const optionsGrid = document.getElementById('options-grid');
    const feedbackPanel = document.getElementById('feedback-panel');
    const btnNextQ = document.getElementById('btn-next-q');
    let questionAnswerLocked = false;

    optionsGrid.addEventListener('click', (event) => {
        const optionCard = event.target.closest('.option-card');
        if (!optionCard) return;

        const currentQuestion = getRoomQuestions(gameState.currentRoomId)[gameState.currentQIndex];
        handleOptionClick(Number(optionCard.dataset.index), optionCard, currentQuestion);
    });

    optionsGrid.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;

        const optionCard = event.target.closest('.option-card');
        if (!optionCard) return;

        event.preventDefault();
        const currentQuestion = getRoomQuestions(gameState.currentRoomId)[gameState.currentQIndex];
        handleOptionClick(Number(optionCard.dataset.index), optionCard, currentQuestion);
    });

    // HUD Stats
    const hudProgressFill = document.getElementById('hud-progress-fill');
    const hudProgressPct = document.getElementById('hud-progress-pct');
    const hudXPVal = document.getElementById('hud-xp-val');
    const hudRoomsVal = document.getElementById('hud-rooms-val');

    // Load saved data at startup
    loadProgress();

    // ----------------------------------------------------------------------
    // 6. SCREEN SWITCHING & NAVIGATION
    // ----------------------------------------------------------------------
    function hideAllScreens() {
        landingScreen.classList.add('hidden');
        mapScreen.classList.add('hidden');
        gameScreen.classList.add('hidden');
        victoryScreen.classList.add('hidden');
    }

    function updateGlobalHUD() {
        hudXPVal.textContent = gameState.totalXP;
        hudRoomsVal.textContent = `${gameState.completedRooms.length}/7`;
        const pct = Math.round((gameState.completedRooms.length / 7) * 100);
        hudProgressPct.textContent = `${pct}%`;
        hudProgressFill.style.width = `${pct}%`;
    }

    function showLanding() {
        hideAllScreens();
        globalHUD.classList.add('hidden');
        landingScreen.classList.remove('hidden');
    }

    function showRoomMap() {
        hideAllScreens();
        globalHUD.classList.remove('hidden');
        btnHudMap.classList.add('hidden'); // map button hidden on map screen
        mapScreen.classList.remove('hidden');
        updateGlobalHUD();
        renderRoomMap();
    }

    function renderRoomMap() {
        roomsGrid.innerHTML = '';

        ROOMS_DATA.forEach(room => {
            const isCompleted = gameState.completedRooms.includes(room.id);
            const isAvailable = room.id === 1 || gameState.completedRooms.includes(room.id - 1);
            const isCurrent = gameState.currentRoomId === room.id && !isCompleted;

            let stateClass = 'locked';
            let statusText = 'LOCKED';
            let statusIcon = '🔒';

            if (isCompleted) {
                stateClass = 'completed';
                statusText = 'RESTORED';
                statusIcon = '✓';
            } else if (isCurrent) {
                stateClass = 'in-progress';
                statusText = 'IN PROGRESS';
                statusIcon = '⚡';
            } else if (isAvailable) {
                stateClass = 'available';
                statusText = 'AVAILABLE';
                statusIcon = '▶';
            }

            const roomCard = document.createElement('div');
            roomCard.className = `room-card glass-card ${stateClass}`;
            roomCard.style.setProperty('--room-theme-color', room.themeColor);

            roomCard.innerHTML = `
                <div class="room-card-top">
                    <span class="room-number">ROOM 0${room.id}</span>
                    <span class="room-status-badge ${stateClass}">
                        <span>${statusIcon}</span>
                        <span>${statusText}</span>
                    </span>
                </div>
                <div class="room-card-body">
                    <h3 class="room-card-title">${room.title}</h3>
                    <span class="room-card-topic">${room.subtitle}</span>
                </div>
                <div class="room-card-footer">
                    <span class="room-progress-text">${isCompleted ? '5 / 5 Solved' : '5 Questions'}</span>
                    <button class="btn btn-sm ${isCompleted ? 'btn-secondary' : isAvailable ? 'btn-primary btn-glow' : 'btn-secondary'}" ${!isAvailable && !isCompleted ? 'disabled' : ''}>
                        ${isCompleted ? 'REVIEW' : 'ENTER ROOM'}
                    </button>
                </div>
            `;

            if (isAvailable || isCompleted) {
                roomCard.style.cursor = 'pointer';
                roomCard.addEventListener('click', () => {
                    sound.playClick();
                    enterRoom(room.id);
                });
            }

            roomsGrid.appendChild(roomCard);
        });
    }

    function enterRoom(roomId) {
        gameState.currentRoomId = roomId;
        gameState.currentQIndex = gameState.completedRooms.includes(roomId) ? 4 : Math.min(gameState.currentQIndex, 4);
        gameState.attemptsCount = gameState.completedRooms.includes(roomId) ? 0 : gameState.attemptsCount;
        roomScene.classList.remove('opening', 'puzzle-error', 'correct');
        roomScene.style.setProperty('--room-theme', ROOMS_DATA.find(r => r.id === roomId).themeColor);
        unlockSequence.classList.remove('active');
        energyFlowLayer.classList.remove('active');

        hideAllScreens();
        globalHUD.classList.remove('hidden');
        btnHudMap.classList.remove('hidden');
        gameScreen.classList.remove('hidden');

        updateGlobalHUD();
        updateRoomScene();
        renderQuestion();
        requestAnimationFrame(() => roomScene.classList.add('opening'));
        setTimeout(() => roomScene.classList.remove('opening'), 1800);
    }

    function updateRoomScene() {
        const room = ROOMS_DATA.find(r => r.id === gameState.currentRoomId);
        document.getElementById('room-hud-brand').textContent = `AGENT-Σ // SECTOR 0${room.id}`;
        document.getElementById('room-hud-status').innerHTML = `<i></i> LOCKED`;
        document.getElementById('energy-hud').textContent = '00%';
        document.getElementById('attempt-hud').textContent = gameState.attemptsCount;
        document.getElementById('hint-hud').textContent = gameState.totalHintsUsed;
        roomScene.style.setProperty('--room-theme', room.themeColor);
    }

    // ----------------------------------------------------------------------
    // 7. QUESTION ENGINE & ANSWER HANDLING
    // ----------------------------------------------------------------------
    function getRoomQuestions(roomId) {
        return QUESTIONS_DATA.filter(q => q.room === roomId);
    }

    function renderQuestion() {
        const roomQuestions = getRoomQuestions(gameState.currentRoomId);
        const qData = roomQuestions[gameState.currentQIndex];
        const roomInfo = ROOMS_DATA.find(r => r.id === gameState.currentRoomId);

        qRoomTitle.textContent = `ROOM 0${roomInfo.id} — ${roomInfo.title.toUpperCase()}`;
        qNumberTag.textContent = `QUESTION ${gameState.currentQIndex + 1} / 5`;
        qTopicBadge.textContent = qData.topic;
        qText.textContent = qData.question;
        document.getElementById('attempt-hud').textContent = '0';
        document.getElementById('room-hud-status').innerHTML = '<i></i> LOCKED';

        // Reset dynamic dialogue
        agentDialogue.textContent = `"Let's restore this system. Read the question carefully and apply probability principles."`;

        // Hide feedback panel & next button
        feedbackPanel.classList.add('hidden');
        feedbackPanel.className = 'feedback-panel hidden';
        btnNextQ.classList.add('hidden');
        questionAnswerLocked = false;

        // Render options grid
        optionsGrid.innerHTML = '';
        const keys = ['A', 'B', 'C', 'D'];

        qData.options.forEach((optText, idx) => {
            const optCard = document.createElement('div');
            optCard.className = 'option-card';
            optCard.setAttribute('tabindex', '0');
            optCard.setAttribute('role', 'button');
            optCard.dataset.index = idx;

            optCard.innerHTML = `
                <span class="option-key">${keys[idx]}</span>
                <span class="option-text">${optText}</span>
            `;

            optionsGrid.appendChild(optCard);
        });
    }

    function handleOptionClick(selectedIdx, cardEl, qData) {
        if (questionAnswerLocked || cardEl.classList.contains('correct')) return;

        questionAnswerLocked = true;
        cardEl.classList.add('selected');

        const roomInfo = ROOMS_DATA.find(r => r.id === gameState.currentRoomId);
        gameState.totalAttempts++;

        const isCorrect = (selectedIdx === qData.answer);

        if (isCorrect) {
            // ================= CORRECT ANSWER =================
            sound.playSuccess();
            cardEl.classList.remove('wrong');
            cardEl.classList.add('correct');

            // Disable all option cards after the correct answer is confirmed
            document.querySelectorAll('.option-card').forEach(c => c.style.pointerEvents = 'none');

            gameState.totalCorrect++;
            gameState.totalXP += 20;
            gameState.roomProgress[gameState.currentRoomId] = Math.max(gameState.roomProgress[gameState.currentRoomId] || 0, gameState.currentQIndex + 1);
            updateGlobalHUD();
            saveProgress();
            roomScene.classList.add('correct');
            document.getElementById('energy-hud').textContent = '100%';
            document.getElementById('room-hud-status').innerHTML = '<i></i> STABILIZING';

            // AGENT-Σ Praise
            agentDialogue.textContent = `"Excellent work! ${roomInfo.title} is stabilizing."`;

            // Feedback Panel
            feedbackPanel.className = 'feedback-panel success';
            feedbackPanel.innerHTML = `
                <div class="feedback-title-row">
                    <span class="feedback-badge">✓ CORRECT!</span>
                    <span class="xp-gained-tag">+20 XP</span>
                </div>
                <div class="explanation-box-container">
                    <div class="explanation-box-title">WORKED SOLUTION:</div>
                    <div class="explanation-box-content">${qData.explanation}</div>
                </div>
            `;
            feedbackPanel.classList.remove('hidden');

            btnNextQ.classList.remove('hidden');
            btnNextQ.classList.add('active-next');
            btnNextQ.onclick = () => handleNextQuestion();

        } else {
            // ================= WRONG ANSWER =================
            sound.playError();
            cardEl.classList.add('wrong');
            setTimeout(() => {
                cardEl.classList.remove('selected', 'wrong');
                questionAnswerLocked = false;
            }, 500);

            gameState.attemptsCount++;
            document.getElementById('attempt-hud').textContent = gameState.attemptsCount;
            document.getElementById('hint-hud').textContent = gameState.totalHintsUsed;
            saveProgress();
            roomScene.classList.remove('correct');
            roomScene.classList.add('puzzle-error');
            setTimeout(() => roomScene.classList.remove('puzzle-error'), 500);

            if (gameState.attemptsCount === 1) {
                // First Wrong Attempt -> Show HINT 1
                gameState.totalHintsUsed++;
                agentDialogue.textContent = `"Your calculation needs another look. Don't worry, check the hint below."`;

                feedbackPanel.className = 'feedback-panel error-hint';
                feedbackPanel.innerHTML = `
                    <div class="feedback-title-row">
                        <span class="feedback-badge">✕ NOT QUITE</span>
                    </div>
                    <div class="hint-box-container">
                        <div class="hint-box-title">💡 HINT 1:</div>
                        <div class="hint-box-content">${qData.hint1}</div>
                    </div>
                `;
                feedbackPanel.classList.remove('hidden');

            } else if (gameState.attemptsCount === 2) {
                // Second Wrong Attempt -> Show HINT 2
                gameState.totalHintsUsed++;
                agentDialogue.textContent = `"You're close. Apply the formula step by step."`;

                feedbackPanel.className = 'feedback-panel error-hint';
                feedbackPanel.innerHTML = `
                    <div class="feedback-title-row">
                        <span class="feedback-badge">💡 HINT 2</span>
                    </div>
                    <div class="hint-box-container">
                        <div class="hint-box-title">💡 STEP-BY-STEP HINT:</div>
                        <div class="hint-box-content">${qData.hint2}</div>
                    </div>
                `;
                feedbackPanel.classList.remove('hidden');

            } else {
                // Third+ Wrong Attempt -> Show Worked Explanation but still allow retrying!
                agentDialogue.textContent = `"Let's analyze the formula and worked solution carefully."`;

                feedbackPanel.className = 'feedback-panel explanation';
                feedbackPanel.innerHTML = `
                    <div class="feedback-title-row">
                        <span class="feedback-badge">📖 LEARN FROM THIS</span>
                    </div>
                    <div class="explanation-box-container">
                        <div class="explanation-box-title">FULL WORKED EXPLANATION:</div>
                        <div class="explanation-box-content">${qData.explanation}</div>
                    </div>
                `;
                feedbackPanel.classList.remove('hidden');
            }
        }
    }

    function handleNextQuestion() {
        sound.playClick();
        if (gameState.currentQIndex < 4) {
            gameState.currentQIndex++;
            gameState.attemptsCount = 0;
            saveProgress();
            renderQuestion();
        } else {
            completeRoom();
        }
    }

    // ----------------------------------------------------------------------
    // 8. ROOM COMPLETION & UNLOCKING
    // ----------------------------------------------------------------------
    function completeRoom() {
        sound.playRoomUnlock();
        roomScene.classList.remove('puzzle-error', 'correct');
        roomScene.classList.add('opening');
        energyFlowLayer.classList.add('active');
        document.getElementById('energy-hud').textContent = '100%';
        document.getElementById('room-hud-status').innerHTML = '<i></i> AUTHENTICATING';

        if (!gameState.completedRooms.includes(gameState.currentRoomId)) {
            gameState.completedRooms.push(gameState.currentRoomId);
            gameState.totalXP += 100;
        }

        saveProgress();
        updateGlobalHUD();

        const roomInfo = ROOMS_DATA.find(r => r.id === gameState.currentRoomId);

        document.getElementById('completion-title').textContent = `${roomInfo.title.toUpperCase()} COMPLETED`;
        document.getElementById('completion-subtitle').textContent = `The ${roomInfo.subtitle} chamber is now fully online and stable.`;
        document.getElementById('c-xp-earned').textContent = `+120 XP`;
        document.getElementById('c-accuracy').textContent = `100%`;
        document.getElementById('c-attempts').textContent = `${gameState.totalAttempts}`;
        document.getElementById('c-hints').textContent = `${gameState.totalHintsUsed}`;

        const nextRoomId = gameState.currentRoomId + 1;
        const unlockNotification = document.getElementById('unlock-notification');
        const unlockText = document.getElementById('unlock-text');
        const steps = [...unlockSequence.querySelectorAll('.unlock-step')];
        unlockSequence.classList.add('active');
        steps.forEach((step, index) => {
            setTimeout(() => step.classList.add('visible'), 350 + index * 650);
        });
        document.getElementById('room-hud-status').innerHTML = '<i></i> UNLOCKED';

        if (nextRoomId <= 7) {
            const nextRoomInfo = ROOMS_DATA.find(r => r.id === nextRoomId);
            unlockNotification.classList.remove('hidden');
            unlockText.textContent = `ROOM 0${nextRoomId}: ${nextRoomInfo.title.toUpperCase()} UNLOCKED!`;
            btnContinueNextRoom.textContent = `CONTINUE TO ROOM 0${nextRoomId}`;
            btnContinueNextRoom.onclick = () => {
                sound.playClick();
                completionModal.classList.add('hidden');
                enterRoom(nextRoomId);
            };
        } else {
            // Completed final room!
            unlockNotification.classList.add('hidden');
            btnContinueNextRoom.textContent = `VIEW FINAL MISSION REPORT`;
            btnContinueNextRoom.onclick = () => {
                sound.playClick();
                completionModal.classList.add('hidden');
                triggerVictory();
            };
        }

        btnReturnMap.onclick = () => {
            sound.playClick();
            completionModal.classList.add('hidden');
            showRoomMap();
        };

        setTimeout(() => completionModal.classList.remove('hidden'), 4300);
    }

    function triggerVictory() {
        hideAllScreens();
        globalHUD.classList.remove('hidden');
        victoryScreen.classList.remove('hidden');
        sound.playVictory();

        document.getElementById('v-final-xp').textContent = gameState.totalXP;
        document.getElementById('v-rooms-count').textContent = `${gameState.completedRooms.length} / 7`;
        document.getElementById('v-accuracy-rate').textContent = `100%`;
        document.getElementById('v-total-attempts').textContent = gameState.totalAttempts;

        document.getElementById('btn-restart-mission').onclick = () => {
            sound.playClick();
            resetProgress();
        };

        document.getElementById('btn-victory-map').onclick = () => {
            sound.playClick();
            showRoomMap();
        };
    }

    // ----------------------------------------------------------------------
    // 9. MODAL HANDLERS & SOUND TOGGLE
    // ----------------------------------------------------------------------
    btnSoundToggle.addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        if (isMuted) {
            soundIconOn.classList.add('hidden');
            soundIconOff.classList.remove('hidden');
        } else {
            soundIconOn.classList.remove('hidden');
            soundIconOff.classList.add('hidden');
            sound.playClick();
        }
    });

    btnStart.addEventListener('click', () => {
        sound.playClick();
        showRoomMap();
    });

    btnHowToPlay.addEventListener('click', () => {
        sound.playClick();
        modalHowToPlay.classList.remove('hidden');
    });

    btnCloseModal.addEventListener('click', () => {
        sound.playClick();
        modalHowToPlay.classList.add('hidden');
    });

    btnModalCloseAction.addEventListener('click', () => {
        sound.playClick();
        modalHowToPlay.classList.add('hidden');
        if (landingScreen.classList.contains('active') || !landingScreen.classList.contains('hidden')) {
            showRoomMap();
        }
    });

    btnHudMap.addEventListener('click', () => {
        sound.playClick();
        showRoomMap();
    });

    btnHudSettings.addEventListener('click', () => {
        sound.playClick();
        resetModal.classList.remove('hidden');
    });

    btnConfirmReset.addEventListener('click', () => {
        sound.playClick();
        resetModal.classList.add('hidden');
        resetProgress();
    });

    btnCancelReset.addEventListener('click', () => {
        sound.playClick();
        resetModal.classList.add('hidden');
    });

    // Default view
    if (gameState.completedRooms.length > 0) {
        showRoomMap();
    } else {
        showLanding();
    }
});
