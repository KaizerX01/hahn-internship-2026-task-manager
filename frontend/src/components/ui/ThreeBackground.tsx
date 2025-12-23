import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.001);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);

    // Galaxy particle system
    const galaxyGeometry = new THREE.BufferGeometry();
    const galaxyCount = 15000;
    const positions = new Float32Array(galaxyCount * 3);
    const colors = new Float32Array(galaxyCount * 3);
    const sizes = new Float32Array(galaxyCount);

    const colorPalette = [
      new THREE.Color(0x4a0e78), // Deep purple
      new THREE.Color(0x1a0b2e), // Dark blue-purple
      new THREE.Color(0x7c3aed), // Bright purple
      new THREE.Color(0x2563eb), // Blue
      new THREE.Color(0xffffff), // White stars
    ];

    for (let i = 0; i < galaxyCount; i++) {
      const i3 = i * 3;
      
      // Spiral galaxy distribution
      const radius = Math.random() * 8;
      const spinAngle = radius * 2;
      const branchAngle = ((i % 5) / 5) * Math.PI * 2;
      
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color variation
      const mixedColor = colorPalette[Math.floor(Math.random() * colorPalette.length)].clone();
      mixedColor.lerp(new THREE.Color(0x000000), Math.random() * 0.3);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      // Size variation
      sizes[i] = Math.random() * 4 + 0.5;
    }

    galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    galaxyGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const galaxyMaterial = new THREE.PointsMaterial({
      size: 0.015,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
    });

    const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
    scene.add(galaxy);

    // Nebula clouds
    const nebulaGroup = new THREE.Group();
    
    for (let i = 0; i < 5; i++) {
      const nebulaGeometry = new THREE.BufferGeometry();
      const nebulaCount = 800;
      const nebulaPos = new Float32Array(nebulaCount * 3);
      const nebulaColors = new Float32Array(nebulaCount * 3);
      
      const nebulaColor = new THREE.Color(
        Math.random() < 0.5 ? 0x7c3aed : 0x4a0e78
      );

      for (let j = 0; j < nebulaCount; j++) {
        const j3 = j * 3;
        const radius = Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;

        nebulaPos[j3] = radius * Math.sin(phi) * Math.cos(theta);
        nebulaPos[j3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        nebulaPos[j3 + 2] = radius * Math.cos(phi);

        nebulaColors[j3] = nebulaColor.r;
        nebulaColors[j3 + 1] = nebulaColor.g;
        nebulaColors[j3 + 2] = nebulaColor.b;
      }

      nebulaGeometry.setAttribute('position', new THREE.BufferAttribute(nebulaPos, 3));
      nebulaGeometry.setAttribute('color', new THREE.BufferAttribute(nebulaColors, 3));

      const nebulaMaterial = new THREE.PointsMaterial({
        size: 0.08,
        transparent: true,
        opacity: 0.15,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const nebula = new THREE.Points(nebulaGeometry, nebulaMaterial);
      nebula.position.x = (Math.random() - 0.5) * 10;
      nebula.position.y = (Math.random() - 0.5) * 10;
      nebula.position.z = (Math.random() - 0.5) * 10;
      
      nebulaGroup.add(nebula);
    }
    
    scene.add(nebulaGroup);

    // Distant stars background
    const starsGeometry = new THREE.BufferGeometry();
    const starsCount = 2000;
    const starsPos = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i++) {
      starsPos[i] = (Math.random() - 0.5) * 100;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.02,
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(stars);

    // Glowing orbs
    const orbs: THREE.Mesh[] = [];
    const orbGeometry = new THREE.SphereGeometry(0.15, 16, 16);

    for (let i = 0; i < 6; i++) {
      const orbMaterial = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x7c3aed : 0x2563eb,
        transparent: true,
        opacity: 0.4,
      });

      const orb = new THREE.Mesh(orbGeometry, orbMaterial);
      orb.position.x = (Math.random() - 0.5) * 15;
      orb.position.y = (Math.random() - 0.5) * 15;
      orb.position.z = (Math.random() - 0.5) * 15;

      const glowGeometry = new THREE.SphereGeometry(0.25, 16, 16);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0x7c3aed : 0x2563eb,
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
      });

      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      orb.add(glow);

      orbs.push(orb);
      scene.add(orb);
    }

    // Ethereal rings
    const rings: THREE.Mesh[] = [];
    
    for (let i = 0; i < 4; i++) {
      const ringGeometry = new THREE.TorusGeometry(1.5 + i * 0.5, 0.02, 16, 100);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0x4a0e78,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide,
      });

      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.random() * Math.PI;
      ring.rotation.y = Math.random() * Math.PI;
      ring.position.z = -3;

      rings.push(ring);
      scene.add(ring);
    }

    // Ambient lighting
    const ambientLight = new THREE.AmbientLight(0x1a0b2e, 0.3);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x7c3aed, 1.5, 50);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x2563eb, 1.5, 50);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Rotate galaxy
      galaxy.rotation.y = elapsedTime * 0.03;
      galaxy.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;

      // Animate nebula clouds
      nebulaGroup.children.forEach((nebula, i) => {
        nebula.rotation.y = elapsedTime * (0.01 + i * 0.005);
        nebula.rotation.x = elapsedTime * 0.008;
      });

      // Distant stars subtle movement
      stars.rotation.y = elapsedTime * 0.005;

      // Animate orbs
      orbs.forEach((orb, i) => {
        const angle = elapsedTime * 0.2 + i * (Math.PI * 2) / orbs.length;
        orb.position.x = Math.cos(angle) * 6;
        orb.position.z = Math.sin(angle) * 6;
        orb.position.y = Math.sin(elapsedTime * 0.5 + i) * 2;
        
        orb.rotation.y = elapsedTime * 0.5;
        
        const scale = 1 + Math.sin(elapsedTime * 2 + i) * 0.2;
        orb.scale.setScalar(scale);
      });

      // Animate rings
      rings.forEach((ring, i) => {
        ring.rotation.z = elapsedTime * (0.1 + i * 0.02);
        ring.rotation.y = elapsedTime * 0.05;
      });

      // Animate lights
      pointLight1.position.x = Math.sin(elapsedTime * 0.5) * 8;
      pointLight1.position.z = Math.cos(elapsedTime * 0.5) * 8;
      
      pointLight2.position.x = Math.cos(elapsedTime * 0.3) * 8;
      pointLight2.position.z = Math.sin(elapsedTime * 0.3) * 8;

      // Smooth camera movement
      targetX += (mouseX * 0.3 - targetX) * 0.02;
      targetY += (mouseY * 0.3 - targetY) * 0.02;

      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
      
      galaxyGeometry.dispose();
      galaxyMaterial.dispose();
      starsGeometry.dispose();
      starsMaterial.dispose();
      
      nebulaGroup.children.forEach(child => {
        const points = child as THREE.Points;
        points.geometry.dispose();
        (points.material as THREE.Material).dispose();
      });
      
      orbs.forEach(orb => {
        orb.geometry.dispose();
        (orb.material as THREE.Material).dispose();
        orb.children.forEach(child => {
          const mesh = child as THREE.Mesh;
          mesh.geometry.dispose();
          (mesh.material as THREE.Material).dispose();
        });
      });
      
      rings.forEach(ring => {
        ring.geometry.dispose();
        (ring.material as THREE.Material).dispose();
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 bg-black"
    />
  );
}

