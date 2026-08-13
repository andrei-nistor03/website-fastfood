"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";

/**
 * A short crumb puff behind whichever menu tab was just clicked — the same
 * instanced-flake language as the hero (HeroScene.tsx), kept as its own
 * idle-by-default scene so it costs nothing between clicks: no rAF loop
 * runs until burst() is called, and it stops again once every particle
 * has died out.
 */

export type MenuCrumbBurstHandle = {
  burst: (clientX: number, clientY: number) => void;
};

const TONES = [0xf7b74a, 0xffc400, 0xffd67a, 0xe9a63c, 0xf4c98a, 0xd98d2e];
const COUNT = 22;
const GRAVITY = 220;

type Particle = {
  active: boolean;
  life: number;
  maxLife: number;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Vector3;
  rotVel: THREE.Vector3;
  scale: number;
};

const MenuCrumbBurst = forwardRef<MenuCrumbBurstHandle, { className?: string }>(
  function MenuCrumbBurst({ className = "" }, ref) {
    const host = useRef<HTMLDivElement>(null);
    const queued = useRef<{ x: number; y: number }[]>([]);
    const wake = useRef<() => void>(() => {});

    useImperativeHandle(ref, () => ({
      burst: (clientX, clientY) => {
        const el = host.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        queued.current.push({ x: clientX - rect.left, y: clientY - rect.top });
        wake.current();
      },
    }));

    useEffect(() => {
      const el = host.current;
      if (!el) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (reduced.matches || window.innerWidth < 640) return;

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      let width = el.clientWidth || 1;
      let height = el.clientHeight || 1;
      // Orthographic, top=0/bottom=height so world space matches DOM pixels
      // (y grows downward) — a burst at (clientX, clientY) needs no flip.
      const camera = new THREE.OrthographicCamera(0, width, 0, height, -100, 100);

      scene.add(new THREE.AmbientLight(0xffffff, 1.8));
      const key = new THREE.DirectionalLight(0xfff2d0, 1.6);
      key.position.set(2, -4, 6);
      scene.add(key);

      const geometry = new THREE.IcosahedronGeometry(1, 0);
      const material = new THREE.MeshStandardMaterial({
        roughness: 0.85,
        metalness: 0,
        flatShading: true,
        transparent: true,
      });
      const mesh = new THREE.InstancedMesh(geometry, material, COUNT);
      mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(COUNT * 3), 3);
      scene.add(mesh);

      const particles: Particle[] = Array.from({ length: COUNT }, () => ({
        active: false,
        life: 0,
        maxLife: 1,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        rot: new THREE.Vector3(),
        rotVel: new THREE.Vector3(),
        scale: 1,
      }));

      const color = new THREE.Color();
      const spawnBurst = (x: number, y: number) => {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (p.active) continue;
          const angle = Math.random() * Math.PI * 2;
          const speed = 50 + Math.random() * 90;
          p.active = true;
          p.life = 1;
          p.maxLife = 0.55 + Math.random() * 0.25;
          p.pos.set(x, y, 0);
          // A small upward pop (negative y = up in this DOM-matched space),
          // then gravity below pulls it back down.
          p.vel.set(Math.cos(angle) * speed, Math.sin(angle) * speed - 60, 0);
          p.rot.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
          p.rotVel.set(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
          );
          p.scale = 4 + Math.random() * 6;
          color.setHex(TONES[Math.floor(Math.random() * TONES.length)]);
          mesh.setColorAt(i, color);
        }
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      };

      const onResize = () => {
        if (!el.clientWidth) return;
        width = el.clientWidth;
        height = el.clientHeight;
        camera.right = width;
        camera.bottom = height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(el);
      onResize();

      const dummy = new THREE.Object3D();
      let raf = 0;
      let running = false;
      let last = performance.now();

      const tick = (now: number) => {
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;

        while (queued.current.length) {
          const q = queued.current.shift()!;
          spawnBurst(q.x, q.y);
        }

        let anyActive = false;
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          if (p.active) {
            p.life -= dt / p.maxLife;
            if (p.life <= 0) p.active = false;
          }
          if (p.active) {
            anyActive = true;
            p.vel.y += GRAVITY * dt;
            p.pos.x += p.vel.x * dt;
            p.pos.y += p.vel.y * dt;
            p.rot.x += p.rotVel.x * dt;
            p.rot.y += p.rotVel.y * dt;

            dummy.position.set(p.pos.x, p.pos.y, 0);
            dummy.rotation.set(p.rot.x, p.rot.y, p.rot.z);
            const s = p.scale * Math.min(1, p.life * 2);
            dummy.scale.set(s, s * 0.8, s * 0.7);
          } else {
            dummy.position.set(0, 0, 0);
            dummy.rotation.set(0, 0, 0);
            dummy.scale.set(0, 0, 0);
          }
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
        renderer.render(scene, camera);

        if (anyActive || queued.current.length) {
          raf = requestAnimationFrame(tick);
        } else {
          running = false;
        }
      };

      wake.current = () => {
        if (running) return;
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(tick);
      };

      return () => {
        wake.current = () => {};
        cancelAnimationFrame(raf);
        ro.disconnect();
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        el.removeChild(renderer.domElement);
      };
    }, []);

    return (
      <div
        ref={host}
        aria-hidden
        className={`pointer-events-none absolute inset-0 ${className}`}
      />
    );
  },
);

export default MenuCrumbBurst;
