import * as THREE from 'three'
import { GLTFLoader, type GLTF } from 'three-stdlib'
import { Buffer } from 'buffer'

const ANIMS = require('../../assets/animations.json') as { name: string; base64: string }[]

let decoded: { name: string; clips: THREE.AnimationClip[] }[] | null = null

function decodeBase64(base64: string): Promise<THREE.AnimationClip[]> {
  return new Promise((resolve, reject) => {
    const commaIdx = base64.indexOf(',')
    const raw = commaIdx !== -1 ? base64.slice(commaIdx + 1) : base64
    const binaryStr = Buffer.from(raw, 'base64').toString('binary')
    const bytes = new Uint8Array(binaryStr.length)
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i)
    }
    new GLTFLoader().parse(bytes.buffer, '', (gltf) => resolve(gltf.animations), reject)
  })
}

async function getEntries(): Promise<{ name: string; clips: THREE.AnimationClip[] }[]> {
  if (decoded) return decoded
  const entries: { name: string; clips: THREE.AnimationClip[] }[] = []
  for (const item of ANIMS) {
    try {
      const clips = await decodeBase64(item.base64)
      entries.push({ name: item.name, clips })
    } catch {
      entries.push({ name: item.name, clips: [] })
    }
  }
  decoded = entries
  return entries
}

export async function getAnimationClipsByName(names: string[]): Promise<THREE.AnimationClip[]> {
  const entries = await getEntries()
  const result: THREE.AnimationClip[] = []
  for (const name of names) {
    const entry = entries.find((e) => e.name === name)
    if (entry) {
      for (const clip of entry.clips) {
        const clone = clip.clone()
        clone.name = name
        result.push(clone)
      }
    }
  }
  return result
}
