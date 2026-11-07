import {
  CapsuleGeometry,
  ConeGeometry,
  ExtrudeGeometry,
  Group,
  Mesh,
  Object3D,
  Shape,
  SphereGeometry,
  TorusGeometry,
  Vector3,
  type BufferGeometry,
  type Material,
} from "three"

import type { MascotMaterials } from "@/lib/mascot/scene/materials"
import { armPose, SIDES, type Side } from "@/lib/mascot/scene/poses"

type Triple = readonly [number, number, number]

/** The parts of Najm that move. Everything is built from simple shapes, so there is no model file to download. */
export type DogRig = {
  root: Group
  body: Mesh
  /** Turns the head toward what he looks at */
  neck: Group
  eyes: { eye: Group; pupil: Mesh }[]
  ears: { ear: Group; side: Side }[]
  arms: { arm: Group; side: Side }[]
  tail: Group
  tongue: Mesh
  /** Where a product sits while he holds it */
  hands: Object3D
}

function part(
  geometry: BufferGeometry,
  material: Material,
  position: Triple = [0, 0, 0],
  scale: Triple = [1, 1, 1]
) {
  const mesh = new Mesh(geometry, material)
  mesh.position.set(...position)
  mesh.scale.set(...scale)
  return mesh
}

const sphere = (radius: number) => new SphereGeometry(radius, 32, 20)

/** The gold heart on his collar. */
function heartGeometry() {
  const shape = new Shape()
  shape.moveTo(5, 5)
  shape.bezierCurveTo(5, 5, 4, 0, 0, 0)
  shape.bezierCurveTo(-6, 0, -6, 7, -6, 7)
  shape.bezierCurveTo(-6, 11, -3, 15.4, 5, 19)
  shape.bezierCurveTo(12, 15.4, 16, 11, 16, 7)
  shape.bezierCurveTo(16, 7, 16, 0, 10, 0)
  shape.bezierCurveTo(7, 0, 5, 5, 5, 5)
  const geometry = new ExtrudeGeometry(shape, {
    depth: 3,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 3,
  })
  geometry.center()
  geometry.rotateZ(Math.PI)
  geometry.scale(0.011, 0.011, 0.011)
  return geometry
}

function buildHead(materials: MascotMaterials) {
  const head = new Group()
  head.position.set(0, 0.5, 0.02)
  head.add(part(sphere(0.62), materials.fur, [0, 0, 0], [1, 0.92, 0.95]))
  // The muzzle, the nose and the open mouth
  head.add(
    part(sphere(0.36), materials.fur, [0, -0.17, 0.4], [1.15, 0.78, 0.85])
  )
  head.add(
    part(sphere(0.12), materials.dark, [0, -0.03, 0.72], [1.25, 0.85, 0.9])
  )
  head.add(
    part(sphere(0.16), materials.mouth, [0, -0.36, 0.58], [1.3, 0.42, 0.5])
  )
  const tongue = part(
    new CapsuleGeometry(0.085, 0.16, 8, 16),
    materials.tongue,
    [0.04, -0.46, 0.66]
  )
  tongue.rotation.set(1.25, 0, -0.15)
  head.add(tongue)

  const eyes = SIDES.map((side) => {
    const eye = new Group()
    eye.position.set(side * 0.24, 0.1, 0.47)
    eye.add(part(sphere(0.15), materials.eyeWhite, [0, 0, 0], [1, 1.1, 0.85]))
    const pupil = part(sphere(0.075), materials.dark, [0, 0, 0.11])
    eye.add(pupil)
    // The small shine in each eye
    eye.add(
      part(sphere(0.028), materials.eyeWhite, [-side * 0.02, 0.035, 0.168])
    )
    head.add(eye)
    return { eye, pupil }
  })

  const ears = SIDES.map((side) => {
    const ear = new Group()
    ear.position.set(side * 0.4, 0.46, -0.06)
    ear.rotation.set(-0.15, 0, -side * 0.6)
    ear.add(part(new ConeGeometry(0.19, 0.5, 20), materials.fur, [0, 0.2, 0]))
    ear.add(
      part(
        new ConeGeometry(0.105, 0.3, 16),
        materials.earInside,
        [0, 0.17, 0.075]
      )
    )
    head.add(ear)
    return { ear, side }
  })

  // Three tufts of fur between the ears, each leaning its own way
  const tufts = [
    { x: 0, height: 0.3, forward: -0.5, sideways: 0.05 },
    { x: -0.12, height: 0.22, forward: -0.9, sideways: 0.35 },
    { x: 0.1, height: 0.2, forward: 0.1, sideways: -0.3 },
  ]
  for (const { x, height, forward, sideways } of tufts) {
    const tuft = part(new ConeGeometry(0.07, height, 12), materials.fur, [
      x,
      0.56 + height * 0.3,
      0.02,
    ])
    tuft.rotation.set(forward, 0, sideways)
    head.add(tuft)
  }

  return { head, tongue, eyes, ears }
}

/** Builds Najm: a small round blue dog with a big head, pointy ears, his tongue out and a gold heart on his collar. */
export function buildDog(materials: MascotMaterials): DogRig {
  const root = new Group()

  const body = part(sphere(0.52), materials.fur, [0, 0.72, 0], [1, 1.1, 0.88])
  root.add(body)
  root.add(
    part(sphere(0.36), materials.belly, [0, 0.64, 0.26], [0.92, 1.05, 0.55])
  )

  for (const side of SIDES) {
    const leg = new Group()
    leg.position.set(side * 0.23, 0.36, 0)
    leg.add(
      part(new CapsuleGeometry(0.13, 0.14, 8, 16), materials.fur, [0, -0.12, 0])
    )
    leg.add(
      part(sphere(0.19), materials.fur, [0, -0.27, 0.09], [1.05, 0.55, 1.4])
    )
    root.add(leg)
  }

  const arms = SIDES.map((side) => {
    const arm = new Group()
    arm.position.set(side * 0.47, 1.0, 0.04)
    arm.add(
      part(new CapsuleGeometry(0.11, 0.26, 8, 16), materials.fur, [0, -0.2, 0])
    )
    arm.add(
      part(sphere(0.15), materials.fur, [0, -0.42, 0.02], [1.05, 0.9, 1.1])
    )
    arm.quaternion.copy(armPose("rest", side))
    root.add(arm)
    return { arm, side }
  })

  const neck = new Group()
  neck.position.set(0, 1.18, 0.04)
  // Turn left and right first, then up and down, like a real head
  neck.rotation.order = "YXZ"
  root.add(neck)
  const { head, tongue, eyes, ears } = buildHead(materials)
  neck.add(head)

  const collar = part(
    new TorusGeometry(0.36, 0.055, 12, 40),
    materials.dark,
    [0, 1.2, 0.03]
  )
  collar.rotation.x = Math.PI / 2
  root.add(collar)
  root.add(part(heartGeometry(), materials.gold, [0, 1.03, 0.4]))

  const tail = new Group()
  tail.position.set(0, 0.6, -0.44)
  const tailDirection = new Vector3(0, 0.75, -1).normalize()
  const tailCone = part(new ConeGeometry(0.11, 0.5, 16), materials.fur)
  tailCone.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), tailDirection)
  tailCone.position.copy(tailDirection).multiplyScalar(0.22)
  tail.add(tailCone)
  root.add(tail)

  const hands = new Object3D()
  hands.position.set(0, 0.9, 0.5)
  root.add(hands)

  return { root, body, neck, eyes, ears, arms, tail, tongue, hands }
}
