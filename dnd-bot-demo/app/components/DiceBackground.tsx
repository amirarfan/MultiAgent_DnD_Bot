import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';

const DICE_TYPES = [
  { geometry: new THREE.IcosahedronGeometry(1, 0), type: 'd20' },  
  { geometry: new THREE.DodecahedronGeometry(0.8, 0), type: 'd12' },  
  { geometry: new THREE.ConeGeometry(0.7, 1.4, 10), type: 'd10' },  
  { geometry: new THREE.OctahedronGeometry(0.7, 0), type: 'd8' },  
  { geometry: new THREE.BoxGeometry(0.6, 0.6, 0.6), type: 'd6' },  
  { geometry: new THREE.TetrahedronGeometry(0.6, 0), type: 'd4' },  
];

export default function DiceBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const diceRef = useRef<THREE.Mesh[]>([]);
  const particlesRef = useRef<THREE.Points[]>([]);
  const timeRef = useRef<number>(0);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const scrollProgressRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgressRef.current = Math.min(scrollPosition / maxScroll, 1);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 8;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      stencil: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const createDiceMaterial = () => {
      return new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          mousePosition: { value: new THREE.Vector2(0, 0) },
          baseColor: { value: new THREE.Color('#1a1a1a') },
          glowColor: { value: new THREE.Color('#a855f7') },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          uniform vec2 mousePosition;
          
          void main() {
            vUv = uv;
            vNormal = normal;
            vPosition = position;
            
            vec3 pos = position;
            float displacement = sin(pos.x * 3.0 + time) * 0.01 +
                               cos(pos.y * 2.0 + time) * 0.01;
            
            float mouseEffect = length(mousePosition - vec2(pos.x, pos.y)) * 0.04;
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
            vec3 glow = mix(baseColor, glowColor, pulse * 0.6);
            
            float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
            fresnel = mix(0.1, 1.0, fresnel);
            
            float runePattern = step(0.97, sin(vPosition.x * 20.0 + time) * 
                                      sin(vPosition.y * 20.0 + time * 0.5));
            
            vec3 finalColor = mix(glow, glowColor, fresnel * 0.7);
            finalColor = mix(finalColor, glowColor, runePattern);
            
            gl_FragColor = vec4(finalColor, fresnel * 0.9 + runePattern * 0.3);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
      });
    };

    // Create and position dice
    DICE_TYPES.forEach((diceType, index) => {
      const material = createDiceMaterial();
      const dice = new THREE.Mesh(diceType.geometry, material);
      
      const angle = (index / DICE_TYPES.length) * Math.PI * 2;
      const radius = 3;
      dice.position.x = Math.cos(angle) * radius;
      dice.position.y = Math.sin(angle) * radius;
      dice.position.z = Math.random() * 2 - 1;

      scene.add(dice);
      diceRef.current.push(dice);

      // Add edge highlighting
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(diceType.geometry),
        new THREE.LineBasicMaterial({ 
          color: new THREE.Color('#a855f7'),
          transparent: true,
          opacity: 0.3,
        })
      );
      dice.add(edges);
    });

    diceRef.current.forEach((dice) => {
      const particlesGeometry = new THREE.BufferGeometry();
      const particleCount = 50;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = dice.position.x + (Math.random() - 0.5) * 2;
        positions[i + 1] = dice.position.y + (Math.random() - 0.5) * 2;
        positions[i + 2] = dice.position.z + (Math.random() - 0.5) * 2;

        colors[i] = 0.6 + Math.random() * 0.4;
        colors[i + 1] = 0.3 + Math.random() * 0.4;
        colors[i + 2] = 0.9 + Math.random() * 0.1;
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      });

      const particles = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particles);
      particlesRef.current.push(particles);
    });

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

      const scrollProgress = scrollProgressRef.current;
      
      diceRef.current.forEach((dice, index) => {
        if (dice.material instanceof THREE.ShaderMaterial) {
          dice.material.uniforms.time.value = timeRef.current;
          dice.material.uniforms.mousePosition.value.set(
            mouseRef.current.x * 0.1,
            mouseRef.current.y * 0.1
          );
        }

        // Calculate the target position based on scroll progress
        const angle = (index / DICE_TYPES.length) * Math.PI * 2;
        const baseRadius = 3;
        const radius = baseRadius * scrollProgress;
        
        const targetX = Math.cos(angle) * radius;
        const targetY = Math.sin(angle) * radius;
        const targetZ = scrollProgress < 0.1 ? 0 : Math.sin(angle * 2) * 0.5;

        // Interpolate current position to target position
        dice.position.x += (targetX - dice.position.x) * 0.05;
        dice.position.y += (targetY - dice.position.y) * 0.05;
        dice.position.z += (targetZ - dice.position.z) * 0.05;

        // Scale based on scroll progress (all dice start as one)
        const scale = scrollProgress < 0.1 ? 1 : 1 - (scrollProgress * 0.4); // 0.4 is the scale when the dice are separated
        dice.scale.setScalar(scale);

        // Rotation effects - reduce movement when separated
        if (scrollProgress < 0.1) {
          // More active rotation when combined
          dice.rotation.x = Math.sin(timeRef.current * 0.2 + index) * 0.1;
          dice.rotation.y += 0.001 + (index * 0.0005);
          dice.rotation.z = Math.cos(timeRef.current * 0.15 + index) * 0.1;
        } else {
          // Stable rotation when separated
          const targetRotationX = Math.sin(angle * 2) * 0.2;
          const targetRotationY = angle;
          const targetRotationZ = Math.cos(angle * 2) * 0.2;
          
          dice.rotation.x += (targetRotationX - dice.rotation.x) * 0.02;
          dice.rotation.y += (targetRotationY - dice.rotation.y) * 0.02;
          dice.rotation.z += (targetRotationZ - dice.rotation.z) * 0.02;
        }
      });

      particlesRef.current.forEach((particles, index) => {
        const positions = particles.geometry.attributes.position.array;
        const dice = diceRef.current[index];
        
        for (let i = 0; i < positions.length; i += 3) {
          const followStrength = 0.005 * (1 + scrollProgress);
          positions[i] += (dice.position.x - positions[i]) * followStrength;
          positions[i + 1] += (dice.position.y - positions[i + 1]) * followStrength;
          positions[i + 2] += (dice.position.z - positions[i + 2]) * followStrength;
          
          const randomness = 0.005 * scrollProgress;
          positions[i] += (Math.random() - 0.5) * randomness;
          positions[i + 1] += (Math.random() - 0.5) * randomness;
          positions[i + 2] += (Math.random() - 0.5) * randomness;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Adjust particle opacity based on scroll
        if (particles.material instanceof THREE.PointsMaterial) {
          particles.material.opacity = scrollProgress < 0.1 ? 
            (index === 0 ? 0.6 : 0) : 
            0.6 * scrollProgress;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    // Mouse movement handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      };

      // Parallax effect on camera
      gsap.to(camera.position, {
        x: mouseRef.current.x * 0.5,
        y: mouseRef.current.y * 0.5,
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