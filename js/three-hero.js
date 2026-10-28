/**
 * ============================================================
 * KHANG PORTFOLIO — 3D HOLOGRAPHIC QUANTUM TECH REACTOR (Three.js)
 * Interactive 3D Java Core with Orbital Rings & Tech Stack Cubes
 * ============================================================
 */

const TechCore3D = (() => {
  'use strict';

  let scene, camera, renderer, container;
  let coreGroup, innerCore, outerCage, laserRing;
  let gimbalRings = [];
  let techCubes = [];
  let particleField;
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  let isVisible = true;
  let animId = null;

  function getColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      coreWire: isDark ? 0x00f2fe : 0x2563eb,
      coreInner: isDark ? 0x9333ea : 0x4f46e5,
      coreGlow: isDark ? 0x00f2fe : 0x3b82f6,
      ring1: isDark ? 0x00f2fe : 0x2563eb,
      ring2: isDark ? 0xa855f7 : 0x7c3aed,
      ring3: isDark ? 0x00ffcc : 0x059669,
      particles: isDark ? 0x38bdf8 : 0x60a5fa,
      laser: isDark ? 0x00f2fe : 0x3b82f6,
    };
  }

  function init() {
    container = document.getElementById('khang-3d-canvas');
    if (!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 420;
    const height = container.clientHeight || 420;

    // 1. Scene & Camera
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 135;

    // 2. Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = ''; // clean any previous content
    container.appendChild(renderer.domElement);

    const colors = getColors();

    // 3. Central Core Group
    coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Inner Glowing Core (Octahedron crystal)
    const innerGeo = new THREE.OctahedronGeometry(18, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: colors.coreInner,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });
    innerCore = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerCore);

    // Inner solid crystal facet for depth
    const facetGeo = new THREE.OctahedronGeometry(13, 0);
    const facetMat = new THREE.MeshBasicMaterial({
      color: colors.coreGlow,
      wireframe: false,
      transparent: true,
      opacity: 0.35
    });
    const facetMesh = new THREE.Mesh(facetGeo, facetMat);
    coreGroup.add(facetMesh);

    // Outer Cage (Icosahedron Wireframe)
    const outerGeo = new THREE.IcosahedronGeometry(28, 1);
    const outerMat = new THREE.MeshBasicMaterial({
      color: colors.coreWire,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    outerCage = new THREE.Mesh(outerGeo, outerMat);
    coreGroup.add(outerCage);

    // Central Core PointLight
    const pointLight = new THREE.PointLight(colors.coreGlow, 3, 160);
    coreGroup.add(pointLight);

    // 4. Gimbal Gyroscope Rings (3 nested orbital rings)
    function addRing(radius, tube, rotX, rotY, color) {
      const ringGeo = new THREE.TorusGeometry(radius, tube, 8, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = rotX;
      ring.rotation.y = rotY;
      coreGroup.add(ring);
      gimbalRings.push(ring);
      return ring;
    }

    addRing(38, 0.45, Math.PI / 4, 0, colors.ring1);
    addRing(46, 0.4, 0, Math.PI / 3, colors.ring2);
    addRing(54, 0.35, -Math.PI / 3, Math.PI / 6, colors.ring3);

    // Holographic Laser Scan Ring
    const laserGeo = new THREE.RingGeometry(24, 25.5, 32);
    const laserMat = new THREE.MeshBasicMaterial({
      color: colors.laser,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65
    });
    laserRing = new THREE.Mesh(laserGeo, laserMat);
    laserRing.rotation.x = Math.PI / 2;
    coreGroup.add(laserRing);

    // 5. Orbiting Tech Cubes (Java, Spring, MySQL, Docker)
    const techData = [
      { name: 'Java', color: 0xf59e0b, radius: 64, speed: 0.012, angle: 0, label: '☕' },
      { name: 'Spring', color: 0x10b981, radius: 68, speed: 0.009, angle: Math.PI / 2, label: '🍃' },
      { name: 'MySQL', color: 0x00f2fe, radius: 65, speed: 0.011, angle: Math.PI, label: '🗄️' },
      { name: 'Docker', color: 0x38bdf8, radius: 72, speed: 0.008, angle: Math.PI * 1.5, label: '🐳' }
    ];

    techData.forEach(item => {
      const cubeGroup = new THREE.Group();

      // Mini Wireframe Cube
      const cGeo = new THREE.BoxGeometry(7, 7, 7);
      const cMat = new THREE.MeshBasicMaterial({
        color: item.color,
        wireframe: true,
        transparent: true,
        opacity: 0.9
      });
      const cMesh = new THREE.Mesh(cGeo, cMat);
      cubeGroup.add(cMesh);

      // Inner Glowing Center
      const coreDotGeo = new THREE.OctahedronGeometry(2.5, 0);
      const coreDotMat = new THREE.MeshBasicMaterial({ color: item.color });
      const coreDot = new THREE.Mesh(coreDotGeo, coreDotMat);
      cubeGroup.add(coreDot);

      coreGroup.add(cubeGroup);
      techCubes.push({
        group: cubeGroup,
        mesh: cMesh,
        data: item
      });
    });

    // 6. Ambient Micro-particles
    const pCount = 200;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      pPos[i * 3]     = (Math.random() - 0.5) * 160;
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 160;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 160;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));

    const pMat = new THREE.PointsMaterial({
      color: colors.particles,
      size: 2.2,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    particleField = new THREE.Points(pGeo, pMat);
    scene.add(particleField);

    // 7. Interactive Mouse Tracking
    function onPointer(e) {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      targetX = (e.clientX - cx) * 0.0035;
      targetY = (e.clientY - cy) * 0.0035;
    }
    window.addEventListener('mousemove', onPointer, { passive: true });

    // Interactive Click Burst
    container.addEventListener('click', () => {
      if (typeof gsap !== 'undefined') {
        gsap.fromTo(coreGroup.scale,
          { x: 1.3, y: 1.3, z: 1.3 },
          { x: 1, y: 1, z: 1, duration: 0.7, ease: 'elastic.out(1, 0.4)' }
        );
      } else {
        coreGroup.scale.set(1.2, 1.2, 1.2);
        setTimeout(() => coreGroup.scale.set(1, 1, 1), 250);
      }
    });

    // Resize
    function onResize() {
      if (!container) return;
      const w = container.clientWidth || 420;
      const h = container.clientHeight || 420;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener('resize', onResize, { passive: true });

    // Performance Observer
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        isVisible = entries[0].isIntersecting;
      }, { threshold: 0.1 });
      io.observe(container);
    }

    // Theme changes
    const themeObs = new MutationObserver(() => {
      const c = getColors();
      innerMat.color.setHex(c.coreInner);
      facetMat.color.setHex(c.coreGlow);
      outerMat.color.setHex(c.coreWire);
      if (gimbalRings[0]) gimbalRings[0].material.color.setHex(c.ring1);
      if (gimbalRings[1]) gimbalRings[1].material.color.setHex(c.ring2);
      if (gimbalRings[2]) gimbalRings[2].material.color.setHex(c.ring3);
      laserMat.color.setHex(c.laser);
      pMat.color.setHex(c.particles);
    });
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    // 8. Animation Loop
    const clock = new THREE.Clock();

    function render() {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Mouse lerp rotation
      mouseX += (targetX - mouseX) * 0.08;
      mouseY += (targetY - mouseY) * 0.08;

      coreGroup.rotation.y = time * 0.25 + mouseX * 2.5;
      coreGroup.rotation.x = Math.sin(time * 0.2) * 0.15 + mouseY * 2.5;

      // Inner Core spin
      innerCore.rotation.x += 0.02;
      innerCore.rotation.y += 0.03;
      facetMesh.rotation.y -= 0.015;

      // Outer Cage counter-spin
      outerCage.rotation.y -= 0.008;
      outerCage.rotation.z += 0.005;

      // Rings Gimbal Rotation
      if (gimbalRings[0]) gimbalRings[0].rotation.z += 0.015;
      if (gimbalRings[1]) gimbalRings[1].rotation.x -= 0.012;
      if (gimbalRings[2]) gimbalRings[2].rotation.y += 0.014;

      // Laser Scanner scan up and down
      laserRing.position.y = Math.sin(time * 2.2) * 26;
      laserRing.scale.setScalar(1 + Math.abs(Math.sin(time * 2.2)) * 0.2);

      // Tech Cubes orbital movement
      techCubes.forEach(item => {
        item.data.angle += item.data.speed;
        const r = item.data.radius;
        item.group.position.x = Math.cos(item.data.angle) * r;
        item.group.position.z = Math.sin(item.data.angle) * r;
        item.group.position.y = Math.sin(item.data.angle * 2 + time * 1.5) * 12;

        item.mesh.rotation.x += 0.03;
        item.mesh.rotation.y += 0.04;
      });

      // Particle Field slow drift
      particleField.rotation.y = time * 0.03;

      renderer.render(scene, camera);
    }

    render();
  }

  return { init };
})();

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', TechCore3D.init);
} else {
  TechCore3D.init();
}
