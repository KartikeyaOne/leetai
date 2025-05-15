// lib/particles-config.js
const particlesConfig = {
    fullScreen: {
      enable: false, // Set to false if integrating into a specific section
      zIndex: 0      // Ensure it's behind content
    },
    particles: {
      number: {
        value: 60, // Adjust density
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: "#aaaaaa" // Particle color (light gray)
      },
      shape: {
        type: "circle",
      },
      opacity: {
        value: 0.4, // Particle opacity
        random: true,
        anim: {
          enable: true,
          speed: 0.5,
          opacity_min: 0.1,
          sync: false
        }
      },
      size: {
        value: 2, // Particle size
        random: true,
        anim: {
          enable: false, // Disable size animation for subtlety
          speed: 40,
          size_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 150,
        color: "#666666", // Link color (medium gray)
        opacity: 0.3,
        width: 1
      },
      move: {
        enable: true,
        speed: 1.5, // Movement speed
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 600,
          rotateY: 1200
        }
      }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: {
          enable: true,
          mode: "grab" // Creates links on hover
        },
        onclick: {
          enable: false, // Disable click events for less distraction
          mode: "push"
        },
        resize: true
      },
      modes: {
        grab: {
          distance: 180,
          line_linked: {
            opacity: 0.7
          }
        },
        bubble: {
          distance: 400,
          size: 40,
          duration: 2,
          opacity: 8,
          speed: 3
        },
        repulse: {
          distance: 200,
          duration: 0.4
        },
        push: {
          particles_nb: 4
        },
        remove: {
          particles_nb: 2
        }
      }
    },
    retina_detect: true // Adjusts for high-DPI screens
  };
  
  export default particlesConfig;