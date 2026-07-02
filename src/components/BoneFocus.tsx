import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { useThree } from '@react-three/fiber/native';
import * as THREE from 'three';

interface OrbitControlsLike {
  target: THREE.Vector3;
  update: () => void;
}

export interface BoneFocusHandle {
  focusOn: (name: string, distance?: number) => void;
}

const BoneFocus = forwardRef<BoneFocusHandle>((_props, ref) => {
  const { scene, controls, camera } = useThree();
  const bonesRef = useRef<Map<string, THREE.Object3D>>(new Map());

  useEffect(() => {
    const map = new Map<string, THREE.Object3D>();
    scene.traverse((child) => {
      if ((child as THREE.Bone).isBone) {
        map.set(child.name, child);
      }
    });
    bonesRef.current = map;
  }, [scene]);

  useImperativeHandle(ref, () => ({
    focusOn: (name: string, distance: number = 5) => {
      const bone = bonesRef.current.get(name);
      if (!bone || !controls || !camera) return;

      const oc = controls as unknown as OrbitControlsLike;
      const targetPos = new THREE.Vector3();

      bone.getWorldPosition(targetPos);
      oc.target.copy(targetPos);

      camera.position.set(
        targetPos.x,
        targetPos.y + 3,
        targetPos.z + distance
      );

      oc.update();
    }
  }));

  return null;
});

export default BoneFocus;