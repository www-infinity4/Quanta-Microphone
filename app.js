/* ============================================================
   app.js — Quanta Microphone interactive layer
   ============================================================ */

(function () {
  'use strict';

  /* ---- Nav scroll effect ---- */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ---- Hamburger toggle ---- */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      toggle.textContent = open ? '✕' : '☰';
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
        toggle.textContent = '☰';
      })
    );
  }

  /* ---- Scroll-reveal ---- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

  /* ---- Smooth counter animation ---- */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isFloat = target % 1 !== 0;
    const duration = 1800;
    const start = performance.now();
    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      const val = target * ease;
      el.textContent = (isFloat ? val.toFixed(1) : Math.round(val)) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animateCounter(e.target);
        counterObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

  /* ---- Charts (Chart.js, loaded via CDN) ---- */
  window.addEventListener('load', initCharts);

  function initCharts() {
    if (typeof Chart === 'undefined') return;

    Chart.defaults.color = '#9d9cc0';
    Chart.defaults.borderColor = 'rgba(255,255,255,0.06)';

    /* Helper: gradient fill */
    function makeGradient(ctx, color1, color2) {
      const g = ctx.createLinearGradient(0, 0, 0, 320);
      g.addColorStop(0, color1);
      g.addColorStop(1, color2);
      return g;
    }

    /* ---- 1. Phonon Frequency Spectrum ---- */
    const specCtx = document.getElementById('chartSpectrum');
    if (specCtx) {
      const freqs = ['20 Hz','100 Hz','500 Hz','1 kHz','5 kHz','20 kHz','100 kHz','∞'];
      new Chart(specCtx, {
        type: 'bar',
        data: {
          labels: freqs,
          datasets: [{
            label: 'Phonon Intensity (arb. units)',
            data: [0.3, 0.5, 0.85, 1.0, 0.92, 0.76, 0.55, 0.22],
            backgroundColor: function(ctx) {
              return makeGradient(ctx.chart.ctx, 'rgba(124,58,237,0.85)', 'rgba(6,182,212,0.3)');
            },
            borderRadius: 6,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (c) => ` ${c.formattedValue} AU` } }
          },
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { grid: { display: false } }
          }
        }
      });
    }

    /* ---- 2. State Transition Radar ---- */
    const radarCtx = document.getElementById('chartRadar');
    if (radarCtx) {
      new Chart(radarCtx, {
        type: 'radar',
        data: {
          labels: ['Alpha (Earth)', 'Beta (Transit)', 'Gamma (Infinity)', 'Delta (Bridge)', 'Omega (Return)', '84 Shield'],
          datasets: [
            {
              label: 'Physical State',
              data: [95, 20, 5, 40, 15, 70],
              backgroundColor: 'rgba(6,182,212,0.18)',
              borderColor: '#06b6d4',
              pointBackgroundColor: '#06b6d4',
              pointRadius: 4,
            },
            {
              label: 'Quantum State',
              data: [10, 60, 90, 75, 55, 30],
              backgroundColor: 'rgba(124,58,237,0.18)',
              borderColor: '#7c3aed',
              pointBackgroundColor: '#7c3aed',
              pointRadius: 4,
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              grid: { color: 'rgba(255,255,255,0.06)' },
              angleLines: { color: 'rgba(255,255,255,0.08)' },
              ticks: { display: false },
              pointLabels: { font: { size: 11 } }
            }
          },
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16 } } }
        }
      });
    }

    /* ---- 3. Quantum Signal Timeline (Line) ---- */
    const lineCtx = document.getElementById('chartTimeline');
    if (lineCtx) {
      const labels = Array.from({ length: 40 }, (_, i) => i);
      const physical = labels.map(i => Math.max(0, 1 - i / 35 + Math.sin(i * 0.6) * 0.07));
      const quantum  = labels.map(i => Math.min(1, (i / 35) ** 1.2 + Math.sin(i * 0.4) * 0.05));
      new Chart(lineCtx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Physical Signature',
              data: physical,
              borderColor: '#06b6d4',
              backgroundColor: 'rgba(6,182,212,0.08)',
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              borderWidth: 2,
            },
            {
              label: 'Quantum Trace',
              data: quantum,
              borderColor: '#7c3aed',
              backgroundColor: 'rgba(124,58,237,0.08)',
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              borderWidth: 2,
            }
          ]
        },
        options: {
          responsive: true,
          interaction: { mode: 'index', intersect: false },
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16 } },
            tooltip: {
              callbacks: {
                label: c => ` ${c.dataset.label}: ${(c.raw * 100).toFixed(1)}%`
              }
            }
          },
          scales: {
            y: { beginAtZero: true, max: 1, ticks: { callback: v => (v * 100) + '%' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            x: { display: false }
          }
        }
      });
    }

    /* ---- 4. Planet Gas Composition (Doughnut) ---- */
    const donutCtx = document.getElementById('chartPlanets');
    if (donutCtx) {
      new Chart(donutCtx, {
        type: 'doughnut',
        data: {
          labels: ['H₂ (Hydrogen)', 'He (Helium)', 'CH₄ (Methane)', 'NH₃ (Ammonia)', 'Other trace'],
          datasets: [{
            data: [83, 15, 1.5, 0.3, 0.2],
            backgroundColor: ['#3b82f6', '#7c3aed', '#06b6d4', '#ec4899', '#64748b'],
            borderColor: 'rgba(0,0,0,0.3)',
            borderWidth: 2,
            hoverOffset: 8,
          }]
        },
        options: {
          responsive: true,
          cutout: '68%',
          plugins: {
            legend: { position: 'right', labels: { boxWidth: 12, padding: 12, font: { size: 11 } } },
            tooltip: { callbacks: { label: c => ` ${c.label}: ${c.raw}%` } }
          }
        }
      });
    }

    /* ---- 5. Voice Frequency GPS (Scatter) ---- */
    const scatterCtx = document.getElementById('chartGPS');
    if (scatterCtx) {
      const rng = (min, max) => min + Math.random() * (max - min);
      const voices = Array.from({ length: 35 }, () => ({ x: rng(0, 10), y: rng(0, 10) }));
      const portals = [{ x: 7.2, y: 8.5 }, { x: 3.1, y: 6.8 }, { x: 9.0, y: 2.3 }];
      new Chart(scatterCtx, {
        type: 'scatter',
        data: {
          datasets: [
            {
              label: 'Voice Signatures',
              data: voices,
              backgroundColor: 'rgba(6,182,212,0.6)',
              pointRadius: 5,
              pointHoverRadius: 7,
            },
            {
              label: 'Access Ports',
              data: portals,
              backgroundColor: '#ec4899',
              pointRadius: 10,
              pointStyle: 'star',
              pointHoverRadius: 14,
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'bottom', labels: { boxWidth: 12, padding: 16 } },
            tooltip: { callbacks: { label: c => ` (${c.parsed.x.toFixed(2)}, ${c.parsed.y.toFixed(2)})` } }
          },
          scales: {
            x: { title: { display: true, text: 'Frequency Dimension X' }, grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { title: { display: true, text: 'Frequency Dimension Y' }, grid: { color: 'rgba(255,255,255,0.05)' } }
          }
        }
      });
    }
  }

  /* ---- Frequency bar randomizer ---- */
  function randomizeBars() {
    document.querySelectorAll('.freq-bar').forEach(bar => {
      const h = 15 + Math.random() * 85;
      bar.style.height = h + '%';
    });
  }
  setInterval(randomizeBars, 120);

  /* ---- Demo: voice key input simulation ---- */
  const demoInput = document.getElementById('demoInput');
  const demoResult = document.getElementById('demoResult');
  if (demoInput && demoResult) {
    demoInput.addEventListener('input', debounce(function () {
      const val = this.value.trim();
      if (!val) { demoResult.innerHTML = '<em>Enter a name or phrase above…</em>'; return; }
      const hash = val.split('').reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 0);
      const freq  = (200 + (hash % 1800)).toFixed(1);
      const phase = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Omega'][hash % 5];
      const port  = ((hash % 1000) / 100).toFixed(2);
      const coords = `(${(hash % 1000) / 100}, ${((hash * 7) % 1000) / 100})`;
      demoResult.innerHTML = `
        <div class="demo-row"><span class="demo-key">Phonon Frequency</span><span class="demo-val gradient-text">${freq} Hz</span></div>
        <div class="demo-row"><span class="demo-key">State Mapping</span><span class="demo-val">${phase} Layer</span></div>
        <div class="demo-row"><span class="demo-key">Access Port ID</span><span class="demo-val">∞-PORT-${Math.abs(hash).toString(16).toUpperCase().slice(0,6)}</span></div>
        <div class="demo-row"><span class="demo-key">GPS Coordinates</span><span class="demo-val">${coords}</span></div>
      `;
    }, 250));
  }

  function debounce(fn, delay) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), delay);
    };
  }

})();
