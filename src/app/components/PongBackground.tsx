'use client'

import { FC, useEffect, useRef } from "react"
import { useTheme } from '../providers/ThemeProvider'

const PongBackground: FC = () => {
  const { theme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameId = useRef<number>(0)
  const ballPos = useRef({ x: 50, y: 50 })
  const ballVel = useRef({ x: 6, y: 6 })
  const paddle1Pos = useRef(50)
  const paddle2Pos = useRef(50)
  const player1Score = useRef(0)
  const player2Score = useRef(0)
  const mousePos = useRef({ x: 0, y: 0 })
  const paddleHeight = 80
  const paddleWidth = 10

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return
      const rect = canvasRef.current.getBoundingClientRect()
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const moveAI = (
      currentPos: number,
      ballY: number,
      canvasHeight: number
    ) => {
      if (Math.random() < 0.15) return currentPos
      const targetPos = ballY - paddleHeight / 2 + (Math.random() - 0.5) * 50
      return Math.max(
        0,
        Math.min(
          canvasHeight - paddleHeight,
          currentPos + (targetPos - currentPos) * 0.1
        )
      )
    }

    const updateGame = () => {
      // ... game logic remains the same
      ballPos.current.x += ballVel.current.x
      ballPos.current.y += ballVel.current.y

      if (ballPos.current.y <= 0 || ballPos.current.y >= canvas.height) {
        ballVel.current.y *= -1
      }

      const paddleCollision = (paddleY: number, isLeft: boolean) => {
        return (
          ballPos.current.y >= paddleY &&
          ballPos.current.y <= paddleY + paddleHeight &&
          (isLeft
            ? ballPos.current.x <= paddleWidth
            : ballPos.current.x >= canvas.width - paddleWidth)
        )
      }

      if (
        paddleCollision(paddle1Pos.current, true) ||
        paddleCollision(paddle2Pos.current, false)
      ) {
        ballVel.current.x *= -1.1
        ballVel.current.y += (Math.random() - 0.5) * 2
      }

      if (ballPos.current.x < 0) player2Score.current++
      if (ballPos.current.x > canvas.width) player1Score.current++
      if (ballPos.current.x < 0 || ballPos.current.x > canvas.width) {
        resetBall(canvas)
      }

      const canvasWidth = canvas.width
      const canvasHeight = canvas.height
      const mouseX = mousePos.current.x
      const mouseY = mousePos.current.y

      if (mouseY < canvasHeight) {
        if (mouseX < canvasWidth / 2) {
          const targetY = mousePos.current.y - paddleHeight / 2
          paddle1Pos.current = Math.max(
            0,
            Math.min(canvas.height - paddleHeight, targetY)
          )
        } else {
          paddle1Pos.current = moveAI(
            paddle1Pos.current,
            ballPos.current.y,
            canvas.height
          )
        }

        if (mouseX >= canvasWidth / 2) {
          const targetY = mousePos.current.y - paddleHeight / 2
          paddle2Pos.current = Math.max(
            0,
            Math.min(canvas.height - paddleHeight, targetY)
          )
        } else {
          paddle2Pos.current = moveAI(
            paddle2Pos.current,
            ballPos.current.y,
            canvas.height
          )
        }
      } else {
        paddle1Pos.current = moveAI(
          paddle1Pos.current,
          ballPos.current.y,
          canvas.height
        )
        paddle2Pos.current = moveAI(
          paddle2Pos.current,
          ballPos.current.y,
          canvas.height
        )
      }
    }

    const resetBall = (canvas: HTMLCanvasElement) => {
      ballPos.current = { x: canvas.width / 2, y: canvas.height / 2 }
      ballVel.current = {
        x: (Math.random() > 0.5 ? 6 : -6) * (1 + Math.random() * 0.3),
        y: (Math.random() - 0.5) * 8,
      }
    }

    const draw = () => {
      if (!ctx || !canvas) return

      // Clear the canvas with transparency
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const elementOpacity = "0.3"

      // Ball with subtle opacity
      ctx.fillStyle = `rgba(255, 255, 255, ${elementOpacity})`
      ctx.beginPath()
      ctx.arc(ballPos.current.x, ballPos.current.y, 8, 0, Math.PI * 2)
      ctx.fill()

      // Paddles with subtle opacity
      ctx.fillStyle = `rgba(255, 255, 255, ${elementOpacity})`
      ctx.fillRect(0, paddle1Pos.current, paddleWidth, paddleHeight)
      ctx.fillRect(
        canvas.width - paddleWidth,
        paddle2Pos.current,
        paddleWidth,
        paddleHeight
      )

      // Scores with very subtle opacity
      ctx.font = "bold 48px monospace"
      ctx.fillStyle = `rgba(255, 255, 255, ${elementOpacity})`
      ctx.fillText(
        player1Score.current.toString(),
        100,
        canvas.height / 2 + 16
      )
      ctx.fillText(
        player2Score.current.toString(),
        canvas.width - 100,
        canvas.height / 2 + 16
      )
    }

    const gameLoop = () => {
      updateGame()
      draw()
      animationFrameId.current = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current)
    }
  }, [theme])

  return (
    <canvas
    
      ref={canvasRef}
      className="absolute hidden md:block inset-0 w-full h-full pointer-events-none"
    />
  )
}

export default PongBackground