import {
  ACESFilmicToneMapping,
  CircleGeometry,
  DirectionalLight,
  HemisphereLight,
  MathUtils,
  Mesh,
  PerspectiveCamera,
  Scene,
  Sprite,
  SpriteMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  WebGLRenderer,
  type Object3D,
  type Quaternion,
  type Texture,
} from "three"

import type { BasketItem } from "@/modules/mascot/basket"
import { buildCart, type CartRig } from "@/modules/mascot/scene/cart"
import { buildDog, type DogRig } from "@/modules/mascot/scene/dog"
import { flyPhoto } from "@/modules/mascot/scene/flight"
import {
  createMaterials,
  type MascotMaterials,
} from "@/modules/mascot/scene/materials"
import { armPose, type ArmPose } from "@/modules/mascot/scene/poses"
import {
  curve,
  easeIn,
  easeInOut,
  easeOut,
  lerp,
  linear,
  tween,
  type Easing,
} from "@/modules/mascot/scene/tween"

// Where things stand, in the scene's units (Najm is about 2.6 units tall)
const DOG_BESIDE_CART = -0.5
const DOG_ALONE = 0.35
const CART_X = 1.15
/** The height of a product photo in his paws, and in the basket */
const HELD_SIZE = 0.72
const BASKET_SIZE = 0.5
/** The photos drawn in the basket; older products stay in the cart without being drawn */
const BASKET_LIMIT = 6
/** How long Najm stays lively after the visitor moves or he acts, before drawing stops to save battery */
const AWAKE_MS = 4000

const clamp = MathUtils.clamp

/** How much of the remaining distance a smoothed value covers in `seconds` at `speed`. */
const smoothing = (seconds: number, speed: number) =>
  1 - Math.exp(-seconds * speed)

function isOnScreen(rect: DOMRect) {
  return (
    rect.width > 0 &&
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth
  )
}

type LoadedPhoto = { texture: Texture; aspect: number }

/**
 * Najm in 3D (DESIGN.md: Mascot), drawn with three.js on a transparent canvas: no background, no platform,
 * only a soft shadow under him. Every public method is queued, so moves never overlap: a product added while
 * he is still throwing the last one waits its turn.
 *
 * He follows the pointer with his eyes and head, and stays lively for a few seconds after the visitor moves
 * or he acts; then drawing stops until something happens, so an idle page costs no battery. For visitors who
 * asked for reduced motion every move jumps to its end and he doesn't follow the pointer.
 */
export class MascotScene {
  private readonly canvas: HTMLCanvasElement
  private readonly instant: boolean
  private readonly renderer: WebGLRenderer
  private readonly scene = new Scene()
  private readonly camera = new PerspectiveCamera(30, 1, 0.1, 50)
  private readonly materials: MascotMaterials
  private readonly dog: DogRig
  private readonly cart: CartRig
  private readonly dogShadow: Mesh
  private readonly loader = new TextureLoader()
  private readonly photos = new Map<string, Promise<LoadedPhoto | null>>()
  /** The products in the basket, by SKU, in the order they were added */
  private readonly basket = new Map<string, Sprite>()
  private readonly aspects = new WeakMap<Sprite, number>()
  private readonly cleanups: (() => void)[] = []
  private readonly scratch = new Vector3()

  private queue: Promise<void> = Promise.resolve()
  private disposed = false
  private frame = 0
  private lastFrame = 0
  private awakeUntil = 0
  /** Moves in progress: drawing goes on while there are any */
  private moving = 0
  private cartShown = false
  private armTargets: Quaternion[]

  // Values the drawing loop moves a little toward their targets on every frame
  private time = 0
  private bodyYaw = 0
  private bodyYawTarget = 0
  private dogXTarget = DOG_ALONE
  private hop = 0
  private squash = 1
  private earPerk = 0
  private earTarget = 0
  private happyUntil = 0
  private blinkAt = 2.5
  private blinkEnd = 0
  /** Where the pointer is, in the scene, while it is on the page */
  private pointer: Vector3 | null = null
  /** What he watches during a move (a flying product, the cart), before the pointer */
  private focus: Vector3 | null = null

  private constructor(canvas: HTMLCanvasElement, reducedMotion: boolean) {
    this.canvas = canvas
    this.instant = reducedMotion
    // Throws when the browser can't create a WebGL 2 context: create() returns null then
    this.renderer = new WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.outputColorSpace = SRGBColorSpace
    this.renderer.toneMapping = ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 1.05

    this.camera.position.set(0.35, 1.9, 6.4)
    this.camera.lookAt(0.35, 1.15, 0)
    this.addLights()

    this.materials = createMaterials()
    this.dog = buildDog(this.materials)
    this.dog.root.position.x = DOG_ALONE
    this.scene.add(this.dog.root)
    this.dogShadow = this.groundShadow(0.62)
    this.dogShadow.position.x = DOG_ALONE
    this.scene.add(this.dogShadow)

    this.cart = buildCart(this.materials)
    this.cart.root.position.set(CART_X, 0, -0.05)
    this.cart.root.add(this.groundShadow(0.55))
    // The cart starts hidden: each page shows it or not (showCart)
    this.cart.root.scale.setScalar(0.001)
    this.cart.root.visible = false
    this.scene.add(this.cart.root)

    this.armTargets = this.dog.arms.map(({ side }) => armPose("rest", side))
    this.listen()
    this.resize()
  }

  /** Najm on the canvas, or null when the browser can't draw him. */
  static create(
    canvas: HTMLCanvasElement,
    options: { reducedMotion: boolean }
  ) {
    try {
      return new MascotScene(canvas, options.reducedMotion)
    } catch {
      return null
    }
  }

  /** Shows or hides the cart beside him: he steps aside to make room for it. */
  showCart(visible: boolean) {
    return this.enqueue(() => this.setCartShown(visible))
  }

  /** Puts exactly these products in the basket at once, without a move (after a page change). */
  syncBasket(items: readonly BasketItem[]) {
    return this.enqueue(async () => {
      const wanted = new Set(items.map((item) => item.sku))
      for (const [sku, sprite] of this.basket) {
        if (!wanted.has(sku)) this.dropFromBasket(sku, sprite)
      }
      for (const item of items) await this.putInBasket(item)
      this.layoutBasket()
      this.wake(500)
    })
  }

  /** Waves hello. */
  greet() {
    return this.enqueue(() => this.run(() => this.wave()))
  }

  /**
   * A product was added: its photo flies from the pressed button into his paws, he turns and throws it into
   * the basket, and hops. Without a button on screen, the product appears straight in his paws.
   */
  receive(item: BasketItem, origin: DOMRect | null) {
    return this.enqueue(() =>
      this.run(async () => {
        await this.setCartShown(true)
        if (this.instant) {
          await this.putInBasket(item)
          this.layoutBasket()
          return
        }
        const held = await this.sprite(item.photo, HELD_SIZE)
        if (!held) return

        this.setArms("reach")
        if (origin && isOnScreen(origin)) {
          await flyPhoto({
            photo: item.photo,
            from: origin,
            to: () => this.screenPositionOf(this.dog.hands),
            size: this.canvas.clientHeight * 0.24,
            duration: 650,
            onFrame: (point, progress) => {
              this.focus = this.screenToWorld(point.x, point.y)
              if (progress > 0.5) this.setArms("hold")
            },
          })
        }
        this.setArms("hold")
        this.dog.hands.add(held)
        await this.move(160, easeOut, (value) => {
          this.squash = 1 - 0.1 * Math.sin(value * Math.PI)
        })
        this.squash = 1

        // He turns to the cart and throws the product in, following it with his eyes
        const drop = this.cart.drop.getWorldPosition(new Vector3())
        this.focus = drop
        this.bodyYawTarget = 1.15
        this.earTarget = 1
        await this.pause(300)
        this.setArms("toss")
        await this.pause(120)
        const from = held.getWorldPosition(new Vector3())
        this.scene.attach(held)
        const to = drop.clone().setY(drop.y + 0.12)
        const peak = Math.max(from.y, to.y) + 0.75
        await this.move(420, linear, (progress) => {
          const value = easeOut(progress)
          held.position.set(
            lerp(from.x, to.x, value),
            curve(from.y, peak, to.y, progress),
            lerp(from.z, to.z, value)
          )
          held.material.rotation = progress * 1.2
          this.resizeSprite(held, lerp(HELD_SIZE, BASKET_SIZE, progress))
          this.focus = held.position
        })
        this.scene.remove(held)
        held.material.dispose()
        await this.putInBasket(item)
        this.layoutBasket()

        // A happy hop, and the cart bounces as the product lands
        this.happyUntil = this.time + 1.8
        this.setArms("rest")
        await Promise.all([
          this.move(260, easeOut, (value) => {
            this.cart.root.scale.setScalar(1 + 0.08 * Math.sin(value * Math.PI))
          }),
          this.move(360, linear, (progress) => {
            this.hop = 0.22 * Math.sin(progress * Math.PI)
          }),
        ])
        this.cart.root.scale.setScalar(1)
        this.hop = 0
        this.bodyYawTarget = 0
        this.earTarget = 0
        this.focus = null
      })
    )
  }

  /** A product was removed: he takes it out of the basket and throws it away. */
  discard(sku: string) {
    return this.enqueue(() =>
      this.run(async () => {
        const sprite = this.basket.get(sku)
        if (!sprite) return
        if (this.instant || !this.cartShown || !sprite.visible) {
          this.dropFromBasket(sku, sprite)
          this.layoutBasket()
          return
        }
        this.basket.delete(sku)
        this.focus = this.cart.drop.getWorldPosition(new Vector3())
        this.bodyYawTarget = 1.15
        this.setArms("reach")
        await this.pause(340)

        const from = sprite.getWorldPosition(new Vector3())
        this.scene.attach(sprite)
        const to = this.dog.hands.getWorldPosition(new Vector3())
        const peak = Math.max(from.y, to.y) + 0.6
        await this.move(400, linear, (progress) => {
          const value = easeOut(progress)
          sprite.position.set(
            lerp(from.x, to.x, value),
            curve(from.y, peak, to.y, progress),
            lerp(from.z, to.z, value)
          )
          this.resizeSprite(sprite, lerp(BASKET_SIZE, HELD_SIZE, progress))
          this.focus = sprite.position
          if (progress > 0.6) this.setArms("hold")
        })
        this.scene.remove(sprite)
        this.dog.hands.add(sprite)
        sprite.position.set(0, 0, 0)
        this.layoutBasket()
        this.focus = null
        this.bodyYawTarget = 0
        await this.pause(360)

        this.setArms("toss")
        await this.move(340, easeIn, (value) => {
          sprite.position.y = value * 1.1
          sprite.material.opacity = 1 - value
          this.resizeSprite(sprite, HELD_SIZE * (1 - 0.5 * value))
        })
        this.dog.hands.remove(sprite)
        sprite.material.dispose()
        this.setArms("rest")
      })
    )
  }

  /** The order was placed: he cheers, the cart rolls off with the order and comes back empty, and he waves. */
  celebrate() {
    return this.enqueue(() =>
      this.run(async () => {
        await this.setCartShown(true)
        const shipped = [...this.basket]
        this.basket.clear()
        const ship = () => {
          for (const [sku, sprite] of shipped) this.dropFromBasket(sku, sprite)
        }
        if (this.instant) {
          ship()
          return
        }
        this.happyUntil = this.time + 4.5
        this.setArms("cheer")
        for (let hop = 0; hop < 3; hop++) {
          await this.move(340, linear, (progress) => {
            this.hop = 0.25 * Math.sin(progress * Math.PI)
          })
        }
        this.hop = 0
        // He watches the cart roll away
        const cart = this.cart.root
        const cartPoint = new Vector3()
        await this.move(650, easeInOut, (value) => {
          cart.position.x = CART_X + 2.8 * value
          this.focus = this.cart.drop.getWorldPosition(cartPoint)
        })
        ship()
        this.focus = null
        this.setArms("rest")
        await this.wave()
        await this.move(550, easeOut, (value) => {
          cart.position.x = CART_X + 2.8 * (1 - value)
        })
        cart.position.x = CART_X
      })
    )
  }

  /** Stops drawing and frees everything the scene holds on the graphics card. */
  dispose() {
    if (this.disposed) return
    this.disposed = true
    this.stop()
    for (const cleanup of this.cleanups) cleanup()
    this.scene.traverse((object) => {
      if (object instanceof Mesh) object.geometry.dispose()
      if (object instanceof Sprite) object.material.dispose()
    })
    for (const material of Object.values(this.materials)) material.dispose()
    this.materials.shadow.map?.dispose()
    for (const loading of this.photos.values()) {
      void loading.then((loaded) => loaded?.texture.dispose())
    }
    this.renderer.dispose()
  }

  // ---------------------------------------------------------------------------
  // Drawing
  // ---------------------------------------------------------------------------

  private addLights() {
    this.scene.add(new HemisphereLight(0xcfe0ff, 0x0b0e14, 1.1))
    const key = new DirectionalLight(0xffffff, 2.2)
    key.position.set(2.5, 5, 3.5)
    // A blue light from behind outlines him against the dark page (DESIGN.md: primary)
    const rim = new DirectionalLight(0x4f8cff, 1.8)
    rim.position.set(-3, 2.5, -3)
    const fill = new DirectionalLight(0x8fb4ff, 0.5)
    fill.position.set(-3, 1, 3)
    this.scene.add(key, rim, fill)
  }

  /** A soft round shadow on the ground, which fades before its edge. */
  private groundShadow(radius: number) {
    const shadow = new Mesh(
      new CircleGeometry(radius, 32),
      this.materials.shadow
    )
    shadow.rotation.x = -Math.PI / 2
    shadow.position.y = 0.005
    return shadow
  }

  private listen() {
    const resizeObserver = new ResizeObserver(() => this.resize())
    resizeObserver.observe(this.canvas)
    this.cleanups.push(() => resizeObserver.disconnect())

    const onVisibilityChange = () => {
      if (document.hidden) this.stop()
      else this.wake()
    }
    document.addEventListener("visibilitychange", onVisibilityChange)
    this.cleanups.push(() =>
      document.removeEventListener("visibilitychange", onVisibilityChange)
    )

    if (this.instant) return
    const onPointerMove = (event: PointerEvent) => {
      this.pointer = this.screenToWorld(event.clientX, event.clientY)
      this.wake()
    }
    // relatedTarget is null when the pointer leaves the window: he looks back at the visitor
    const onPointerOut = (event: PointerEvent) => {
      if (event.relatedTarget !== null) return
      this.pointer = null
      this.wake()
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("pointerout", onPointerOut)
    this.cleanups.push(() => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerout", onPointerOut)
    })
  }

  private resize() {
    const width = this.canvas.clientWidth
    const height = this.canvas.clientHeight
    if (width === 0 || height === 0) return
    this.renderer.setSize(width, height, false)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.render()
  }

  private render() {
    if (!this.disposed) this.renderer.render(this.scene, this.camera)
  }

  /** Keeps drawing for at least `ms` more milliseconds. With reduced motion, draws one still frame. */
  private wake(ms = AWAKE_MS) {
    if (this.disposed) return
    if (this.instant) {
      this.render()
      return
    }
    this.awakeUntil = Math.max(this.awakeUntil, performance.now() + ms)
    if (this.frame === 0 && !document.hidden) {
      this.lastFrame = performance.now()
      this.frame = requestAnimationFrame(this.tick)
    }
  }

  private stop() {
    cancelAnimationFrame(this.frame)
    this.frame = 0
  }

  private readonly tick = (now: number) => {
    const seconds = Math.min((now - this.lastFrame) / 1000, 0.05)
    this.lastFrame = now
    this.update(seconds)
    this.render()
    this.frame =
      this.moving > 0 || now < this.awakeUntil
        ? requestAnimationFrame(this.tick)
        : 0
  }

  /** One frame of life: where he looks, breathing, the tail, blinking, and the smoothed moves. */
  private update(seconds: number) {
    this.time += seconds
    const happy = this.time < this.happyUntil
    const { root, body, neck, eyes, ears, arms, tail, tongue } = this.dog

    // What he looks at: what he is doing, then the pointer, then the visitor
    const target = this.focus ?? this.pointer ?? this.camera.position
    const toTarget = this.scratch.copy(target).sub(root.position)
    if (!this.focus) {
      this.bodyYawTarget = clamp(
        Math.atan2(toTarget.x, toTarget.z) * 0.3,
        -0.5,
        0.5
      )
    }
    this.bodyYaw += (this.bodyYawTarget - this.bodyYaw) * smoothing(seconds, 7)
    root.rotation.y = this.bodyYaw
    root.position.x +=
      (this.dogXTarget - root.position.x) * smoothing(seconds, 6)
    root.position.y = this.hop
    const widen = 1 + (1 - this.squash) * 0.5
    root.scale.set(widen, this.squash, widen)
    this.dogShadow.position.x = root.position.x
    root.updateMatrixWorld()

    const fromNeck = root
      .worldToLocal(this.scratch.copy(target))
      .sub(neck.position)
    const yaw = clamp(Math.atan2(fromNeck.x, fromNeck.z), -0.9, 0.9)
    const pitch = clamp(
      -Math.atan2(fromNeck.y, Math.hypot(fromNeck.x, fromNeck.z)),
      -0.5,
      0.35
    )
    neck.rotation.y += (yaw - neck.rotation.y) * smoothing(seconds, 9)
    neck.rotation.x += (pitch - neck.rotation.x) * smoothing(seconds, 9)
    for (const { pupil } of eyes) {
      pupil.position.x = clamp(neck.rotation.y * 0.06, -0.05, 0.05)
      pupil.position.y = clamp(-neck.rotation.x * 0.05, -0.04, 0.04)
    }

    body.scale.y = 1.1 * (1 + 0.012 * Math.sin(this.time * 2.2))
    neck.position.y = 1.18 + 0.012 * Math.sin(this.time * 2.2 + 0.6)
    tail.rotation.y =
      Math.sin(this.time * (happy ? 16 : 5)) * (happy ? 0.6 : 0.28)
    if (this.time > this.blinkAt) {
      this.blinkEnd = this.time + 0.13
      this.blinkAt = this.time + 2.5 + Math.random() * 4
    }
    const blinking = this.time < this.blinkEnd
    for (const { eye } of eyes) eye.scale.y = blinking ? 0.12 : 1
    this.earPerk +=
      ((happy ? 1 : this.earTarget) - this.earPerk) * smoothing(seconds, 8)
    for (const { ear, side } of ears) {
      ear.rotation.z = -side * (0.6 - 0.3 * this.earPerk)
    }
    tongue.rotation.z = -0.15 + (happy ? Math.sin(this.time * 14) * 0.12 : 0)
    arms.forEach(({ arm }, index) => {
      const pose = this.armTargets[index]
      if (pose) arm.quaternion.slerp(pose, smoothing(seconds, 11))
    })
  }

  /** With reduced motion there is no drawing loop, so the moved parts jump to where they should be. */
  private settle() {
    const { root, arms } = this.dog
    root.position.set(this.dogXTarget, 0, 0)
    root.rotation.y = 0
    this.dogShadow.position.x = this.dogXTarget
    arms.forEach(({ arm }, index) => {
      const pose = this.armTargets[index]
      if (pose) arm.quaternion.copy(pose)
    })
    this.render()
  }

  // ---------------------------------------------------------------------------
  // Moves
  // ---------------------------------------------------------------------------

  /** Runs a task after the ones before it. Never rejects, so the queue keeps going after an error. */
  private enqueue(task: () => Promise<void>) {
    this.queue = this.queue
      .then(() => (this.disposed ? undefined : task()))
      .catch((error: unknown) => {
        console.error(error)
      })
    return this.queue
  }

  /** Keeps drawing while a sequence of moves runs. */
  private async run(sequence: () => Promise<void>) {
    this.moving++
    this.wake()
    try {
      await sequence()
    } finally {
      this.moving--
      if (this.instant) this.settle()
      else this.wake(1500)
    }
  }

  private move(
    duration: number,
    easing: Easing,
    onFrame: (value: number, progress: number) => void
  ) {
    return tween(duration, easing, onFrame, this.instant)
  }

  private pause(duration: number) {
    return this.move(duration, linear, () => {})
  }

  private async setCartShown(visible: boolean) {
    if (this.cartShown === visible) return
    this.cartShown = visible
    this.dogXTarget = visible ? DOG_BESIDE_CART : DOG_ALONE
    const cart = this.cart.root
    cart.visible = true
    const from = cart.scale.x
    const to = visible ? 1 : 0.001
    await this.run(() =>
      this.move(300, easeOut, (value) => {
        cart.scale.setScalar(lerp(from, to, value))
      })
    )
    cart.visible = visible
  }

  private setArms(pose: ArmPose) {
    this.armTargets = this.dog.arms.map(({ side }) => armPose(pose, side))
  }

  /** Waves the arm on the viewer's side. */
  private async wave() {
    if (this.instant) return
    const index = this.dog.arms.findIndex(({ side }) => side === 1)
    const arm = this.dog.arms[index]
    if (!arm) return
    for (let step = 0; step < 6; step++) {
      this.armTargets[index] = armPose(
        step % 2 === 0 ? "wave-high" : "wave-low",
        arm.side
      )
      await this.pause(170)
    }
    this.armTargets[index] = armPose("rest", arm.side)
  }

  // ---------------------------------------------------------------------------
  // Product photos and the basket
  // ---------------------------------------------------------------------------

  /** Loads a product photo once, however many times it is drawn. Null when it can't be loaded. */
  private photo(address: string) {
    let loading = this.photos.get(address)
    if (!loading) {
      loading = this.loader.loadAsync(address).then(
        (texture): LoadedPhoto => {
          texture.colorSpace = SRGBColorSpace
          const { naturalWidth, naturalHeight } = texture.image
          return {
            texture,
            aspect: naturalHeight > 0 ? naturalWidth / naturalHeight : 1,
          }
        },
        () => null
      )
      this.photos.set(address, loading)
    }
    return loading
  }

  /** A flat product photo that always faces the camera. */
  private async sprite(address: string, size: number) {
    const loaded = await this.photo(address)
    if (!loaded || this.disposed) return null
    const sprite = new Sprite(
      new SpriteMaterial({ map: loaded.texture, depthWrite: false })
    )
    this.aspects.set(sprite, loaded.aspect)
    this.resizeSprite(sprite, size)
    return sprite
  }

  private resizeSprite(sprite: Sprite, size: number) {
    sprite.scale.set(size * (this.aspects.get(sprite) ?? 1), size, 1)
  }

  private async putInBasket(item: BasketItem) {
    if (this.basket.has(item.sku)) return
    const sprite = await this.sprite(item.photo, BASKET_SIZE)
    if (!sprite) return
    // Another move may have put the same product in while its photo loaded
    if (this.basket.has(item.sku)) {
      sprite.material.dispose()
      return
    }
    this.cart.items.add(sprite)
    this.basket.set(item.sku, sprite)
  }

  private dropFromBasket(sku: string, sprite: Sprite) {
    this.basket.delete(sku)
    this.cart.items.remove(sprite)
    sprite.material.dispose()
  }

  /** Stacks the newest photos in the basket, a little apart and tilted, as if thrown in. */
  private layoutBasket() {
    const sprites = [...this.basket.values()]
    const hidden = Math.max(0, sprites.length - BASKET_LIMIT)
    sprites.forEach((sprite, index) => {
      const slot = index - hidden
      sprite.visible = slot >= 0
      sprite.position.set(
        ((slot % 3) - 1) * 0.14,
        0.8 + slot * 0.025,
        slot % 2 === 0 ? -0.06 : 0.08
      )
      sprite.material.rotation = ((slot % 3) - 1) * 0.22
      this.resizeSprite(sprite, BASKET_SIZE)
    })
  }

  // ---------------------------------------------------------------------------
  // From the page to the scene and back
  // ---------------------------------------------------------------------------

  /** The point in the scene under a point on the screen, at about Najm's distance from the camera. */
  private screenToWorld(x: number, y: number) {
    const rect = this.canvas.getBoundingClientRect()
    const point = new Vector3(
      ((x - rect.left) / rect.width) * 2 - 1,
      -(((y - rect.top) / rect.height) * 2 - 1),
      0.5
    ).unproject(this.camera)
    const direction = point.sub(this.camera.position).normalize()
    return this.camera.position.clone().add(direction.multiplyScalar(6.8))
  }

  /** Where a part of the scene is on the screen. */
  private screenPositionOf(object: Object3D) {
    const point = object.getWorldPosition(new Vector3()).project(this.camera)
    const rect = this.canvas.getBoundingClientRect()
    return {
      x: rect.left + ((point.x + 1) / 2) * rect.width,
      y: rect.top + ((1 - point.y) / 2) * rect.height,
    }
  }
}
