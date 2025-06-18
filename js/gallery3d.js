// 3D Gallery JavaScript
console.log("3D Gallery JavaScript loaded");

let scene, camera, renderer, cube, controls;
const galleryContainer = document.getElementById('gallery-3d-container');

function init3DGallery() {
    if (!galleryContainer) {
        console.error("3D gallery container not found!");
        return;
    }

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    // Camera
    camera = new THREE.PerspectiveCamera(75, galleryContainer.clientWidth / galleryContainer.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(galleryContainer.clientWidth, galleryContainer.clientHeight);
    galleryContainer.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    // Simple Cube
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshStandardMaterial({ color: 0x007bff });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // OrbitControls
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    // controls.maxPolarAngle = Math.PI / 2; // Prevents looking directly from top or bottom

    // Animation loop
    animate();

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate the cube for basic animation
    if (cube) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }

    if (controls) {
        controls.update(); // only required if controls.enableDamping or controls.autoRotate are set to true
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    if (galleryContainer && camera && renderer) {
        camera.aspect = galleryContainer.clientWidth / galleryContainer.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(galleryContainer.clientWidth, galleryContainer.clientHeight);
    }
}

// Toggle between 2D catalog and 3D gallery
const toggleViewBtn = document.getElementById('toggle-view-btn');
const artCatalog = document.getElementById('art-catalog'); // Get the 2D catalog section

if (toggleViewBtn && artCatalog && galleryContainer) {
    // Ensure initial states are correct based on HTML classes
    const is3DViewInitiallyHidden = galleryContainer.classList.contains('hidden');
    if (is3DViewInitiallyHidden) {
        artCatalog.classList.remove('hidden'); // Show 2D catalog
    } else {
        artCatalog.classList.add('hidden'); // Hide 2D catalog if 3D is visible
    }


    toggleViewBtn.addEventListener('click', () => {
        const is3DHidden = galleryContainer.classList.contains('hidden');
        if (is3DHidden) {
            // Switch to 3D view
            artCatalog.classList.add('hidden');
            galleryContainer.classList.remove('hidden');

            // Force reflow/repaint before adding opacity class for transition to work
            void galleryContainer.offsetWidth;
            // galleryContainer.style.opacity = 1; // Using CSS transition on class change

            toggleViewBtn.textContent = 'Switch to 2D Catalog';
            if (!scene) { // Initialize 3D gallery only once
                init3DGallery();
            } else {
                onWindowResize(); // Ensure renderer size is correct
            }
        } else {
            // Switch to 2D view
            galleryContainer.classList.add('hidden');
            artCatalog.classList.remove('hidden');

            // Force reflow/repaint
            void artCatalog.offsetWidth;
            // artCatalog.style.opacity = 1;

            toggleViewBtn.textContent = 'Switch to 3D Gallery';
        }
    });
} else {
    console.error("Toggle button, art catalog, or 3D gallery container not found for setting up view toggle.");
}

// Ensure the gallery is initialized if it's supposed to be visible from the start (e.g. if display:none is removed)
// For now, it's initialized on first click.
// if (galleryContainer && galleryContainer.style.display !== 'none') {
//    init3DGallery();
// }
