import {
  Group,
  LatheGeometry,
  Mesh,
  Object3D,
  TorusGeometry,
  Vector2,
} from "three"

import type { MascotMaterials } from "@/lib/mascot/scene/materials"

/** Najm's little shopping cart. */
export type CartRig = {
  root: Group
  /** The middle of the basket's opening, where products are thrown */
  drop: Object3D
  /** The products in the basket */
  items: Group
}

/** Builds the cart: a round basket on four wheels, with a blue rim and a handle at the back. */
export function buildCart(materials: MascotMaterials): CartRig {
  const root = new Group()

  // The basket's side, turned around its axis: a cone that widens toward the top
  const profile = [new Vector2(0, 0.22)]
  for (let step = 0; step <= 6; step++) {
    profile.push(
      new Vector2(0.32 + 0.16 * (step / 6), 0.22 + 0.46 * (step / 6))
    )
  }
  root.add(new Mesh(new LatheGeometry(profile, 40), materials.basket))

  const rim = new Mesh(new TorusGeometry(0.48, 0.03, 10, 48), materials.rim)
  rim.position.y = 0.68
  rim.rotation.x = Math.PI / 2
  root.add(rim)

  const handle = new Mesh(
    new TorusGeometry(0.2, 0.025, 8, 24, Math.PI),
    materials.metal
  )
  handle.position.set(0, 0.7, -0.44)
  root.add(handle)

  for (const x of [-1, 1]) {
    for (const z of [-1, 1]) {
      const wheel = new Mesh(
        new TorusGeometry(0.06, 0.03, 8, 20),
        materials.metal
      )
      wheel.position.set(x * 0.22, 0.07, z * 0.22)
      wheel.rotation.y = Math.PI / 2
      root.add(wheel)
    }
  }

  const drop = new Object3D()
  drop.position.y = 0.68
  root.add(drop)

  const items = new Group()
  root.add(items)

  return { root, drop, items }
}
