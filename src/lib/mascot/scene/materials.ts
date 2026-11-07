import {
  CanvasTexture,
  DoubleSide,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SRGBColorSpace,
} from "three"

/**
 * Najm's colors (DESIGN.md: Mascot). His fur is a deeper shade of the store's blue, so it keeps its color under
 * the lights, with a glossy coat like a vinyl toy. The rim of his basket is the store's blue itself (primary),
 * and its wheels and handle the gray of secondary text (muted-foreground).
 */
const COLORS = {
  fur: 0x3572f5,
  belly: 0x4d88ff,
  dark: 0x11172b,
  mouth: 0x1a1f3d,
  earInside: 0xff7fa8,
  tongue: 0xff5f8d,
  eyeWhite: 0xffffff,
  gold: 0xf6c343,
  metal: 0xa3adbf,
  basket: 0x334264,
  rim: 0x4f8cff,
}

/**
 * The soft round shadow under Najm and his cart, drawn once on a small canvas: it fades to nothing
 * before its edge, so he has no background or platform that could cover the page.
 */
function shadowTexture() {
  const canvas = document.createElement("canvas")
  canvas.width = 128
  canvas.height = 128
  const context = canvas.getContext("2d")
  if (context) {
    const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, "rgba(0, 0, 0, 0.45)")
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
    context.fillStyle = gradient
    context.fillRect(0, 0, 128, 128)
  }
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  return texture
}

const glossy = (color: number) =>
  new MeshPhysicalMaterial({
    color,
    roughness: 0.42,
    clearcoat: 0.6,
    clearcoatRoughness: 0.35,
  })

const matte = (color: number, roughness: number, metalness = 0) =>
  new MeshStandardMaterial({ color, roughness, metalness })

/** All the materials of the scene, created once and shared by its parts. */
export function createMaterials() {
  const basket = matte(COLORS.basket, 0.5, 0.3)
  basket.side = DoubleSide
  return {
    fur: glossy(COLORS.fur),
    belly: glossy(COLORS.belly),
    /** The nose, the pupils, the collar and the wheels */
    dark: matte(COLORS.dark, 0.35),
    mouth: matte(COLORS.mouth, 0.8),
    earInside: matte(COLORS.earInside, 0.6),
    tongue: matte(COLORS.tongue, 0.5),
    eyeWhite: matte(COLORS.eyeWhite, 0.25),
    gold: matte(COLORS.gold, 0.28, 0.85),
    metal: matte(COLORS.metal, 0.4, 0.5),
    basket,
    rim: matte(COLORS.rim, 0.4),
    shadow: new MeshBasicMaterial({
      map: shadowTexture(),
      transparent: true,
      depthWrite: false,
    }),
  }
}

export type MascotMaterials = ReturnType<typeof createMaterials>
