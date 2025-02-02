'use client'

import { FC, useEffect, useRef } from "react";

const PongBackground: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(0);
  const ballPos = useRef({ x: 50, y: 50 });
  const ballVel = useRef({ x: 6, y: 6 });
  const paddle1Pos = useRef(50);
  const paddle2Pos = useRef(50);
  const player1Score = useRef(0);
  const player2Score = useRef(0);
  const mousePos = useRef({ x: 0, y: 0 });
  const paddleHeight = 80;
  const paddleWidth = 10;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const moveAI = (
      currentPos: number,
      ballY: number,
      canvasHeight: number
    ) => {
      // AI with imperfections
      if (Math.random() < 0.15) return currentPos;
      const targetPos = ballY - paddleHeight / 2 + (Math.random() - 0.5) * 50;
      return Math.max(
        0,
        Math.min(
          canvasHeight - paddleHeight,
          currentPos + (targetPos - currentPos) * 0.1
        )
      );
    };

    const updateGame = () => {
      ballPos.current.x += ballVel.current.x;
      ballPos.current.y += ballVel.current.y;

      // Wall collisions
      if (ballPos.current.y <= 0 || ballPos.current.y >= canvas.height) {
        ballVel.current.y *= -1;
      }

      // Paddle collisions
      const paddleCollision = (paddleY: number, isLeft: boolean) => {
        return (
          ballPos.current.y >= paddleY &&
          ballPos.current.y <= paddleY + paddleHeight &&
          (isLeft
            ? ballPos.current.x <= paddleWidth
            : ballPos.current.x >= canvas.width - paddleWidth)
        );
      };

      if (
        paddleCollision(paddle1Pos.current, true) ||
        paddleCollision(paddle2Pos.current, false)
      ) {
        ballVel.current.x *= -1.1;
        ballVel.current.y += (Math.random() - 0.5) * 2;
      }

      // Scoring
      if (ballPos.current.x < 0)
        player2Score.current = player2Score.current + 1;
      if (ballPos.current.x > canvas.width)
        player1Score.current = player1Score.current + 1;
      if (ballPos.current.x < 0 || ballPos.current.x > canvas.width) {
        resetBall(canvas);
      }

      // Control paddles based on cursor position
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const mouseX = mousePos.current.x;
      const mouseY = mousePos.current.y;

      //User cursor is inside canvas height.
      if (mouseY < canvasHeight) {
        // Left paddle control (when cursor is in left half)
        if (mouseX < canvasWidth / 2) {
          const targetY = mousePos.current.y - paddleHeight / 2;
          paddle1Pos.current = Math.max(
            0,
            Math.min(canvas.height - paddleHeight, targetY)
          );
        } else {
          paddle1Pos.current = moveAI(
            paddle1Pos.current,
            ballPos.current.y,
            canvas.height
          );
        }

        // Right paddle control (when cursor is in right half)
        if (mouseX >= canvasWidth / 2) {
          const targetY = mousePos.current.y - paddleHeight / 2;
          paddle2Pos.current = Math.max(
            0,
            Math.min(canvas.height - paddleHeight, targetY)
          );
        } else {
          paddle2Pos.current = moveAI(
            paddle2Pos.current,
            ballPos.current.y,
            canvas.height
          );
        }
      } else {
        paddle1Pos.current = moveAI(
          paddle1Pos.current,
          ballPos.current.y,
          canvas.height
        );
        paddle2Pos.current = moveAI(
          paddle2Pos.current,
          ballPos.current.y,
          canvas.height
        );
      }
    };

    const resetBall = (canvas: HTMLCanvasElement) => {
      ballPos.current = { x: canvas.width / 2, y: canvas.height / 2 };
      ballVel.current = {
        x: (Math.random() > 0.5 ? 6 : -6) * (1 + Math.random() * 0.3),
        y: (Math.random() - 0.5) * 8,
      };
    };

    const draw = () => {
      if (!ctx || !canvas) return;

      ctx.fillStyle = "rgb(79, 70, 229)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ball
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.beginPath();
      ctx.arc(ballPos.current.x, ballPos.current.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Paddles
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fillRect(0, paddle1Pos.current, paddleWidth, paddleHeight);
      ctx.fillRect(
        canvas.width - paddleWidth,
        paddle2Pos.current,
        paddleWidth,
        paddleHeight
      );

      // Scores
      ctx.font = "bold 48px monospace";
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.fillText(
        player1Score.current.toString(),
        100,
        canvas.height / 2 + 16
      );
      ctx.fillText(
        player2Score.current.toString(),
        canvas.width - 100,
        canvas.height / 2 + 16
      );
    };

    const gameLoop = () => {
      updateGame();
      draw();
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

export default PongBackground;
