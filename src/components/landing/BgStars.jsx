'use client'

import { useEffect, useRef } from 'react'

export default function BgStars() {
  const ref = useRef()

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    let raf
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const stars = Array.from({ length: 280 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.3 + 0.1,
      o: Math.random() * 0.45 + 0.04,
      s: Math.random() * 0.006 + 0.001,
      p: Math.random() * Math.PI * 2,
    }))
    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      const bg = ctx.createRadialGradient(c.width * 0.3, c.height * 0.2, 0, c.width * 0.5, c.height * 0.5, c.width * 0.9)
      bg.addColorStop(0, "#FFFAE3"); bg.addColorStop(0.55, "#3F88C5"); bg.addColorStop(1, '#000000')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, c.width, c.height)
      const t = Date.now() / 1000
      stars.forEach((s) => {
        const pulse = Math.sin(t * s.s * 9 + s.p) * 0.35 + 0.65
        ctx.beginPath()
        ctx.arc(s.x * c.width, s.y * c.height, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180,205,255,${s.o * pulse})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={ref} className="fixed inset-0 z-0 pointer-events-none" />
}