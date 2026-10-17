import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { prefersReducedMotion } from "../hooks.js";

const R = 1.5;

function leatherTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const g = c.getContext("2d");
   g.fillStyle = "#c0132a";
  // g.fillStyle = "#000000ff";
  g.fillRect(0, 0, 512, 512);
  const img = g.getImageData(0, 0, 512, 512);
  for (let i = 0; i < img.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 40;
    img.data[i] += n;
    img.data[i + 1] += n * 0.3;
    img.data[i + 2] += n * 0.3;
  }
  g.putImageData(img, 0, 0);
  for (let i = 0; i < 2400; i++) {
    g.fillStyle = "rgba(0,0,0," + Math.random() * 0.13 + ")";
    g.beginPath();
    g.arc(Math.random() * 512, Math.random() * 512, Math.random() * 2.2 + 0.6, 0, 6.283);
    g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

/** A leather cricket ball with a raised seam and stitching. Reacts to the pointer, scroll and clicks. */
export default function BallScene({ onHit, onFail }) {
  const host = useRef(null);
  const hitRef = useRef(onHit);
  hitRef.current = onHit;

  useEffect(() => {
    const el = host.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch (err) {
      onFail && onFail();
      return;
    }
    const reduced = prefersReducedMotion();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.z = 7;

    // lighting: amber floodlight, cool rim, soft studio reflections
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    scene.environmentIntensity = 0.5;
    const key = new THREE.DirectionalLight(0xffc857, 3.4);
    key.position.set(4, 5, 5);
    const rim = new THREE.DirectionalLight(0x6f8cff, 2.6);
    rim.position.set(-5, 2, -3);
    scene.add(new THREE.AmbientLight(0xffffff, 0.15), key, rim);

    // ball
    const tex = leatherTexture();
    const ballMat = new THREE.MeshPhysicalMaterial({
      map: tex,
      bumpMap: tex,
      bumpScale: 0.025,
      roughness: 0.38,
      clearcoat: 0.7,
      clearcoatRoughness: 0.3,
    });
    const ballGeo = new THREE.SphereGeometry(R, 96, 96);
    const ball = new THREE.Mesh(ballGeo, ballMat);

    const ridgeGeo = new THREE.TorusGeometry(R, 0.035, 16, 240);
    const ridgeMat = new THREE.MeshStandardMaterial({ color: 0x8c0b1c, roughness: 0.5 });
    const ridge = new THREE.Mesh(ridgeGeo, ridgeMat);

    const N = 46;
    const stitchGeo = new THREE.BoxGeometry(0.014, 0.12, 0.014);
    const stitchMat = new THREE.MeshStandardMaterial({ color: 0xf1e4c3, roughness: 0.8 });
    const stitches = new THREE.InstancedMesh(stitchGeo, stitchMat, N * 2);
    const d = new THREE.Object3D();
    let k = 0;
    for (const side of [-1, 1]) {
      for (let i = 0; i < N; i++) {
        const th = (i / N) * Math.PI * 2 + (side > 0 ? 0.5 * ((Math.PI * 2) / N) : 0);
        const z = side * 0.11;
        const rr = Math.sqrt(R * R - z * z);
        d.position.set(rr * Math.cos(th), rr * Math.sin(th), z).multiplyScalar((R + 0.006) / R);
        d.up.set(0, 0, 1);
        d.lookAt(d.position.x * 2, d.position.y * 2, d.position.z * 2);
        d.rotateZ(side * 0.55);
        d.updateMatrix();
        stitches.setMatrixAt(k++, d.matrix);
      }
    }

    const body = new THREE.Group();
    body.add(ball, ridge, stitches);
    body.rotation.set(0.9, 0, 0.3);
    const spinner = new THREE.Group();
    spinner.add(body);
    const pivot = new THREE.Group();
    pivot.add(spinner);
    scene.add(pivot);

    // dust drifting through the floodlight
    const COUNT = 700;
    const pos = new Float32Array(COUNT * 3);
    const speed = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
      speed[i] = 0.05 + Math.random() * 0.18;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xffd98a,
      size: 0.035,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    // layout: ball on the right for wide screens, above the text on phones
    const base = { x: 0, y: 0 };
    const layout = () => {
      const w = el.clientWidth || 1;
      const h = el.clientHeight || 1;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = "100%";
      renderer.domElement.style.height = "100%";
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const vh = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      const vw = vh * camera.aspect;
           let target;
      if (camera.aspect < 0.9) {
        // phones: smaller ball above the text
        target = Math.min(vw * 0.5, vh * 0.3);
        base.x = 0;
        base.y = vh * 0.22;
      } else {
        // desktop: ball takes about half the hero height
        target = vh * 0.5;
        base.x = vw * 0.22;
        base.y = vh * 0.04;
      }
      pivot.scale.setScalar(target / (R * 2));
    };
    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);

    // input
    const pointer = { x: 0, y: 0 };
    const onMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let impulse = 0;
    const onDown = (e) => {
      const r = renderer.domElement.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      if (ray.intersectObject(ball).length) {
        impulse = 16;
        hitRef.current && hitRef.current();
      }
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerdown", onDown);

    let visible = true;
    const io = new IntersectionObserver(([en]) => (visible = en.isIntersecting));
    io.observe(el);

    const tilt = { x: 0, y: 0 };
    let last = performance.now();
    let raf;
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const scroll = Math.min(1, window.scrollY / window.innerHeight);

      impulse *= Math.pow(0.04, dt);
      spinner.rotation.y += dt * ((reduced ? 0.05 : 0.3) + impulse);
      tilt.x += (pointer.y * 0.35 - tilt.x) * 0.06;
      tilt.y += (pointer.x * 0.5 - tilt.y) * 0.06;
      pivot.rotation.x = tilt.x + scroll * 2.4;
      pivot.rotation.y = tilt.y;
      pivot.position.x = base.x + pointer.x * 0.12;
      pivot.position.y = base.y - pointer.y * 0.08 - scroll * 1.4;

      if (!reduced) {
        const a = dustGeo.attributes.position;
        for (let i = 0; i < COUNT; i++) {
          let y = a.getY(i) + speed[i] * dt;
          if (y > 4) y = -4;
          a.setY(i, y);
        }
        a.needsUpdate = true;
      }
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      [ballGeo, ridgeGeo, stitchGeo, dustGeo].forEach((g) => g.dispose());
      [ballMat, ridgeMat, stitchMat, dustMat].forEach((m) => m.dispose());
      tex.dispose();
      envTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) el.removeChild(renderer.domElement);
    };
  }, [onFail]);

  return <div className="ball-host" ref={host} />;
}
