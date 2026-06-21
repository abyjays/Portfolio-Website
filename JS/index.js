// --- Smooth Scrolling ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// --- Scroll Reveal Animation Logic ---
function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 100; 

        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}

window.addEventListener("scroll", reveal);

reveal();


// --- Network Nodes Background Animation ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];

// Set canvas size
function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// Particle Class
class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5; 
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;

        this.color = Math.random() > 0.5 ? '#9d4edd' : '#00f0ff';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    let numParticles = Math.floor(width / 15); 
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }
}
initParticles();

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(157, 78, 221, ${1 - distance/100})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}
animate();

// --- Live Visitor Counter (Session Aware & Localhost Safe) ---
function fetchVisitorCount() {
    const countElement = document.getElementById('visitor-count');
    if (!countElement) return; 

    // 1. Local Development Bypass
    if (window.location.hostname === '127.0.0.1' || window.location.hostname === 'localhost') {
        countElement.innerText = "42"; // Removed the leading zeros here
        console.log("[System] Local environment detected. API connection bypassed.");
        return;
    }

    // 2. Production API Connection
    const hasVisited = sessionStorage.getItem('hasVisited_portfolio');
    
    const apiEndpoint = hasVisited 
        ? 'https://api.counterapi.dev/v1/abyjays/portfolio'      
        : 'https://api.counterapi.dev/v1/abyjays/portfolio/up';  

    fetch(apiEndpoint)
        .then(response => {
            if (!response.ok) throw new Error("API connection failed.");
            return response.json();
        })
        .then(data => {
            // Removed .padStart(4, '0') to display the raw number
            countElement.innerText = data.count.toString();
            
            if (!hasVisited) sessionStorage.setItem('hasVisited_portfolio', 'true');
        })
        .catch(error => {
            console.error('[Error] Visitor tracker failed:', error);
            countElement.innerText = "ERR";
        });
}

fetchVisitorCount();

function noresumepopup() {
    alert("Sorry, the resume download feature is currently unavailable. Please check back later or contact me directly for a copy of my resume. Thank you for your understanding!");
}