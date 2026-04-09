'use client'

import { useEffect, useRef } from 'react'
import lottie, { AnimationItem } from 'lottie-web'

interface LottieLoaderProps {
  animationData?: any
  animationPath?: string
  loop?: boolean
  autoplay?: boolean
  className?: string
}

/**
 * Lottie Animation Loader Component
 * Loads and plays Lottie animations
 * Can accept animation data directly or load from path
 *
 * @param animationData - Lottie JSON animation data
 * @param animationPath - Path to Lottie JSON file
 * @param loop - Whether to loop the animation
 * @param autoplay - Whether to autoplay on load
 */
export function LottieLoader({
  animationData,
  animationPath,
  loop = true,
  autoplay = true,
  className = '',
}: LottieLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<AnimationItem | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Load animation
    if (animationData) {
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop,
        autoplay,
        animationData,
      })
    } else if (animationPath) {
      animationRef.current = lottie.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop,
        autoplay,
        path: animationPath,
      })
    }

    return () => {
      animationRef.current?.destroy()
    }
  }, [animationData, animationPath, loop, autoplay])

  return <div ref={containerRef} className={className} />
}

/**
 * Simple scroll down arrow animation data
 * Lightweight inline Lottie animation
 */
export const scrollDownAnimation = {
  v: '5.7.4',
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: 'Scroll Down',
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: 'Arrow',
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            { t: 0, s: [50, 30, 0], e: [50, 70, 0] },
            { t: 30, s: [50, 70, 0], e: [50, 30, 0] },
            { t: 60, s: [50, 30, 0] },
          ],
        },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] },
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          it: [
            {
              ind: 0,
              ty: 'sh',
              ks: {
                a: 0,
                k: {
                  i: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                  ],
                  o: [
                    [0, 0],
                    [0, 0],
                    [0, 0],
                  ],
                  v: [
                    [-10, -5],
                    [0, 5],
                    [10, -5],
                  ],
                  c: false,
                },
              },
            },
            {
              ty: 'st',
              c: { a: 0, k: [0.3, 0.52, 0.45, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 3 },
              lc: 2,
              lj: 2,
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0] },
              a: { a: 0, k: [0, 0] },
              s: { a: 0, k: [100, 100] },
              r: { a: 0, k: 0 },
              o: { a: 0, k: 100 },
            },
          ],
        },
      ],
    },
  ],
}
