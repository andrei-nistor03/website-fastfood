"use client";

import { Suspense, useRef, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Model as KfcBucket } from "./Kfc_bucket";
import { Model as ChickenTender } from "./Krispy_fried_chicken";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The authored model measures ~0.2 world units across at scale 1 — this
// brings it up to a size that reads clearly against the camera framing
// below without every position keyframe needing its own multiplier.
const BASE_SCALE = 11;

// The model's own mesh isn't centered on its local origin (measured via
// Box3().setFromObject at a neutral transform), so animated rotation would
// otherwise swing it off-frame — this re-centers it before any animation.
const MODEL_OFFSET: [number, number, number] = [0.4113, -1.3508, 0.4705];

// The tender model's own long axis measures ~1 world unit at scale 1 — this
// brings a piece down to roughly a third of the bucket's width so six of
// them can land inside it without dwarfing it.
const TENDER_SCALE = 2;

// Off-frame starting height for every tender, matching the bucket's own
// pre-drop height so neither is visible before its fall begins.
const TENDER_START_Y = 3.6;

type TenderRestPose = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
};

// Landing spots, scattered around the bucket's rim center rather than the
// bucket's overall bounding-box center — the box also covers the handle and
// base, which sit well outside the opening. The rim center was found by
// tracing the bucket mesh's own tall axis through its full transform chain
// (group rotation/scale -> BASE_SCALE -> MODEL_OFFSET), the same technique
// used to measure MODEL_OFFSET itself, landing at roughly (-0.19, 0.63,
// -0.22) in this component's local space. x/y/z below are hand-tuned
// scatter + stacking around that point; rx/ry/rz are just orientation
// variety so the pieces don't look identical. All six are easy to nudge
// individually to test different landing spreads.
const TENDER_RESTS: TenderRestPose[] = [
  { x: -0.6, y: 0.6, z: -0.04, rx: 0, ry: 0, rz: 3 },
  { x: 0.38, y: 0.6, z: 0.34, rx: 0, ry: 0, rz: 2 },
  { x: -0.5, y: 0.5, z: -0.46, rx: 0.1, ry: 0.4, rz: 2.5 },
  { x: 0.26, y: 0.7, z: -0.02, rx: -0.3, ry: -1, rz: 2.5 },
  { x: -0.26, y: 0.65, z: -0.04, rx: 0.6, ry: 0.9, rz: 2.5 },
  { x: -0.02, y: 0.75, z: 0.2, rx: -0.3, ry: 0.6, rz: 2.5 },
];

// How far into the bucket's own tl (in the same seconds used by its
// tweens above) the first tender starts falling, and the gap between each
// subsequent one — together these decide how "staggered" the rain-in reads.
const TENDERS_START = 1.3;

// The bucket's own drop+bounce (added up from the tweens above) runs
// ~1.97s. Each tender's fall+settle below is scaled by the same ~2.74x
// factor so one tender takes just as long as the bucket does, instead of
// covering a similar fall distance in under half the time and reading as
// sped-up next to it. The stagger is scaled the same amount to keep the
// rain-in proportionally as cascaded as before.
const TENDER_STAGGER = 0.33;

function TenderPiece({
  innerRef,
}: {
  innerRef: (el: THREE.Group | null) => void;
}) {
  return (
    <group ref={innerRef}>
      <Suspense fallback={null}>
        <ChickenTender scale={TENDER_SCALE} />
      </Suspense>
    </group>
  );
}

function BucketRig({
  pinTargetRef,
}: {
  pinTargetRef?: RefObject<HTMLElement | null>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const tenderRefs = useRef<(THREE.Group | null)[]>([]);

  useGSAP(
    () => {
      const group = groupRef.current;
      if (!group) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) {
        group.position.set(0, 0, 0);
        group.rotation.set(0, 0, -0.04);
        tenderRefs.current.forEach((tender, i) => {
          if (!tender) return;
          const rest = TENDER_RESTS[i];
          tender.position.set(rest.x, rest.y, rest.z);
          tender.rotation.set(rest.rx, rest.ry, rest.rz);
        });
        return;
      }

      group.position.set(0, 3.6, 0);
      group.rotation.set(-0.55, 0.7, -0.38);

      // A fall + two diminishing bounces, keyed on position/rotation only —
      // no squash-and-stretch, the shape stays intact through the whole hit.
      const tl = gsap.timeline({ paused: true });
      tl.to(group.position, { y: 0, duration: 0.85, ease: "power2.in" })
        .to(
          group.rotation,
          { x: 0, y: 0, z: -0.04, duration: 0.85, ease: "power2.in" },
          "<",
        )
        .to(group.position, { y: 0.55, duration: 0.4, ease: "power2.out" })
        .to(group.rotation, { x: 0.4, duration: 0.4, ease: "power2.out" }, "<")
        .to(group.position, { y: 0, duration: 0.28, ease: "power2.in" })
        .to(group.rotation, { x: 0.6, duration: 0.28, ease: "power2.in" }, "<")
        .to(group.position, { y: 0, duration: 0.28, ease: "power2.in" })
        .to(group.position, { y: 0.2, duration: 0.24, ease: "power2.out" });

      // Tenders rain in on the same tl, starting mid-bounce so they land
      // just after the bucket settles. Each is a sibling of `group` (not a
      // child of it) so the bucket's own tumble on the way down doesn't
      // drag them around before their turn — they only move once their own
      // tween starts.
      tenderRefs.current.forEach((tender, i) => {
        if (!tender) return;
        const rest = TENDER_RESTS[i];
        const spin = i % 2 === 0 ? 1 : -1;

        tender.position.set(rest.x, TENDER_START_Y, rest.z);
        tender.rotation.set(
          rest.rx + spin * 1.3,
          rest.ry - spin * 1.6,
          rest.rz + spin * 0.9,
        );

        const dropAt = TENDERS_START + i * TENDER_STAGGER;
        tl.to(
          tender.position,
          { y: rest.y, duration: 1.23, ease: "power2.in" },
          dropAt,
        )
          .to(
            tender.rotation,
            {
              x: rest.rx,
              y: rest.ry,
              z: rest.rz,
              duration: 1.37,
              ease: "power1.out",
            },
            "<",
          )
          .to(
            tender.position,
            { y: rest.y + 0.08, duration: 0.27, ease: "power1.out" },
            ">",
          )
          .to(
            tender.position,
            { y: rest.y, duration: 0.33, ease: "power1.in" },
            ">",
          );
      });

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
          // Pins before the section reaches the top of the viewport so the
          // drop kicks off sooner. Content above keeps scrolling until this
          // fires, so pushing this further down (e.g. "top 50%") widens the
          // gap that opens above the pinned section for the whole scrub range.
          start: "top 10%",
          end: "+=1200",
          pin: true,
          scrub: 1,
          animation: tl,
        });
        // This trigger is created late (after the model's own async setup),
        // well after Motion.tsx has already created the triggers for every
        // section below (Locations, About, ...). Those measured their start
        // positions against a shorter, pre-pin document, so they're left
        // stale once this pin inserts its spacer height. A plain refresh()
        // re-measures geometry but does NOT recompute how much of that
        // spacer earlier triggers should account for — GSAP only applies
        // that correction to triggers in its internally sorted (by scroll
        // position) list, and this pin was created and appended after that
        // list was built. sort() rebuilds it in the pin's true document
        // position before refresh() recalculates everyone downstream.
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
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
    <>
      <group ref={groupRef}>
        <group position={MODEL_OFFSET}>
          <group scale={BASE_SCALE}>
            <Suspense fallback={null}>
              <KfcBucket />
            </Suspense>
          </group>
        </group>
      </group>
      {TENDER_RESTS.map((_, i) => (
        <TenderPiece
          key={i}
          innerRef={(el) => {
            tenderRefs.current[i] = el;
          }}
        />
      ))}
    </>
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
        shadows="soft"
        camera={{ position: [0, 0.5, 6], fov: 32 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={1.5} />
        <directionalLight
          position={[3, 5, 6]}
          intensity={2.2}
          color={0xfff2d0}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-1.5}
          shadow-camera-right={1.5}
          shadow-camera-top={1.5}
          shadow-camera-bottom={-1.5}
          shadow-camera-near={6}
          shadow-camera-far={11}
          shadow-bias={-0.0003}
          shadow-normalBias={0.015}
        />
        <directionalLight
          position={[-4, -2, 3]}
          intensity={0.5}
          color={0xffffff}
        />
        <BucketRig pinTargetRef={pinTargetRef} />
      </Canvas>
    </div>
  );
}
