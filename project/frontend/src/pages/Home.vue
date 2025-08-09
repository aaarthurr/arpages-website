<template>
<div class="home-container">
  <div class="background">
	<div class="sky">
		<div class="sky_parts sides"></div>
		<div class="sky_parts"></div>
		<div class="sky_parts"></div>
		<div class="sky_parts"></div>
		<div class="sky_parts"></div>
		<div class="sky_parts"></div>
		<div class="sky_parts"></div>
		<div class="sky_parts"></div>
		<div class="sky_parts"></div>
		<div class="sky_parts sides"></div>
	</div>
  </div>

  <!-- Dynamic shooting stars container -->
  <div class="stars" id="stars"></div>

  <main class="site-main">
    <section class="intro-text-section">
      <p class="intro-text" id="catchphrase">Achieving greatness is not about luck.</p>
    </section>
	<section class="main-button-section">
	  	<button class="liquid_glass" @click="toggleTheme">Discorver</button>
	</section>
  </main>

  <footer class="site-footer">
    <p class="footer-text">© 2025 Arthur Pages</p>
  </footer>
</div>
</template>

<script>
import '../assets/home_style.css' // ✅ Page-specific CSS
import '../assets/home_theme.css' // ✅ Page-specific CSS
import {select_random_catchphrase, initializeTextAnimation, initializeTheme } from '../script/home.js' // ✅ Import functions

export default {
  name: 'Home',
  mounted() {
    // Initialize the home page functionality when component is mounted
	select_random_catchphrase()
    initializeTextAnimation();
    initializeTheme();
  }
}
</script>

