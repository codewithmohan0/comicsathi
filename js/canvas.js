/* ============================================
   COMIC SATHI — 3D CANVAS MANAGER
============================================ */

class ThreeDCanvasManager {
    constructor() {
        this.canvas = document.getElementById('hero-canvas');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.cubes = [];
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        this.setupScene();
        this.createCubes();
        this.createLighting();
        this.animate();
        this.setupEventListeners();
    }

    setupScene() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.scene.fog = new THREE.Fog(0x000000, 100, 50);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 30;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;
    }

    createCubes() {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const colors = [0x0071e3, 0x2997ff, 0x0066cc, 0x00d4ff, 0x3b82f6];

        for (let i = 0; i < 5; i++) {
            const material = new THREE.MeshPhongMaterial({
                color: colors[i % colors.length],
                emissive: colors[i % colors.length],
                emissiveIntensity: 0.3,
                shininess: 100,
                wireframe: false
            });

            const cube = new THREE.Mesh(geometry, material);
            cube.position.x = (Math.random() - 0.5) * 40;
            cube.position.y = (Math.random() - 0.5) * 40;
            cube.position.z = (Math.random() - 0.5) * 30 - 15;
            
            cube.castShadow = true;
            cube.receiveShadow = true;
            cube.rotation.x = Math.random() * Math.PI;
            cube.rotation.y = Math.random() * Math.PI;

            this.scene.add(cube);
            this.cubes.push({
                mesh: cube,
                vx: (Math.random() - 0.5) * 0.02,
                vy: (Math.random() - 0.5) * 0.02,
                vz: (Math.random() - 0.5) * 0.02,
                rotationSpeed: Math.random() * 0.01 + 0.005
            });
        }
    }

    createLighting() {
        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Point Light 1
        const pointLight1 = new THREE.PointLight(0x0071e3, 1, 100);
        pointLight1.position.set(10, 10, 10);
        pointLight1.castShadow = true;
        this.scene.add(pointLight1);

        // Point Light 2
        const pointLight2 = new THREE.PointLight(0x2997ff, 0.8, 80);
        pointLight2.position.set(-15, -10, 5);
        pointLight2.castShadow = true;
        this.scene.add(pointLight2);

        // Point Light 3
        const pointLight3 = new THREE.PointLight(0x00d4ff, 0.6, 60);
        pointLight3.position.set(0, 15, -10);
        pointLight3.castShadow = true;
        this.scene.add(pointLight3);
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        // Update cubes
        this.cubes.forEach(cube => {
            cube.mesh.rotation.x += cube.vx;
            cube.mesh.rotation.y += cube.vy;
            cube.mesh.rotation.z += cube.vz;

            cube.mesh.position.x += cube.vx;
            cube.mesh.position.y += cube.vy;

            // Bounce off boundaries
            if (Math.abs(cube.mesh.position.x) > 20) cube.vx *= -1;
            if (Math.abs(cube.mesh.position.y) > 20) cube.vy *= -1;

            // Add mouse influence
            const dx = this.mouseX - cube.mesh.position.x;
            const dy = this.mouseY - cube.mesh.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 20) {
                cube.mesh.position.x += (dx / distance) * 0.1;
                cube.mesh.position.y += (dy / distance) * 0.1;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }

    setupEventListeners() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = (e.clientX / window.innerWidth - 0.5) * 40;
            this.mouseY = -(e.clientY / window.innerHeight - 0.5) * 40;
        });

        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // Pause animation when not in view
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.renderer.render(this.scene, this.camera);
            }
        });
    }
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    new ThreeDCanvasManager();
});
