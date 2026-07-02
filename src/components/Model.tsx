import * as THREE from 'three';
import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei/native';

type GLTFResult = {
  scene: THREE.Group;
  scenes: THREE.Group[];
  animations: THREE.AnimationClip[];
  nodes: Record<string, THREE.Object3D>;
  materials: Record<string, THREE.Material>;
};

export function Model() {
  const gltf = useGLTF(require('../../assets/chullov1.1-transformed.glb'), false, false) as unknown as GLTFResult;

  const mat = useMemo(() => {
    const m = new THREE.MeshBasicMaterial({
      vertexColors: true,
      flatShading: true,
      side: THREE.DoubleSide,
    } as any);
    (m as any).skinning = true;
    return m;
  }, []);

  React.useEffect(() => {
    gltf.scene.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        (child as THREE.Mesh).material = mat;
      }
    });
  }, [gltf.scene, mat]);

  return <primitive object={gltf.scene} />;
}
