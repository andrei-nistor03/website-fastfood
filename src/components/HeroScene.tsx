"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Manual p.14 "FOTOGRAFIE": a little theatrical movement is allowed — crumbs,
 * splashes, steam — "dar aplicat cu măsură". This is that, and nothing more:
 * a slow drift of fried-crumb flakes behind the hero, parallaxed by the
 * pointer. Low count, low contrast, no bloom, no sparkle. Texture, not decor.
 */

const FLAKE_COUNT = 120;
const TONES = [0xf7b74a, 0xffc400, 0xffd67a, 0xe9a63c, 0xf4c98a];

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

    // Ambient flakes, instanced for one draw call — an icosahedron with
    // detail 0 gives a chunky, faceted flake, close enough to a piece of
    // breading catching the light.
    const flakeGeo = new THREE.IcosahedronGeometry(1, 0);
    const flakeMat = new THREE.MeshStandardMaterial({
      roughness: 0.85,
      metalness: 0,
      flatShading: true,
      transparent: true,
      opacity: 0.85,
    });
    const flakes = new THREE.InstancedMesh(flakeGeo, flakeMat, FLAKE_COUNT);
    flakes.instanceColor = new THREE.InstancedBufferAttribute(
      new Float32Array(FLAKE_COUNT * 3),
      3,
    );

    const dummy = new THREE.Object3D();
    const flakeState: {
      pos: THREE.Vector3;
      rot: THREE.Vector3;
      scale: number;
      drift: { x: number; y: number; rx: number; ry: number };
    }[] = [];

    const color = new THREE.Color();
    for (let i = 0; i < FLAKE_COUNT; i++) {
      const s = 0.05 + Math.random() * 0.13;
      const state = {
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 28,
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 11,
        ),
        rot: new THREE.Vector3(
          Math.random() * 6,
          Math.random() * 6,
          Math.random() * 6,
        ),
        scale: s,
        drift: {
          x: (Math.random() - 0.5) * 0.006,
          y: 0.004 + Math.random() * 0.009,
          rx: (Math.random() - 0.5) * 0.006,
          ry: (Math.random() - 0.5) * 0.006,
        },
      };
      flakeState.push(state);

      dummy.position.copy(state.pos);
      dummy.rotation.set(state.rot.x, state.rot.y, state.rot.z);
      dummy.scale.set(s, s * (0.6 + Math.random() * 0.7), s * 0.7);
      dummy.updateMatrix();
      flakes.setMatrixAt(i, dummy.matrix);

      color.setHex(TONES[i % TONES.length]);
      flakes.setColorAt(i, color);
    }
    scene.add(flakes);

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

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      pointer.x += (target.x - pointer.x) * 0.04;
      pointer.y += (target.y - pointer.y) * 0.04;

      for (let i = 0; i < FLAKE_COUNT; i++) {
        const s = flakeState[i];
        s.pos.y += s.drift.y;
        s.pos.x += s.drift.x;
        s.rot.x += s.drift.rx;
        s.rot.y += s.drift.ry;
        if (s.pos.y > 9) {
          s.pos.y = -9;
          s.pos.x = (Math.random() - 0.5) * 28;
        }
        dummy.position.copy(s.pos);
        dummy.rotation.set(s.rot.x, s.rot.y, s.rot.z);
        dummy.scale.set(s.scale, s.scale * 0.8, s.scale * 0.7);
        dummy.updateMatrix();
        flakes.setMatrixAt(i, dummy.matrix);
      }
      flakes.instanceMatrix.needsUpdate = true;

      camera.position.x = pointer.x * 1.1;
      camera.position.y = -pointer.y * 0.7;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      ro.disconnect();
      io.disconnect();
      flakeGeo.dispose();
      flakeMat.dispose();
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={host} aria-hidden className={className} />;
}
