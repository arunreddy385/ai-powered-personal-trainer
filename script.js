// ===== DOM Elements =====
const DOM = {
    // Forms
    forms: document.querySelectorAll('.needs-validation'),
    
    // Navigation
    navbarToggler: document.querySelector('.navbar-toggler'),
    navbarCollapse: document.querySelector('.navbar-collapse'),
    
    // Workout Tracking
    workoutTimer: document.getElementById('workoutTimer'),
    exerciseItems: document.querySelectorAll('.exercise-item'),
    
    // Progress Charts
    progressChart: document.getElementById('progressChart'),
    nutritionChart: document.getElementById('nutritionChart'),
    
    // UI Elements
    tooltipTriggers: document.querySelectorAll('[data-bs-toggle="tooltip"]'),
    toastTriggers: document.querySelectorAll('[data-bs-toggle="toast"]')
  };
  
  // ===== Initialize Application =====
  document.addEventListener('DOMContentLoaded', function() {
    initForms();
    initNavbar();
    initWorkoutTracker();
    initCharts();
    initTooltips();
    initToasts();
    animateOnScroll();
  });
  
  // ===== Form Validation =====
  function initForms() {
    if (!DOM.forms) return;
  
    DOM.forms.forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
  
        form.classList.add('was-validated');
      }, false);
    });
  }
  
  // ===== Responsive Navbar =====
  function initNavbar() {
    if (!DOM.navbarToggler) return;
  
    DOM.navbarToggler.addEventListener('click', () => {
      DOM.navbarCollapse.classList.toggle('show');
      
      // Animate hamburger icon
      DOM.navbarToggler.classList.toggle('collapsed');
      DOM.navbarToggler.setAttribute(
        'aria-expanded', 
        DOM.navbarToggler.classList.contains('collapsed') ? 'false' : 'true'
      );
    });
  }
  
  // ===== Workout Tracker =====
  function initWorkoutTracker() {
    if (!DOM.workoutTimer) return;
  
    const timerDisplay = document.getElementById('timerDisplay');
    const startBtn = document.getElementById('startTimer');
    const pauseBtn = document.getElementById('pauseTimer');
    const resetBtn = document.getElementById('resetTimer');
    
    let seconds = 0, minutes = 0, hours = 0;
    let timer;
  
    function updateTimerDisplay() {
      timerDisplay.textContent = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  
    startBtn.addEventListener('click', () => {
      if (!timer) {
        timer = setInterval(() => {
          seconds++;
          if (seconds >= 60) {
            seconds = 0;
            minutes++;
            if (minutes >= 60) {
              minutes = 0;
              hours++;
            }
          }
          updateTimerDisplay();
        }, 1000);
      }
    });
  
    pauseBtn.addEventListener('click', () => {
      clearInterval(timer);
      timer = null;
    });
  
    resetBtn.addEventListener('click', () => {
      clearInterval(timer);
      timer = null;
      seconds = minutes = hours = 0;
      updateTimerDisplay();
    });
  }
  
  // ===== Exercise Completion =====
  function initExerciseTracking() {
    DOM.exerciseItems.forEach(item => {
      const checkbox = item.querySelector('.exercise-complete');
      if (!checkbox) return;
  
      checkbox.addEventListener('change', function() {
        item.classList.toggle('completed', this.checked);
        
        // Update progress
        if (this.checked) {
          updateWorkoutProgress(1);
        } else {
          updateWorkoutProgress(-1);
        }
      });
    });
  }
  
  function updateWorkoutProgress(change) {
    const progressBar = document.querySelector('.workout-progress .progress-bar');
    if (!progressBar) return;
  
    const current = parseInt(progressBar.getAttribute('aria-valuenow'));
    const newValue = Math.min(100, Math.max(0, current + change));
    
    progressBar.style.width = `${newValue}%`;
    progressBar.setAttribute('aria-valuenow', newValue);
    progressBar.textContent = `${newValue}%`;
  }
  
  // ===== Charts =====
  function initCharts() {
    if (DOM.progressChart) {
      initProgressChart();
    }
    
    if (DOM.nutritionChart) {
      initNutritionChart();
    }
  }
  
  function initProgressChart() {
    const ctx = DOM.progressChart.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Workout Completion',
            data: [80, 100, 70, 90, 50, 100, 60],
            borderColor: '#4361ee',
            backgroundColor: 'rgba(67, 97, 238, 0.2)',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Nutrition Goals',
            data: [70, 80, 90, 60, 80, 50, 90],
            borderColor: '#4cc9f0',
            backgroundColor: 'rgba(76, 201, 240, 0.2)',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100
          }
        }
      }
    });
  }
  
  function initNutritionChart() {
    const ctx = DOM.nutritionChart.getContext('2d');
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Protein', 'Carbs', 'Fat'],
        datasets: [{
          data: [30, 40, 30],
          backgroundColor: [
            '#4361ee',
            '#4895ef',
            '#4cc9f0'
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        cutout: '75%',
        plugins: {
          legend: {
            position: 'bottom',
          }
        }
      }
    });
  }
  
  // ===== UI Components =====
  function initTooltips() {
    DOM.tooltipTriggers.forEach(el => {
      new bootstrap.Tooltip(el);
    });
  }
  
  function initToasts() {
    DOM.toastTriggers.forEach(trigger => {
      trigger.addEventListener('click', () => {
        const toastId = trigger.getAttribute('data-target');
        const toast = new bootstrap.Toast(document.getElementById(toastId));
        toast.show();
      });
    });
  }
  
  // ===== Animations =====
  function animateOnScroll() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    if (!('IntersectionObserver' in window)) {
      // Fallback for browsers without IntersectionObserver
      animateElements.forEach(el => el.classList.add('animate-fade'));
      return;
    }
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
  
    animateElements.forEach(el => observer.observe(el));
  }
  
  // ===== Helper Functions =====
  function debounce(func, wait = 100) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  }
  
  // ===== Event Listeners =====
  window.addEventListener('resize', debounce(() => {
    // Handle responsive adjustments
  }));
  
  // ===== API Functions =====
  async function fetchWorkoutRecommendations(userId) {
    try {
      const response = await fetch(`/api/users/${userId}/recommendations`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return null;
    }
  }
  

  // In your script.js
document.addEventListener('DOMContentLoaded', () => {
    // Test tooltips
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(tooltipTriggerEl => {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    console.log("Bootstrap JS loaded successfully!");
  });
  // ===== Export for Modules (if needed) =====
  // export { initForms, initNavbar };