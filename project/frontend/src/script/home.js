const maxMove = 40;
const influenceRadius = 150;

let time = 0;
let spans = [];
let mouseX = 0;
let mouseY = 0;
let shootingStarInterval;



async function getLine(file, index) {
  try {
    const res = await fetch(file);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const catchphrase = await res.text();	
    const lines = catchphrase.split(/\r?\n/).filter(line => line.trim() !== "");
    return lines[index] ?? null; // returns null if out of range
  } catch (error) {
    console.error('Error fetching catchphrases:', error);
    return null;
  }
}

export function select_random_catchphrase() {
  const catchphraseElement = document.getElementById('catchphrase');
  if (!catchphraseElement) {
    console.error('Element with id "catchphrase" not found');
    return;
  }
  
  const line = Math.floor(Math.random() * 13); // Random line number between 0 and 12 (array index)
  getLine("/src/assets/catchphrases.txt", line).then(catchphrase => {
    if (catchphrase) {
      catchphraseElement.textContent = catchphrase;
      // Reinitialize animation after changing text
      initializeTextAnimation();
    } else {
      console.error('Failed to get catchphrase');
    }
  });
}


// Shooting stars functionality
function createShootingStar() {
	const star = document.createElement('div');
	star.className = 'dynamic-shooting-star';

	// Only from top or right edge, never from left
	const isFromTop = Math.random() > 0.5;
	if (isFromTop) {
		// From top edge, random horizontal position just outside the right edge
		star.style.left = (Math.random() * 100) + 'vw';
		star.style.top = '-120px'; // further above the visible area
	} else {
		// From right edge, random vertical position just outside the bottom edge
		star.style.left = 'calc(100vw + 120px)'; // further right of the visible area
		star.style.top = (Math.random() * 100) + 'vh';
	}

	const color = Math.random();
	if (color > 0.6) {
		star.style.background = 'linear-gradient(45deg, var(--text), transparent)';
	} 
	else if (color < 0.3) {
		star.style.background = 'linear-gradient(45deg, var(--primary), transparent)';
	}
	else {
		star.style.background = 'linear-gradient(45deg, var(--secondary), transparent)';
	}

	// Random size and opacity
	const size = Math.random() * 3 + 1; // 1-4px width
	const length = Math.random() * 80 + 60; // 60-140px length
	const speed = Math.random() * 7 + 3; // 3 - 10 seconds duration
	star.style.width = size + 'px';
	star.style.height = length + 'px';
	star.style.opacity = Math.random() * 0.6 + 0.4; // 0.4-1.0
	star.style.animationDuration = speed + 's';

	// Add to stars container
	const starsContainer = document.getElementById('stars');
	if (starsContainer) {
		starsContainer.appendChild(star);

		// Remove star after animation completes
		setTimeout(() => {
			if (star.parentNode) {
				star.parentNode.removeChild(star);
			}
		}, speed * 1000);
	}
}



function startShootingStars() {
  // Create stars at random intervals
  function scheduleNextStar() {
    const delay = Math.random() * 800 + 200; // 0.5-1.5 seconds
    setTimeout(() => {
      createShootingStar();
      scheduleNextStar(); // Schedule the next one
    }, delay);
  }
  
  scheduleNextStar();
}

function stopShootingStars() {
  if (shootingStarInterval) {
    clearInterval(shootingStarInterval);
  }
}




// Text animation initialization function
export function initializeTextAnimation() {
  const catchphrase = document.getElementById('catchphrase'); // Fixed to use correct element ID

  if (!catchphrase) {
    console.error('Element with id "catchphrase" not found');
    return;
  }

  // 1. Wrap each letter in a span while preserving words
  const words = catchphrase.textContent.split(' ');
  let charIndex = 0;
  
  catchphrase.innerHTML = words.map(word => {
    const wordSpans = word.split('').map(char => {
      return `<span data-index="${charIndex++}">${char}</span>`;
    }).join('');
    return `<span class="word">${wordSpans}</span>`;
  }).join(' ');

  spans = Array.from(catchphrase.querySelectorAll('span[data-index]'));

  // 2. Track mouse position (only add listener once)
  if (!window.mouseMoveListenerAdded) {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    window.mouseMoveListenerAdded = true;
  }

  // Start animation (only if not already running)
  if (!window.animationRunning) {
    animate();
    window.animationRunning = true;
  }
  
  // Start shooting stars (only once)
  if (!window.shootingStarsStarted) {
    startShootingStars();
    window.shootingStarsStarted = true;
  }
}

// Theme initialization function
export function initializeTheme() {
  const savedTheme = localStorage.getItem("theme");
  const body = document.body;
  const app = document.getElementById("app");
  const icon = document.getElementById("theme-icon");

  if (savedTheme === "light") {
    body.classList.add("light-theme");
    app.classList.add("light-theme");
    if (icon) icon.textContent = "dark_mode";
  } else {
    body.classList.add("dark-theme");
    app.classList.add("dark-theme");
    if (icon) icon.textContent = "light_mode";
  }
}

// Animation loop function
function animate() {
  time += 0.05;

  spans.forEach((span, i) => {
    const rect = span.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Distance to mouse
    const dx = mouseX - centerX;
    const dy = mouseY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Repel movement
    let moveX = 0;
    let moveY = 0;
    if (distance < influenceRadius) {
      const angle = Math.atan2(dy, dx);
      const force = (influenceRadius - distance) / influenceRadius;
      moveX = -Math.cos(angle) * force * maxMove;
      moveY = -Math.sin(angle) * force * maxMove;
    }

    // Wavy vertical motion using sine wave
    const wave = Math.sin(time + i * 0.4) * 5; // amplitude = 5px

    span.style.transform = `translate(${moveX}px, ${moveY + wave}px)`;
  });

  requestAnimationFrame(animate);
}

// Make change_theme function globally available
window.change_theme = function() {
  const body = document.body;
  const app = document.getElementById("app");
  const icon = document.getElementById("theme-icon");

  const isLight = body.classList.contains("light-theme");

  // Trigger rotation animation
  if (icon) icon.classList.add("rotate");

  // Change theme and icon text mid-animation
  setTimeout(() => {
    if (isLight) {
      body.classList.remove("light-theme");
      body.classList.add("dark-theme");
      app.classList.remove("light-theme");
      app.classList.add("dark-theme");
      if (icon) icon.textContent = "light_mode";
      localStorage.setItem("theme", "dark");
    } else {
      body.classList.remove("dark-theme");
      body.classList.add("light-theme");
      app.classList.remove("dark-theme");
      app.classList.add("light-theme");
      if (icon) icon.textContent = "dark_mode";
      localStorage.setItem("theme", "light");
    }
  }, 200); // change icon mid-animation

  // Remove animation class after it's done so it can be reused
  setTimeout(() => {
    if (icon) icon.classList.remove("rotate");
  }, 400); // match animation duration
}
