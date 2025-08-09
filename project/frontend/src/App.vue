<template>
  <div id="app">
	  <header class="site-header">
	<div>
	</div>
	<div>
		<button class="header-button">About me</button>
		<router-link to="/home" class="header-button">Home</router-link>
		<div class="dropdown">
			<button class="header-button dropdown-btn">More</button>
			<div class="dropdown-content">
				<router-link to="/idle_rand" class="dropdown-item">Idle_rand</router-link>
			</div>
		</div>
	</div>
	<div>
		<button id="theme-button" class="theme-button" onclick="change_theme()">
			<span class="material-symbols-outlined" id="theme-icon">light_mode</span>
		</button>		  
	</div>
  </header>

    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    // Initialize theme on app startup
    this.initializeTheme();
  },
  methods: {
    initializeTheme() {
      const savedTheme = localStorage.getItem("theme");
      const body = document.body;
      const app = document.getElementById("app");

      if (savedTheme === "light") {
        body.classList.add("light-theme");
        app.classList.add("light-theme");
      } else {
        body.classList.add("dark-theme");
        app.classList.add("dark-theme");
      }
    }
  }
}
</script>

<style>
/* Import theme variables */
@import './assets/home_theme.css';

/* Reset defaults for full page coverage */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

#app {
  background-color: var(--background);
  color: var(--text);
  min-height: 100vh;
  width: 100vw;
  position: relative;
  transition: background-color 200ms ease-in-out, color 200ms ease-in-out;
}

.site-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  text-align: center;
  position: relative;
}

.header-button {
  appearance: none;
  margin-left: 25px;
  margin-right: 25px;
  width: 105px;
  font-size: 1.3rem;
  background-color: transparent;
  border: none;
  font-family: 'Montserrat', serif;
  font-weight: 400;
  color: var(--text);
  transform: scale(1);
  will-change: transform;
  transition: transform 200ms ease-in-out, color 200ms ease-in-out;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
} 

.header-button:hover {
  transform: scale(1.1);
  color: var(--primary);
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: var(--background);
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  border: 1px solid var(--primary);
  border-radius: 4px;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown-item {
  color: var(--text);
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  transition: background-color 200ms ease-in-out;
  font-family: 'Montserrat', serif;
}

.dropdown-item:hover {
  background-color: var(--primary);
  color: var(--background);
}

.theme-button {
  border: none;
  background-color: transparent;
  color: var(--text);
  transition: transform 200ms ease-in-out, color 200ms ease-in-out;
}

.theme-button:hover {
  transform: scale(1.05);
  color: var(--primary);
}

.theme-button .material-symbols-outlined {
  font-size: 32px;
}

@keyframes rotate-icon {
  0% {
    transform: rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: rotate(180deg);
    opacity: 0;
  }
  100% {
    transform: rotate(360deg);
    opacity: 1;
  }
}

.rotate {
  animation: rotate-icon 0.4s ease-in-out;
}
</style>
