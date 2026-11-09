"use client";

import { Suspense, useRef, type RefObject } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/prefersReducedMotion";
import { Model as KfcBucket } from "./Kfc_bucket";
import { Model as ChickenTender } from "./Krispy_fried_chicken";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BASE_SCALE = 11;

const MODEL_OFFSET: [number, number, number] = [0.4113, -1.3508, 0.4705];

const TENDER_SCALE = 2;

const TENDER_START_Y = 2.4;

type TenderRestPose = {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
};

const TENDER_RESTS: TenderRestPose[] = [
  { x: -0.6, y: 0.6, z: -0.04, rx: 0, ry: 0, rz: 3 },
  { x: 0.38, y: 0.6, z: 0.34, rx: 0, ry: 0, rz: 2 },
  { x: -0.5, y: 0.5, z: -0.46, rx: 0.1, ry: 0.4, rz: 2.5 },
  { x: 0.26, y: 0.7, z: -0.02, rx: -0.3, ry: -1, rz: 2.5 },
  { x: -0.26, y: 0.65, z: -0.04, rx: 0.6, ry: 0.9, rz: 2.5 },
  { x: -0.02, y: 0.75, z: 0.2, rx: -0.3, ry: 0.6, rz: 2.5 },
];

const TENDERS_START = 1.3;

const TENDER_STAGGER = 0.33;

/** Real-time length of the full drop + tenders animation, in seconds. */
const PLAY_DURATION = 2;

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
  triggerRef,
}: {
  triggerRef?: RefObject<HTMLElement | null>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const tenderRefs = useRef<(THREE.Group | null)[]>([]);

  useGSAP(
    () => {
      const group = groupRef.current;
      if (!group) return;

      const reduced = prefersReducedMotion();
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
      // Squeeze the whole choreography into ~2s of real time, keeping the
      // relative timing of the bucket bounce and the staggered tenders.
      tl.timeScale(tl.duration() / PLAY_DURATION);

      let raf = 0;
      let trigger: ScrollTrigger | null = null;
      const arm = () => {
        const target = triggerRef?.current;
        if (!target) {
          raf = requestAnimationFrame(arm);
          return;
        }
        // Plays once when the header row scrolls into view, then stays at its
        // final pose — no pinning, no scrubbing.
        trigger = ScrollTrigger.create({
          trigger: target,
          start: "top 75%",
          once: true,
          onEnter: () => tl.play(),
        });
      };
      arm();

      return () => {
        cancelAnimationFrame(raf);
        trigger?.kill();
        tl.kill();
      };
    },
    { dependencies: [triggerRef] },
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
  triggerRef,
}: {
  /** Element whose arrival in the viewport starts the one-shot drop animation. */
  triggerRef?: RefObject<HTMLElement | null>;
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
        <BucketRig triggerRef={triggerRef} />
      </Canvas>
    </div>
  );
}
