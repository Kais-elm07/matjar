import { Quaternion, Vector3 } from "three"

/** Which arm: 1 is Najm's left arm (on the viewer's right), -1 his right arm. */
export type Side = 1 | -1

export const SIDES: readonly Side[] = [-1, 1]

export type ArmPose =
  "rest" | "reach" | "hold" | "toss" | "cheer" | "wave-high" | "wave-low"

const DOWN = new Vector3(0, -1, 0)

/** The rotation that points an arm from the shoulder toward (x: sideways, y: up, z: forward). */
function pointArm(x: number, y: number, z: number) {
  return new Quaternion().setFromUnitVectors(
    DOWN,
    new Vector3(x, y, z).normalize()
  )
}

const POSES: Record<ArmPose, (side: Side) => Quaternion> = {
  /** Hanging by his sides */
  rest: (side) => pointArm(side * 0.32, -1, 0.12),
  /** Stretched forward to catch */
  reach: (side) => pointArm(side * 0.15, -0.1, 1),
  /** Both paws together in front of his chest */
  hold: (side) => pointArm(-side * 0.45, -0.25, 0.9),
  /** Raised to throw */
  toss: (side) => pointArm(-side * 0.2, 0.9, 0.6),
  /** Both arms up */
  cheer: (side) => pointArm(side * 0.6, 0.9, 0.2),
  "wave-high": (side) => pointArm(side * 0.95, 0.9, 0.25),
  "wave-low": (side) => pointArm(side * 0.55, 0.9, 0.25),
}

/** The rotation of one arm in a pose. */
export function armPose(pose: ArmPose, side: Side) {
  return POSES[pose](side)
}
