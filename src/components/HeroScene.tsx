"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Manual p.14 "FOTOGRAFIE": a little theatrical movement is allowed — crumbs,
 * splashes, steam — "dar aplicat cu măsură". This is that, and nothing more:
 * a slow drift of fried-crumb flakes behind the hero, parallaxed by the
 * pointer, with a noticeable push-away right around the cursor. Low
 * contrast, no bloom, no sparkle. Texture, not decor.
 */

const TONES = [0xf7b74a, 0xffc400, 0xffd67a, 0xe9a63c, 0xf4c98a, 0xd98d2e];

// World-space spread every flake group is scattered across.
const SPREAD = { x: 28, y: 18, z: 11 };

type FlakeState = {
  pos: THREE.Vector3;
  rot: THREE.Vector3;
  scale: number;
  drift: { x: number; y: number; rx: number; ry: number };
};

type FlakeGroup = {
  geometry: THREE.BufferGeometry;
  material: THREE.MeshStandardMaterial;
  mesh: THREE.InstancedMesh;
  states: FlakeState[];
};

function createFlakeGroup(
  geometry: THREE.BufferGeometry,
  count: number,
  sizeRange: [number, number],
  flattenRange: [number, number],
): FlakeGroup {
  const material = new THREE.MeshStandardMaterial({
    roughness: 0.85,
    metalness: 0,
    flatShading: true,
    transparent: true,
    opacity: 0.85,
  });
  const mesh = new THREE.InstancedMesh(geometry, material, count);
  mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3);

  const states: FlakeState[] = [];
  const dummy = new THREE.Object3D();
  const color = new THREE.Color();

  for (let i = 0; i < count; i++) {
    const s = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
    const state: FlakeState = {
      pos: new THREE.Vector3(
        (Math.random() - 0.5) * SPREAD.x,
        (Math.random() - 0.5) * SPREAD.y,
        (Math.random() - 0.5) * SPREAD.z,
      ),
      rot: new THREE.Vector3(Math.random() * 6, Math.random() * 6, Math.random() * 6),
      scale: s,
      drift: {
        x: (Math.random() - 0.5) * 0.006,
        y: 0.004 + Math.random() * 0.009,
        rx: (Math.random() - 0.5) * 0.006,
        ry: (Math.random() - 0.5) * 0.006,
      },
    };
    states.push(state);

    const flatten = flattenRange[0] + Math.random() * (flattenRange[1] - flattenRange[0]);
    dummy.position.copy(state.pos);
    dummy.rotation.set(state.rot.x, state.rot.y, state.rot.z);
    dummy.scale.set(s, s * flatten, s * 0.7);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);

    color.setHex(TONES[Math.floor(Math.random() * TONES.length)]);
    mesh.setColorAt(i, color);
  }

  return { geometry, material, mesh, states };
}

export default function HeroScene({ className = "" }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Below the sm breakpoint the flakes are too small to read and the frame
    // cost is not worth it.
    if (reduced.matches || window.innerWidth < 640) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return; // No WebGL — the hero reads fine without it.
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      el.clientWidth / el.clientHeight,
      0.1,
      100,
    );
    camera.position.z = 14;

    scene.add(new THREE.AmbientLight(0xffffff, 1.6));
    const key = new THREE.DirectionalLight(0xfff2d0, 2.2);
    key.position.set(3, 5, 6);
    scene.add(key);

    // Three crumb shapes for variety — chunky breading bits, sharper angular
    // shards, and small flat flecks — each its own instanced draw call.
    const groups: FlakeGroup[] = [
      createFlakeGroup(new THREE.IcosahedronGeometry(1, 0), 50, [0.06, 0.15], [0.6, 1.3]),
      createFlakeGroup(new THREE.TetrahedronGeometry(1, 0), 45, [0.045, 0.1], [0.5, 1.1]),
      createFlakeGroup(new THREE.OctahedronGeometry(1, 0), 45, [0.035, 0.085], [0.3, 0.6]),
    ];
    groups.forEach((g) => scene.add(g.mesh));

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const onResize = () => {
      if (!el.clientWidth) return;
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(el);

    // Pause when the hero is off screen so we are not burning frames on a
    // section nobody is looking at.
    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(el);

    const dummy = new THREE.Object3D();
    const pointerWorld = { x: 0, y: 0 };
    const PUSH_RADIUS = 7.5;
    const PUSH_STRENGTH = 2.6;

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      // Snappier follow than a background parallax usually wants — the
      // point is for the pointer to feel like it's actually stirring the
      // crumbs, not just tilting the camera a hair.
      pointer.x += (target.x - pointer.x) * 0.09;
      pointer.y += (target.y - pointer.y) * 0.09;
      pointerWorld.x = pointer.x * (SPREAD.x / 2);
      pointerWorld.y = -pointer.y * (SPREAD.y / 2);

      for (const group of groups) {
        const { states, mesh } = group;
        for (let i = 0; i < states.length; i++) {
          const s = states[i];
          s.pos.y += s.drift.y;
          s.pos.x += s.drift.x;
          s.rot.x += s.drift.rx;
          s.rot.y += s.drift.ry;
          if (s.pos.y > SPREAD.y / 2) {
            s.pos.y = -SPREAD.y / 2;
            s.pos.x = (Math.random() - 0.5) * SPREAD.x;
          }

          // Push flakes away from the cursor, falling off toward the edge
          // of the influence radius — visible, not violent.
          let pushX = 0;
          let pushY = 0;
          const dx = s.pos.x - pointerWorld.x;
          const dy = s.pos.y - pointerWorld.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < PUSH_RADIUS * PUSH_RADIUS) {
            const dist = Math.sqrt(distSq) || 0.001;
            const falloff = 1 - dist / PUSH_RADIUS;
            const force = falloff * falloff * PUSH_STRENGTH;
            pushX = (dx / dist) * force;
            pushY = (dy / dist) * force;
          }

          dummy.position.set(s.pos.x + pushX, s.pos.y + pushY, s.pos.z);
          dummy.rotation.set(s.rot.x, s.rot.y, s.rot.z);
          dummy.scale.set(s.scale, s.scale * 0.8, s.scale * 0.7);
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
      }

      camera.position.x = pointer.x * 2.4;
      camera.position.y = -pointer.y * 1.5;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      io.disconnect();
      groups.forEach((g) => {
        g.geometry.dispose();
        g.material.dispose();
      });
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={host} aria-hidden className={className} />;
}
