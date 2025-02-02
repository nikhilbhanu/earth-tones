import React, { useRef, useEffect } from "react";
import { useClockSync } from "../utils/hooks/useClockSync";

/**
 * A component that demonstrates synchronized animation with audio timing
 */
export function SyncedAnimation() {
    const canvasRef = useRef(null);

    // Subscribe to synchronized timing updates
    const timing = useClockSync({
        autoStart: true,
        onFrame: (frameTiming) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            const width = canvas.width;
            const height = canvas.height;

            // Clear canvas
            ctx.fillStyle = "black";
            ctx.fillRect(0, 0, width, height);

            // Calculate rotation based on audio time
            const rotation = (frameTiming.audioTime * Math.PI) % (2 * Math.PI);

            // Draw rotating line
            ctx.save();
            ctx.translate(width / 2, height / 2);
            ctx.rotate(rotation);

            // Color based on drift
            const driftIntensity = Math.min(Math.abs(frameTiming.drift) * 10, 1);
            ctx.strokeStyle = `rgb(${255 * driftIntensity}, ${255 * (1 - driftIntensity)}, 0)`;
            ctx.lineWidth = 4;

            ctx.beginPath();
            ctx.moveTo(-40, 0);
            ctx.lineTo(40, 0);
            ctx.stroke();

            ctx.restore();

            // Display timing info
            ctx.fillStyle = "white";
            ctx.font = "12px monospace";
            ctx.textAlign = "left";
            ctx.fillText(`Audio Time: ${frameTiming.audioTime.toFixed(3)}s`, 10, 20);
            ctx.fillText(`System Time: ${frameTiming.systemTime.toFixed(3)}s`, 10, 40);
            ctx.fillText(`Drift: ${(frameTiming.drift * 1000).toFixed(2)}ms`, 10, 60);
        }
    });

    // Set up canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas size
        const updateSize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        updateSize();
        window.addEventListener("resize", updateSize);

        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return (
        <div style={{ padding: "20px" }}>
            <h3>Audio-Visual Sync Demo</h3>
            <div style={{ marginBottom: "10px" }}>
                <button onClick={timing.start}>Start</button>
                <button onClick={timing.stop} style={{ marginLeft: "10px" }}>Stop</button>
            </div>
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "300px",
                    backgroundColor: "black",
                    border: "1px solid #333"
                }}
            />
        </div>
    );
}
