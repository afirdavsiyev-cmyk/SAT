import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import fs from 'fs';
import path from 'path';

global.FileReader = class FileReader {
  constructor() {
    this.onload = null;
    this.onloadend = null;
    this.result = null;
  }
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buf) => {
      this.result = buf;
      if (this.onload) this.onload({ target: this });
      if (this.onloadend) this.onloadend({ target: this });
    });
  }
};

function createCurvedBladeGeometry() {
  const numStations = 14;
  const numPoints = 10;
  const positions = [];
  const indices = [];
  const uvs = [];

  for (let s = 0; s < numStations; s++) {
    const u = s / (numStations - 1);
    const r = 0.10 + u * 0.78;
    const chord = (0.11 + Math.sin(u * Math.PI) * 0.065) * (1.0 - u * 0.32);
    const twist = (26 - u * 15) * (Math.PI / 180);
    const cosT = Math.cos(twist);
    const sinT = Math.sin(twist);
    const sweep = Math.pow(u, 1.9) * 0.12;
    const rise = Math.pow(u, 2.5) * 0.028;

    for (let p = 0; p < numPoints; p++) {
      const v = p / (numPoints - 1);
      const thickness = 0.024 * (1.0 - u * 0.5);
      let x0, camber;

      if (v <= 0.5) {
        const t = v * 2;
        x0 = (t - 0.5) * chord;
        camber = Math.sin(t * Math.PI) * thickness;
      } else {
        const t = (v - 0.5) * 2;
        x0 = (0.5 - t) * chord;
        camber = -Math.sin(t * Math.PI) * (thickness * 0.2);
      }

      const rx = x0 * cosT - camber * sinT;
      const ry = x0 * sinT + camber * cosT + rise;
      const rz = r - sweep;

      positions.push(rx, ry, rz);
      uvs.push(u, v);
    }
  }

  for (let s = 0; s < numStations - 1; s++) {
    for (let p = 0; p < numPoints - 1; p++) {
      const a = s * numPoints + p;
      const b = (s + 1) * numPoints + p;
      const c = (s + 1) * numPoints + (p + 1);
      const d = s * numPoints + (p + 1);
      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

console.log('Building Realistic High-Quality FPV Racing Drone Model...');

const drone = new THREE.Group();
drone.name = 'Realistic_FPV_Racing_Drone';

// Materials matching photos
const matCarbon = new THREE.MeshStandardMaterial({ name: 'Mat_Carbon', color: 0x141822, roughness: 0.6, metalness: 0.35 });
const matCanopy = new THREE.MeshPhysicalMaterial({ name: 'Mat_Canopy', color: 0xffffff, transmission: 0.92, roughness: 0.18, ior: 1.52, thickness: 0.5, clearcoat: 1.0 });
const matEmerald = new THREE.MeshStandardMaterial({ name: 'Mat_MotorEndplate', color: 0x10b981, metalness: 0.92, roughness: 0.28 });
const matTitanium = new THREE.MeshStandardMaterial({ name: 'Mat_Titanium', color: 0x334155, metalness: 0.9, roughness: 0.2 });
const matCopper = new THREE.MeshStandardMaterial({ name: 'Mat_Copper', color: 0xd97706, emissive: 0x10b981, emissiveIntensity: 0.08, metalness: 0.95, roughness: 0.22 });
const matChrome = new THREE.MeshStandardMaterial({ name: 'Mat_Chrome', color: 0xf1f5f9, metalness: 0.98, roughness: 0.08 });
const matProp = new THREE.MeshPhysicalMaterial({ name: 'Mat_Prop', color: 0xa7f3d0, transmission: 0.82, roughness: 0.14, ior: 1.5, transparent: true, opacity: 0.78 });
const matPCB = new THREE.MeshStandardMaterial({ name: 'Mat_PCB', color: 0x064e3b, roughness: 0.5 });
const matChip = new THREE.MeshStandardMaterial({ name: 'Mat_Chip', color: 0x0a0f1d, roughness: 0.35, metalness: 0.3 });

// 1. Bottom Chassis
const chassisGroup = new THREE.Group();
chassisGroup.name = 'ChassisGroup';
drone.add(chassisGroup);

const baseCenter = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.045, 1.7), matCarbon);
baseCenter.name = 'Bottom_Frame_Carbon';
baseCenter.position.set(0, -0.04, 0);
chassisGroup.add(baseCenter);

const armEndpoints = [
  { name: 'FL', x: -1.35, z: 1.10, rootX: -0.22, rootZ: 0.35 },
  { name: 'FR', x: 1.35, z: 1.10, rootX: 0.22, rootZ: 0.35, isFeatured: true },
  { name: 'RL', x: -1.35, z: -1.10, rootX: -0.22, rootZ: -0.35 },
  { name: 'RR', x: 1.35, z: -1.10, rootX: 0.22, rootZ: -0.35 },
];

armEndpoints.forEach((pt) => {
  const dx = pt.x - pt.rootX;
  const dz = pt.z - pt.rootZ;
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dx, dz);

  const armMesh = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.045, length), matCarbon);
  armMesh.name = `Arm_${pt.name}_Carbon`;
  armMesh.position.set((pt.x + pt.rootX) * 0.5, -0.04, (pt.z + pt.rootZ) * 0.5);
  armMesh.rotation.y = angle;
  chassisGroup.add(armMesh);

  const pad = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.27, 0.045, 32), matCarbon);
  pad.name = `MotorPad_${pt.name}_Carbon`;
  pad.position.set(pt.x, -0.04, pt.z);
  chassisGroup.add(pad);

  // Wires along arm
  for (let w = -1; w <= 1; w++) {
    const wire = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, length * 0.95, 8), matChip);
    wire.position.set((pt.x + pt.rootX) * 0.5 + Math.cos(angle) * (w * 0.035), -0.015, (pt.z + pt.rootZ) * 0.5 - Math.sin(angle) * (w * 0.035));
    wire.rotation.y = angle;
    wire.rotation.x = Math.PI / 2;
    chassisGroup.add(wire);
  }
});

// 2. Electronics Stack
const escBoard = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.025, 0.56), matPCB);
escBoard.name = 'ESC_Board';
escBoard.position.set(0, 0.04, 0);
chassisGroup.add(escBoard);

const fcBoard = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.025, 0.52), matPCB);
fcBoard.name = 'FC_Board';
fcBoard.position.set(0, 0.14, 0);
chassisGroup.add(fcBoard);

const mcu = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.025, 0.22), matChip);
mcu.name = 'MCU_Chip';
mcu.position.set(0, 0.165, 0);
chassisGroup.add(mcu);

// 3. Front Camera Bracket & Lens
const camBracketL = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.28, 0.24), matCarbon);
camBracketL.position.set(-0.16, 0.14, 0.76);
chassisGroup.add(camBracketL);

const camBracketR = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.28, 0.24), matCarbon);
camBracketR.position.set(0.16, 0.14, 0.76);
chassisGroup.add(camBracketR);

const camBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.14, 28), matEmerald);
camBarrel.name = 'Camera_Barrel_MotorEndplate';
camBarrel.rotation.x = Math.PI / 2 - 0.35;
camBarrel.position.set(0, 0.15, 0.78);
chassisGroup.add(camBarrel);

// 4. Standoffs
const standoffGeo = new THREE.CylinderGeometry(0.032, 0.032, 0.32, 16);
const standoffPos = [
  [-0.30, 0.14, 0.45], [0.30, 0.14, 0.45],
  [-0.30, 0.14, -0.45], [0.30, 0.14, -0.45],
  [-0.16, 0.14, 0.86], [0.16, 0.14, 0.86],
];
standoffPos.forEach(([x, y, z], i) => {
  const st = new THREE.Mesh(standoffGeo, matEmerald);
  st.name = `Standoff_${i}_MotorEndplate`;
  st.position.set(x, y, z);
  chassisGroup.add(st);
});

// 5. Top Carbon Plate (Separates in Stage 2)
const topPlate = new THREE.Mesh(new THREE.BoxGeometry(0.64, 0.032, 1.5), matCarbon);
topPlate.name = 'Upper_Frame';
topPlate.position.set(0, 0.32, 0);
drone.add(topPlate);

// 6. Smoked Frosted Glass Canopy (Separates in Stage 2)
const canopyGroup = new THREE.Group();
canopyGroup.name = 'Canopy';
canopyGroup.position.set(0, 0.40, 0);

const canopyGeo = new THREE.SphereGeometry(0.62, 48, 32);
canopyGeo.scale(0.85, 0.46, 1.35);
const canopyMesh = new THREE.Mesh(canopyGeo, matCanopy);
canopyMesh.name = 'Canopy_Glass';
canopyMesh.position.set(0, 0.08, -0.05);
canopyGroup.add(canopyMesh);

const antL = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 12), matChip);
antL.position.set(-0.12, 0.22, -0.65);
antL.rotation.x = -0.4;
antL.rotation.z = -0.2;
canopyGroup.add(antL);

const antR = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.32, 12), matChip);
antR.position.set(0.12, 0.22, -0.65);
antR.rotation.x = -0.4;
antR.rotation.z = 0.2;
canopyGroup.add(antR);

drone.add(canopyGroup);

// 7. 4 Brushless Motors & Propellers
const bladeGeo = createCurvedBladeGeometry();

armEndpoints.forEach((pt) => {
  const motorRoot = new THREE.Group();
  motorRoot.name = `MotorRoot_${pt.name}`;
  motorRoot.position.set(pt.x, 0, pt.z);

  const baseMount = new THREE.Group();
  baseMount.name = `BaseMount_${pt.name}_MotorEndplate`;
  const baseDisk = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.26, 0.04, 32), matEmerald);
  baseMount.add(baseDisk);

  for (let s = 0; s < 4; s++) {
    const angle = (s * Math.PI) / 2 + Math.PI / 4;
    const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.055, 12), matChrome);
    screw.position.set(Math.cos(angle) * 0.16, 0.025, Math.sin(angle) * 0.16);
    baseMount.add(screw);
  }
  motorRoot.add(baseMount);

  if (pt.isFeatured) {
    const lowerBearing = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.018, 16, 32), matChrome);
    lowerBearing.name = 'LowerBearing_FR';
    lowerBearing.rotation.x = Math.PI / 2;
    lowerBearing.position.set(0, 0.07, 0);
    motorRoot.add(lowerBearing);

    const stator = new THREE.Group();
    stator.name = 'Stator_FR';
    const statorCore = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.16, 36), matChip);
    statorCore.position.set(0, 0.14, 0);
    stator.add(statorCore);

    const coilGeo = new THREE.CylinderGeometry(0.038, 0.038, 0.16, 16);
    for (let c = 0; c < 12; c++) {
      const theta = (c * Math.PI * 2) / 12;
      const coil = new THREE.Mesh(coilGeo, matCopper);
      coil.position.set(Math.cos(theta) * 0.125, 0.14, Math.sin(theta) * 0.125);
      coil.rotation.z = Math.PI / 2;
      coil.rotation.y = -theta;
      stator.add(coil);
    }
    motorRoot.add(stator);

    const upperBearing = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.018, 16, 32), matChrome);
    upperBearing.name = 'UpperBearing_FR';
    upperBearing.rotation.x = Math.PI / 2;
    upperBearing.position.set(0, 0.22, 0);
    motorRoot.add(upperBearing);

    const rotorBell = new THREE.Group();
    rotorBell.name = 'RotorBell_FR';

    const bellWall = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.22, 36, 1, true), matTitanium);
    bellWall.position.set(0, 0.32, 0);
    rotorBell.add(bellWall);

    const bellCap = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.03, 36), matTitanium);
    bellCap.position.set(0, 0.43, 0);
    rotorBell.add(bellCap);

    const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.85, 24), matChrome);
    shaft.name = 'Shaft_FR';
    shaft.position.set(0, 0.45, 0);
    rotorBell.add(shaft);
    motorRoot.add(rotorBell);

    const propGroup = new THREE.Group();
    propGroup.name = 'Propeller_FR';
    propGroup.position.set(0, 0.48, 0);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.06, 24), matCarbon);
    propGroup.add(hub);

    const nut = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.085, 6), matEmerald);
    nut.name = 'Nut_FR_MotorEndplate';
    nut.position.set(0, 0.05, 0);
    propGroup.add(nut);

    for (let b = 0; b < 3; b++) {
      const blade = new THREE.Mesh(bladeGeo, matProp);
      blade.rotation.y = (b * Math.PI * 2) / 3;
      propGroup.add(blade);
    }
    motorRoot.add(propGroup);
  } else {
    const stdStator = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.16, 24), matCopper);
    stdStator.position.set(0, 0.12, 0);
    motorRoot.add(stdStator);

    const stdBell = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.22, 28), matTitanium);
    stdBell.position.set(0, 0.24, 0);
    motorRoot.add(stdBell);

    const stdRing = new THREE.Mesh(new THREE.CylinderGeometry(0.245, 0.245, 0.03, 28), matEmerald);
    stdRing.name = `Ring_${pt.name}_MotorEndplate`;
    stdRing.position.set(0, 0.32, 0);
    motorRoot.add(stdRing);

    const propGroup = new THREE.Group();
    propGroup.name = `Propeller_${pt.name}`;
    propGroup.position.set(0, 0.36, 0);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.06, 20), matCarbon);
    propGroup.add(hub);

    const nut = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.085, 6), matEmerald);
    nut.position.set(0, 0.05, 0);
    propGroup.add(nut);

    for (let b = 0; b < 3; b++) {
      const blade = new THREE.Mesh(bladeGeo, matProp);
      blade.rotation.y = (b * Math.PI * 2) / 3;
      propGroup.add(blade);
    }
    motorRoot.add(propGroup);
  }

  drone.add(motorRoot);
});

const exporter = new GLTFExporter();
const exportScene = new THREE.Scene();
exportScene.add(drone);

console.log('Exporting glTF 2.0 Binary (.glb)...');

await new Promise((resolve, reject) => {
  exporter.parse(
    exportScene,
    (gltf) => {
      const buffer = Buffer.from(gltf);
      const outPath1 = path.join('public', 'assets', 'realistic-FPV-racing-drone.glb');
      const outPath2 = path.join('public', 'assets', 'drone.glb');
      fs.writeFileSync(outPath1, buffer);
      fs.writeFileSync(outPath2, buffer);
      console.log(`Successfully generated:\n - ${outPath1} (${(buffer.length / 1024).toFixed(1)} KB)\n - ${outPath2}`);
      resolve();
    },
    (err) => {
      console.error('Error during GLTF export:', err);
      reject(err);
    },
    { binary: true }
  );
});
