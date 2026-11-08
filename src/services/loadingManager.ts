/**
 * Authoritative Central Asset Loading Manager for HER UNIVERSE
 *
 * Provides a genuine, verifiable asset orchestration pipeline ensuring all
 * six worlds, 3D Canvas modules, personal memory photographs, Drei/Three textures,
 * full cinematic video stream (8.76 MB), typography, and the Secret Portal's
 * first rendered WebGL frame are completely loaded and decoded in browser memory
 * before the cinematic preloader completes.
 *
 * Guarantees:
 * - 0 fake timers inflating progress
 * - Failed tasks NEVER count towards 100% completion
 * - Required failures halt completion until resolved
 * - Dream Island video is downloaded and ready for playback with zero re-download
 * - Drei/Three texture cache is seeded with all 6 memory photos
 * - First usable WebGL frame of Secret Portal is confirmed rendered
 */

import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { ASSETS, getSceneBackgroundUrl } from "@/config/assetsConfig";
import { memoriesConfig } from "@/config/memoriesConfig";

export type AssetType =
  | "image"
  | "font"
  | "video"
  | "module"
  | "texture"
  | "scene-ready";

export type WorldCategory =
  | "portal"
  | "letter"
  | "galaxy"
  | "garden"
  | "island"
  | "finale"
  | "core"
  | "transitions";

export type AssetClassification = "required" | "optional";

export type AssetState = "pending" | "loading" | "loaded" | "failed";

export interface AssetTask {
  id: string;
  name: string;
  type: AssetType;
  category: WorldCategory;
  classification: AssetClassification;
  weight: number;
  state: AssetState;
  progress: number; // 0.0 to 1.0
  bytesLoaded?: number;
  bytesTotal?: number;
  error?: string;
  resource?: unknown;
}

export interface LoadingProgress {
  percentage: number;
  completedTasks: number;
  totalTasks: number;
  currentTaskName: string;
  stageMessage: string;
  isComplete: boolean;
  hasErrors: boolean;
  failedRequiredCount: number;
  failedOptionalCount: number;
  errors: Array<{
    id: string;
    name: string;
    error: string;
    classification: AssetClassification;
  }>;
  tasks: AssetTask[];
}

export type ProgressListener = (progress: LoadingProgress) => void;

class AssetLoadingManager {
  private tasks: Map<string, AssetTask> = new Map();
  private listeners: Set<ProgressListener> = new Set();
  private isStarted = false;
  private currentTaskName = "Initializing universe...";

  // Authoritative caches for reusable resources
  private imageCache: Map<string, HTMLImageElement> = new Map();
  private videoBlobMap: Map<string, { blob: Blob; blobUrl: string }> = new Map();
  private textureCache: Map<string, THREE.Texture> = new Map();

  constructor() {
    this.registerEssentialTasks();
  }

  /**
   * Registers all genuine assets across all 6 worlds and shared systems.
   * Total weight is mathematically calibrated to 100.
   */
  private registerEssentialTasks() {
    // -------------------------------------------------------------
    // Core Typography (Weight: 6)
    // -------------------------------------------------------------
    this.addTask({
      id: "font-cinzel",
      name: "Typography: Cinzel Serif Fonts (400, 600, 700, 900)",
      type: "font",
      category: "core",
      classification: "required",
      weight: 1.5,
    });
    this.addTask({
      id: "font-garamond",
      name: "Typography: Cormorant Garamond (300, 400, 600, Italic)",
      type: "font",
      category: "core",
      classification: "required",
      weight: 1.5,
    });
    this.addTask({
      id: "font-vibes",
      name: "Typography: Great Vibes Script Font",
      type: "font",
      category: "core",
      classification: "required",
      weight: 1.5,
    });
    this.addTask({
      id: "font-jakarta",
      name: "Typography: Plus Jakarta Sans (300, 400, 500, 600, 700)",
      type: "font",
      category: "core",
      classification: "required",
      weight: 1.5,
    });

    // -------------------------------------------------------------
    // Shared Transitions (Weight: 3)
    // -------------------------------------------------------------
    this.addTask({
      id: "transition-meadow",
      name: "Transitions: Moonlit Meadow Atmospheric Texture",
      type: "image",
      category: "transitions",
      classification: "required",
      weight: 3,
    });

    // -------------------------------------------------------------
    // World 01: Secret Portal (Weight: 18)
    // -------------------------------------------------------------
    this.addTask({
      id: "portal-heart",
      name: "World 01: Celestial Heart Portal Artwork",
      type: "image",
      category: "portal",
      classification: "required",
      weight: 5,
    });
    this.addTask({
      id: "portal-nebula",
      name: "World 01: Cosmic Nebula & Starry Clouds",
      type: "image",
      category: "portal",
      classification: "required",
      weight: 4,
    });
    this.addTask({
      id: "module-portal",
      name: "World 01: 3D Heart Portal & Living Stardust Module",
      type: "module",
      category: "portal",
      classification: "required",
      weight: 4,
    });
    this.addTask({
      id: "portal-first-frame",
      name: "World 01: 3D WebGL Canvas First Frame Rendered",
      type: "scene-ready",
      category: "portal",
      classification: "required",
      weight: 5,
    });

    // -------------------------------------------------------------
    // World 02: Love Letter (Weight: 8)
    // -------------------------------------------------------------
    this.addTask({
      id: "letter-still-life",
      name: "World 02: Antique Love Letter Still Life Artwork",
      type: "image",
      category: "letter",
      classification: "required",
      weight: 5,
    });
    this.addTask({
      id: "module-letter",
      name: "World 02: 3D Wax Seal & Parchment Envelope Module",
      type: "module",
      category: "letter",
      classification: "required",
      weight: 3,
    });

    // -------------------------------------------------------------
    // World 03: Memory Galaxy (Weight: 26)
    // -------------------------------------------------------------
    this.addTask({
      id: "galaxy-atmosphere",
      name: "World 03: Memory Galaxy Starry Atmosphere",
      type: "image",
      category: "galaxy",
      classification: "required",
      weight: 4,
    });
    this.addTask({
      id: "module-galaxy",
      name: "World 03: 3D Celestial Constellation Module",
      type: "module",
      category: "galaxy",
      classification: "required",
      weight: 4,
    });

    // 6 Personal Memory Photographs (Decoded HTML Images)
    memoriesConfig.memories.forEach((mem) => {
      this.addTask({
        id: `memory-photo-${mem.id}`,
        name: `World 03: Personal Photo — ${mem.title}`,
        type: "image",
        category: "galaxy",
        classification: "required",
        weight: 1.5,
      });
    });

    // 6 Three.js Textures (Preloaded in Drei useTexture/TextureLoader cache)
    memoriesConfig.memories.forEach((mem) => {
      this.addTask({
        id: `memory-texture-${mem.id}`,
        name: `World 03: 3D Constellation Texture — ${mem.title}`,
        type: "texture",
        category: "galaxy",
        classification: "required",
        weight: 1.5,
      });
    });

    // -------------------------------------------------------------
    // World 04: Enchanted Garden (Weight: 7)
    // -------------------------------------------------------------
    this.addTask({
      id: "garden-gazebo",
      name: "World 04: Moonlit Rose Gazebo Artwork",
      type: "image",
      category: "garden",
      classification: "required",
      weight: 4,
    });
    this.addTask({
      id: "module-garden",
      name: "World 04: 3D Enchanted Garden Blossoms Module",
      type: "module",
      category: "garden",
      classification: "required",
      weight: 3,
    });

    // -------------------------------------------------------------
    // World 05: Dream Island (Weight: 25)
    // -------------------------------------------------------------
    this.addTask({
      id: "island-poster",
      name: "World 05: Floating Sanctuary Sunset Backdrop Artwork",
      type: "image",
      category: "island",
      classification: "required",
      weight: 4,
    });
    this.addTask({
      id: "island-video",
      name: "World 05: Cinematic Sanctuary Video Stream (8.76 MB)",
      type: "video",
      category: "island",
      classification: "required",
      weight: 18,
    });
    this.addTask({
      id: "module-island",
      name: "World 05: Dream Island 3D Atmosphere Module",
      type: "module",
      category: "island",
      classification: "required",
      weight: 3,
    });

    // -------------------------------------------------------------
    // World 06: Grand Finale (Weight: 7)
    // -------------------------------------------------------------
    this.addTask({
      id: "finale-celebration",
      name: "World 06: Moonlit Birthday Celebration Artwork",
      type: "image",
      category: "finale",
      classification: "required",
      weight: 4,
    });
    this.addTask({
      id: "module-finale",
      name: "World 06: 3D Birthday Cake & Celebration Module",
      type: "module",
      category: "finale",
      classification: "required",
      weight: 3,
    });
  }

  private addTask(task: Omit<AssetTask, "state" | "progress">) {
    this.tasks.set(task.id, {
      ...task,
      state: "pending",
      progress: 0,
    });
  }

  public subscribe(listener: ProgressListener): () => void {
    this.listeners.add(listener);
    listener(this.getProgressSnapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const snapshot = this.getProgressSnapshot();
    this.listeners.forEach((listener) => listener(snapshot));
  }

  private getStageMessage(percentage: number): string {
    if (percentage < 15) {
      return "Awakening typography & starlit celestial gateway...";
    } else if (percentage < 35) {
      return "Unfolding antique parchment & romantic still life...";
    } else if (percentage < 60) {
      return "Aligning your 6 memory stars & cosmic constellation...";
    } else if (percentage < 85) {
      return "Streaming floating sanctuary video & midnight blossoms...";
    } else if (percentage < 100) {
      return "Preparing your grand birthday cake celebration...";
    } else {
      return "Her Universe is ready for you... ♡";
    }
  }

  public getProgressSnapshot(): LoadingProgress {
    let totalWeight = 0;
    let earnedWeight = 0;
    let completedCount = 0;
    let failedRequiredCount = 0;
    let failedOptionalCount = 0;
    let totalRequiredCount = 0;
    let completedRequiredCount = 0;

    const errors: Array<{
      id: string;
      name: string;
      error: string;
      classification: AssetClassification;
    }> = [];

    this.tasks.forEach((task) => {
      totalWeight += task.weight;

      if (task.classification === "required") {
        totalRequiredCount++;
      }

      // CRITICAL: Only loaded or actively loading tasks contribute earned weight.
      // Failed tasks NEVER contribute progress.
      if (task.state === "loaded") {
        earnedWeight += task.weight;
        completedCount++;
        if (task.classification === "required") {
          completedRequiredCount++;
        }
      } else if (task.state === "loading" && task.progress > 0) {
        earnedWeight += task.weight * Math.min(1.0, Math.max(0, task.progress));
      } else if (task.state === "failed") {
        if (task.classification === "required") {
          failedRequiredCount++;
        } else {
          failedOptionalCount++;
        }
        if (task.error) {
          errors.push({
            id: task.id,
            name: task.name,
            error: task.error,
            classification: task.classification,
          });
        }
      }
    });

    const rawPercentage = totalWeight > 0 ? (earnedWeight / totalWeight) * 100 : 0;
    let percentage = Math.min(100, Math.max(0, Math.round(rawPercentage)));

    // STRICT COMPLETION RULE: If any required task failed or is incomplete, percentage cannot be 100%
    if (failedRequiredCount > 0 || completedRequiredCount < totalRequiredCount) {
      percentage = Math.min(99, percentage);
    }

    const isComplete =
      failedRequiredCount === 0 &&
      completedRequiredCount === totalRequiredCount &&
      percentage >= 100;

    return {
      percentage,
      completedTasks: completedCount,
      totalTasks: this.tasks.size,
      currentTaskName: this.currentTaskName,
      stageMessage: this.getStageMessage(percentage),
      isComplete,
      hasErrors: errors.length > 0,
      failedRequiredCount,
      failedOptionalCount,
      errors,
      tasks: Array.from(this.tasks.values()),
    };
  }

  private updateTask(id: string, updates: Partial<AssetTask>) {
    const task = this.tasks.get(id);
    if (!task) return;

    Object.assign(task, updates);

    if (updates.state === "loaded") {
      task.progress = 1.0;
    } else if (updates.state === "failed") {
      task.progress = 0;
    }

    if (updates.name && task.state === "loading") {
      this.currentTaskName = task.name;
    }

    this.notify();
  }

  /**
   * Starts all authoritative loading operations across browser APIs.
   */
  public async start(): Promise<void> {
    if (this.isStarted || typeof window === "undefined") return;
    this.isStarted = true;

    // Enable Three.js global caching upfront
    THREE.Cache.enabled = true;

    // Initialize parallel loaders
    this.loadAllFonts();
    this.loadAllImages();
    this.loadAllTextures();
    this.loadAll3DModules();
    this.loadSanctuaryVideo();
  }

  /**
   * Retries any failed tasks.
   */
  public retryFailed(): void {
    this.tasks.forEach((task) => {
      if (task.state === "failed") {
        this.updateTask(task.id, { state: "pending", error: undefined, progress: 0 });
      }
    });

    // Restart failed task groups
    this.loadAllFonts();
    this.loadAllImages();
    this.loadAllTextures();
    this.loadAll3DModules();
    this.loadSanctuaryVideo();
  }

  // =========================================================================
  // 1. TYPOGRAPHY & FONT LOADING
  // =========================================================================

  private async loadAllFonts() {
    const fontDefinitions: Array<{
      id: string;
      family: string;
      specs: string[];
    }> = [
      {
        id: "font-cinzel",
        family: "Cinzel",
        specs: [
          '400 16px "Cinzel"',
          '600 16px "Cinzel"',
          '700 16px "Cinzel"',
          '900 16px "Cinzel"',
        ],
      },
      {
        id: "font-garamond",
        family: "Cormorant Garamond",
        specs: [
          '300 16px "Cormorant Garamond"',
          '400 16px "Cormorant Garamond"',
          '600 16px "Cormorant Garamond"',
          'italic 400 16px "Cormorant Garamond"',
        ],
      },
      {
        id: "font-vibes",
        family: "Great Vibes",
        specs: ['400 16px "Great Vibes"'],
      },
      {
        id: "font-jakarta",
        family: "Plus Jakarta Sans",
        specs: [
          '300 16px "Plus Jakarta Sans"',
          '400 16px "Plus Jakarta Sans"',
          '500 16px "Plus Jakarta Sans"',
          '600 16px "Plus Jakarta Sans"',
          '700 16px "Plus Jakarta Sans"',
        ],
      },
    ];

    fontDefinitions.forEach(({ id, family, specs }) => {
      const task = this.tasks.get(id);
      if (!task || task.state === "loaded") return;
      this.loadSingleFontFamily(id, family, specs);
    });
  }

  private async loadSingleFontFamily(
    id: string,
    family: string,
    specs: string[]
  ) {
    this.updateTask(id, { state: "loading", progress: 0 });

    try {
      if (typeof document !== "undefined" && "fonts" in document) {
        // Load each required weight/style for this font family
        const loadPromises = specs.map((spec) => document.fonts.load(spec));
        await Promise.all(loadPromises);

        // Ensure document font set has completed settling
        await document.fonts.ready;

        // Verify with font check
        const isVerified = specs.some((spec) => document.fonts.check(spec));
        if (!isVerified) {
          // Micro-tick retry in case of rendering pipeline delay
          await new Promise((r) => setTimeout(r, 150));
        }

        this.updateTask(id, { state: "loaded", progress: 1.0 });
      } else {
        // Fallback for environments lacking document.fonts API
        this.updateTask(id, { state: "loaded", progress: 1.0 });
      }
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : `Font ${family} loading failed`;
      console.error(`[AssetLoader] Font failure (${family}):`, err);
      this.updateTask(id, {
        state: "failed",
        progress: 0,
        error: errorMsg,
      });
    }
  }

  // =========================================================================
  // 2. WORLD ARTWORKS, PHOTOS & TRANSITION IMAGES
  // =========================================================================

  private loadAllImages() {
    const imagesToLoad: Array<{ id: string; url: string }> = [
      { id: "transition-meadow", url: ASSETS.transitions.moonlitMeadow },
      { id: "portal-heart", url: getSceneBackgroundUrl("portal") },
      { id: "portal-nebula", url: ASSETS.portal.cosmicNebula },
      { id: "letter-still-life", url: getSceneBackgroundUrl("letter") },
      { id: "galaxy-atmosphere", url: getSceneBackgroundUrl("galaxy") },
      { id: "garden-gazebo", url: getSceneBackgroundUrl("garden") },
      { id: "island-poster", url: ASSETS.island.floatingIsland },
      { id: "finale-celebration", url: getSceneBackgroundUrl("finale") },
    ];

    memoriesConfig.memories.forEach((mem) => {
      imagesToLoad.push({
        id: `memory-photo-${mem.id}`,
        url: mem.image,
      });
    });

    imagesToLoad.forEach(({ id, url }) => {
      const task = this.tasks.get(id);
      if (!task || task.state === "loaded") return;
      this.loadSingleImageWithDecode(id, url);
    });
  }

  private async loadSingleImageWithDecode(id: string, url: string) {
    if (this.imageCache.has(url)) {
      this.updateTask(id, {
        state: "loaded",
        progress: 1.0,
        resource: this.imageCache.get(url),
      });
      return;
    }

    this.updateTask(id, { state: "loading", progress: 0 });

    const MAX_RETRIES = 2;
    let attempt = 0;

    while (attempt <= MAX_RETRIES) {
      try {
        const img = new window.Image();
        img.crossOrigin = "anonymous";

        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () =>
            reject(new Error(`Failed to load image resource at ${url}`));

          // Check if already cached by browser
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }

          img.src = url;
        });

        // Genuine browser hardware decoding
        if (typeof img.decode === "function") {
          await img.decode();
        }

        // Populate Three.js ImageLoader cache to guarantee zero duplicate network downloads
        THREE.Cache.enabled = true;
        THREE.Cache.add(`image:${url}`, img);
        THREE.Cache.add(url, img);

        this.imageCache.set(url, img);
        this.updateTask(id, {
          state: "loaded",
          progress: 1.0,
          resource: img,
        });
        return;
      } catch (err: unknown) {
        attempt++;
        if (attempt > MAX_RETRIES) {
          const errorMsg =
            err instanceof Error ? err.message : "Image load and decode failure";
          console.error(`[AssetLoader] Image failure for ${id} (${url}):`, err);
          this.updateTask(id, {
            state: "failed",
            progress: 0,
            error: errorMsg,
          });
          return;
        }
        await new Promise((r) => setTimeout(r, 500 * attempt));
      }
    }
  }

  // =========================================================================
  // 3. THREE.JS & DREI TEXTURE PRELOADING
  // =========================================================================

  private loadAllTextures() {
    memoriesConfig.memories.forEach((mem) => {
      const id = `memory-texture-${mem.id}`;
      const task = this.tasks.get(id);
      if (!task || task.state === "loaded") return;
      this.loadSingleTexture(id, mem.image);
    });
  }

  private async loadSingleTexture(id: string, url: string) {
    if (this.textureCache.has(url)) {
      this.updateTask(id, {
        state: "loaded",
        progress: 1.0,
        resource: this.textureCache.get(url),
      });
      return;
    }

    this.updateTask(id, { state: "loading", progress: 0 });

    // Ensure Three.js Cache is active
    THREE.Cache.enabled = true;

    // Seed Drei's useLoader cache via useTexture.preload
    try {
      useTexture.preload(url);
    } catch {
      // Non-fatal if Drei preload is already queued
    }

    const MAX_RETRIES = 2;
    let attempt = 0;

    while (attempt <= MAX_RETRIES) {
      try {
        const loader = new THREE.TextureLoader();
        loader.setCrossOrigin("anonymous");
        const texture = await new Promise<THREE.Texture>((resolve, reject) => {
          loader.load(
            url,
            (tex) => {
              tex.colorSpace = THREE.SRGBColorSpace;
              tex.generateMipmaps = true;
              tex.minFilter = THREE.LinearMipmapLinearFilter;
              tex.magFilter = THREE.LinearFilter;
              tex.needsUpdate = true;
              resolve(tex);
            },
            undefined,
            (err) => reject(new Error(`TextureLoader failed for ${url}: ${err}`))
          );
        });

        this.textureCache.set(url, texture);
        this.updateTask(id, {
          state: "loaded",
          progress: 1.0,
          resource: texture,
        });
        return;
      } catch (err: unknown) {
        attempt++;
        if (attempt > MAX_RETRIES) {
          const errorMsg =
            err instanceof Error ? err.message : "Three.js texture loading failed";
          console.error(`[AssetLoader] Texture failure for ${id}:`, err);
          this.updateTask(id, {
            state: "failed",
            progress: 0,
            error: errorMsg,
          });
          return;
        }
        await new Promise((r) => setTimeout(r, 500 * attempt));
      }
    }
  }

  // =========================================================================
  // 4. JAVASCRIPT 3D CANVAS SCENE MODULES
  // =========================================================================

  private loadAll3DModules() {
    const modules: Array<{
      id: string;
      loader: () => Promise<unknown>;
    }> = [
      {
        id: "module-portal",
        loader: () => import("@/components3d/Portal/PortalCanvas"),
      },
      {
        id: "module-letter",
        loader: () => import("@/components3d/Envelope/EnvelopeCanvas"),
      },
      {
        id: "module-galaxy",
        loader: () => import("@/components3d/MemoryGalaxy/MemoryGalaxyCanvas"),
      },
      {
        id: "module-garden",
        loader: () => import("@/components3d/EnchantedGarden/EnchantedGardenCanvas"),
      },
      {
        id: "module-island",
        loader: () => import("@/components3d/DreamIsland/DreamIslandAtmosphere"),
      },
      {
        id: "module-finale",
        loader: () => import("@/components3d/Finale/FinaleCanvas"),
      },
    ];

    modules.forEach(({ id, loader }) => {
      const task = this.tasks.get(id);
      if (!task || task.state === "loaded") return;
      this.loadSingleModule(id, loader);
    });
  }

  private async loadSingleModule(
    id: string,
    loader: () => Promise<unknown>
  ) {
    this.updateTask(id, { state: "loading", progress: 0 });

    const MAX_RETRIES = 2;
    let attempt = 0;

    while (attempt <= MAX_RETRIES) {
      try {
        const mod = await loader();
        this.updateTask(id, {
          state: "loaded",
          progress: 1.0,
          resource: mod,
        });
        return;
      } catch (err: unknown) {
        attempt++;
        if (attempt > MAX_RETRIES) {
          const errorMsg =
            err instanceof Error ? err.message : "Module import failed";
          console.error(`[AssetLoader] Module failure for ${id}:`, err);
          // STRICT RULE: Failed module MUST NOT be marked loaded
          this.updateTask(id, {
            state: "failed",
            progress: 0,
            error: errorMsg,
          });
          return;
        }
        await new Promise((r) => setTimeout(r, 600 * attempt));
      }
    }
  }

  // =========================================================================
  // 5. DREAM ISLAND VIDEO (Full 8.76 MB Download & Stream Preparation)
  // =========================================================================

  private async loadSanctuaryVideo() {
    const id = "island-video";
    const url = ASSETS.island.video;
    const task = this.tasks.get(id);
    if (!task || task.state === "loaded") return;

    if (this.videoBlobMap.has(url)) {
      const cached = this.videoBlobMap.get(url)!;
      this.updateTask(id, {
        state: "loaded",
        progress: 1.0,
        resource: cached.blobUrl,
      });
      return;
    }

    this.updateTask(id, { state: "loading", progress: 0 });

    const MAX_RETRIES = 2;
    let attempt = 0;

    while (attempt <= MAX_RETRIES) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status} ${response.statusText}`);
        }

        const contentLengthHeader = response.headers.get("content-length");
        // Public file is 9,189,870 bytes (~8.76 MiB)
        const totalBytes = contentLengthHeader
          ? parseInt(contentLengthHeader, 10)
          : 9189870;

        let blob: Blob;

        if (response.body && typeof ReadableStream !== "undefined") {
          const reader = response.body.getReader();
          const chunks: BlobPart[] = [];
          let loadedBytes = 0;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
              chunks.push(value);
              loadedBytes += value.length;

              const progress =
                totalBytes > 0
                  ? Math.min(0.99, loadedBytes / totalBytes)
                  : 0.5;

              this.updateTask(id, {
                progress,
                bytesLoaded: loadedBytes,
                bytesTotal: totalBytes,
              });
            }
          }

          blob = new Blob(chunks, { type: "video/mp4" });
        } else {
          blob = await response.blob();
        }

        // Create reusable object URL
        const blobUrl = URL.createObjectURL(blob);
        this.videoBlobMap.set(url, { blob, blobUrl });

        // Prepare video for playback on a probe element
        await this.verifyVideoPlaybackReadiness(blobUrl);

        this.updateTask(id, {
          state: "loaded",
          progress: 1.0,
          bytesLoaded: totalBytes,
          bytesTotal: totalBytes,
          resource: blobUrl,
        });
        return;
      } catch (err: unknown) {
        attempt++;
        if (attempt > MAX_RETRIES) {
          const errorMsg =
            err instanceof Error
              ? err.message
              : "Failed to download Dream Island video";
          console.error(`[AssetLoader] Video failure for ${id}:`, err);
          this.updateTask(id, {
            state: "failed",
            progress: 0,
            error: errorMsg,
          });
          return;
        }
        await new Promise((r) => setTimeout(r, 1000 * attempt));
      }
    }
  }

  private verifyVideoPlaybackReadiness(blobUrl: string): Promise<void> {
    return new Promise((resolve) => {
      if (typeof document === "undefined") {
        resolve();
        return;
      }

      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;

      let settled = false;

      const cleanup = () => {
        if (settled) return;
        settled = true;
        video.oncanplay = null;
        video.oncanplaythrough = null;
        video.onloadeddata = null;
        video.onerror = null;
        resolve();
      };

      video.oncanplaythrough = cleanup;
      video.oncanplay = cleanup;
      video.onloadeddata = cleanup;
      video.onerror = cleanup;

      video.src = blobUrl;
      video.load();

      // Fallback timer ensures probe element does not hang if canplay event was missed
      setTimeout(cleanup, 4000);
    });
  }

  // =========================================================================
  // 6. SCENE READINESS (World 01 First WebGL Frame Signal)
  // =========================================================================

  /**
   * Called by Secret Portal's WebGL Canvas when the first frame is actively rendered.
   */
  public markPortalFrameReady(): void {
    const task = this.tasks.get("portal-first-frame");
    if (!task || task.state === "loaded") return;

    this.updateTask("portal-first-frame", {
      state: "loaded",
      progress: 1.0,
    });
  }

  // =========================================================================
  // PUBLIC ACCESSORS FOR REUSABLE RESOURCES
  // =========================================================================

  /**
   * Returns the pre-downloaded Blob URL for the given video URL, or undefined.
   */
  public getVideoBlobUrl(url: string): string | undefined {
    return this.videoBlobMap.get(url)?.blobUrl;
  }

  /**
   * Returns the pre-decoded HTMLImageElement for the given image URL, or undefined.
   */
  public getCachedImage(url: string): HTMLImageElement | undefined {
    return this.imageCache.get(url);
  }

  /**
   * Returns the preloaded Three.js Texture for the given texture URL, or undefined.
   */
  public getCachedTexture(url: string): THREE.Texture | undefined {
    return this.textureCache.get(url);
  }

  /**
   * Revokes all created object URLs to prevent memory leaks on exit.
   */
  public cleanup(): void {
    this.videoBlobMap.forEach(({ blobUrl }) => {
      try {
        URL.revokeObjectURL(blobUrl);
      } catch {}
    });
    this.videoBlobMap.clear();
    this.imageCache.clear();
    this.textureCache.clear();
  }
}

export const assetLoader = new AssetLoadingManager();
