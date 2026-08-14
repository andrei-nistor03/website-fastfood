"use client";

import { Suspense, useRef, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Model as KfcBucket } from "./Kfc_bucket";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The authored model measures ~0.2 world units across at scale 1 — this
// brings it up to a size that reads clearly against the camera framing
// below without every position keyframe needing its own multiplier.
const BASE_SCALE = 11;

// The model's own mesh isn't centered on its local origin (measured via
// Box3().setFromObject at a neutral transform), so animated rotation would
// otherwise swing it off-frame — this re-centers it before any animation.
const MODEL_OFFSET: [number, number, number] = [0.4113, -1.3508, 0.4705];

function BucketRig({ pinTargetRef }: { pinTargetRef?: RefObject<HTMLElement | null> }) {
  const groupRef = useRef<THREE.Group>(null);

  useGSAP(
    () => {
      const group = groupRef.current;
      if (!group) return;

      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduced) {
        group.position.set(0, 0, 0);
        group.rotation.set(0, 0, -0.04);
        return;
      }

      group.position.set(0, 3.6, 0);
      group.rotation.set(-0.55, 0.32, -0.38);

      // A fall + two diminishing bounces, keyed on position/rotation only —
      // no squash-and-stretch, the shape stays intact through the whole hit.
      const tl = gsap.timeline({ paused: true });
      tl.to(group.position, { y: 0, duration: 0.85, ease: "power2.in" })
        .to(group.rotation, { x: 0, y: 0, z: -0.04, duration: 0.85, ease: "power2.in" }, "<")
        .to(group.position, { y: 0.55, duration: 0.4, ease: "power2.out" })
        .to(group.rotation, { x: 0.14, duration: 0.4, ease: "power2.out" }, "<")
        .to(group.position, { y: 0, duration: 0.28, ease: "power2.in" })
        .to(group.rotation, { x: 0, duration: 0.28, ease: "power2.in" }, "<")
        .to(group.position, { y: 0.2, duration: 0.24, ease: "power2.out" })
        .to(group.position, { y: 0, duration: 0.2, ease: "power2.in" });

      // The pin target's DOM ref lands on the parent a frame after this
      // effect runs, so wait for it rather than silently skipping the pin.
      let raf = 0;
      let trigger: ScrollTrigger | null = null;
      const arm = () => {
        const pinTarget = pinTargetRef?.current;
        if (!pinTarget) {
          raf = requestAnimationFrame(arm);
          return;
        }
        trigger = ScrollTrigger.create({
          trigger: pinTarget,
          // "top top" so the pinned section is flush with the viewport the
          // instant it locks — anything short of that leaves the content
          // above it free to keep scrolling away while the section holds,
          // opening a gap that grows for the whole scrub range.
          start: "top top",
          end: "+=600",
          pin: true,
          scrub: 1,
          animation: tl,
        });
      };
      arm();

      return () => {
        cancelAnimationFrame(raf);
        trigger?.kill();
      };
    },
    { dependencies: [pinTargetRef] },
  );

  return (
    <group ref={groupRef}>
      <group position={MODEL_OFFSET}>
        <group scale={BASE_SCALE}>
          <Suspense fallback={null}>
            <KfcBucket />
          </Suspense>
        </group>
      </group>
    </group>
  );
}

export default function MenuBucketDrop({
  pinTargetRef,
}: {
  /** The header row (title + bucket) to pin while the drop/bounce plays out. */
  pinTargetRef?: RefObject<HTMLElement | null>;
}) {
  return (
    <div
      className="pointer-events-none absolute right-0 top-0 z-[5] hidden aspect-square w-[260px] shrink-0 md:block lg:w-[360px]"
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0.5, 6], fov: 32 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[3, 5, 6]} intensity={2.2} color={0xfff2d0} />
        <directionalLight position={[-4, -2, 3]} intensity={0.5} color={0xffffff} />
        <BucketRig pinTargetRef={pinTargetRef} />
      </Canvas>
    </div>
  );
}
