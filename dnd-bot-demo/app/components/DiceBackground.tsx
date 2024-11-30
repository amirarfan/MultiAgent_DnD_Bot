import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

export default function DiceBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const dragonRef = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const timeRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 6;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      stencil: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const geometry = new THREE.IcosahedronGeometry(1, 0);
    
    const edgesGeometry = new THREE.EdgesGeometry(geometry);
    const edgesMaterial = new THREE.LineBasicMaterial({ 
      color: new THREE.Color('#a855f7'),
      transparent: true,
      opacity: 0.5,
    });
    const edges = new THREE.LineSegments(edgesGeometry, edgesMaterial);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: new THREE.Color('#1a1a1a') },
        glowColor: { value: new THREE.Color('#a855f7') },
        mouse: { value: new THREE.Vector2(0, 0) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        uniform vec2 mouse;
        
        void main() {
          vUv = uv;
          vNormal = normal;
          vPosition = position;
          
          vec3 pos = position;
          float displacement = sin(pos.x * 3.0 + time) * 0.02 +
                             cos(pos.y * 2.0 + time) * 0.02;
          
          float mouseEffect = length(mouse - vec2(pos.x, pos.y)) * 0.05;
          displacement += mouseEffect;
          
          pos += normal * displacement;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;
        uniform vec3 baseColor;
        uniform vec3 glowColor;
        
        void main() {
          float pulse = sin(time * 1.5) * 0.5 + 0.5;
          vec3 glow = mix(baseColor, glowColor, pulse * 0.5);
          
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          fresnel = mix(0.1, 1.0, fresnel);
          
          float runePattern = step(0.98, sin(vPosition.x * 20.0 + time) * 
                                      sin(vPosition.y * 20.0 + time * 0.5));
          
          vec3 finalColor = mix(glow, glowColor, fresnel * 0.5);
          finalColor = mix(finalColor, glowColor, runePattern);
          
          gl_FragColor = vec4(finalColor, fresnel * 0.8 + runePattern * 0.2);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });

    const dice = new THREE.Mesh(geometry, material);
    dice.add(edges);
    scene.add(dice);
    dragonRef.current = dice;

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 42;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 2 + Math.random() * 2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);

      colors[i] = 0.66 + Math.random() * 0.2;
      colors[i + 1] = 0.33 + Math.random() * 0.2;
      colors[i + 2] = 0.99 + Math.random() * 0.2;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xa855f7, 2, 10);
    pointLight1.position.set(2, 2, 2);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x4c1d95, 2, 10);
    pointLight2.position.set(-2, -2, -2);
    scene.add(pointLight2);

    const animate = () => {
      requestAnimationFrame(animate);
      timeRef.current += 0.005;

      if (dice && material.uniforms) {
        material.uniforms.time.value = timeRef.current;

        dice.rotation.x = Math.sin(timeRef.current * 0.3) * 0.1;
        dice.rotation.y += 0.003;
        dice.rotation.z = Math.cos(timeRef.current * 0.2) * 0.1;
      }

      if (particles) {
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 1] += Math.sin(timeRef.current + positions[i]) * 0.002;
          positions[i] += Math.cos(timeRef.current + positions[i + 1]) * 0.002;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        particles.rotation.y += 0.0005;
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleMouseMove = (event: MouseEvent) => {
      if (!dice || !material.uniforms) return;

      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      material.uniforms.mouse.value.set(mouseX, mouseY);

      gsap.to(dice.rotation, {
        x: mouseY * 0.3,
        y: mouseX * 0.3,
        duration: 1,
        ease: 'power2.out',
      });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current) {
        containerRef.current?.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-0"
      style={{ 
        background: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.15) 0%, rgba(0, 0, 0, 0) 50%)',
      }}
    />
  );
}