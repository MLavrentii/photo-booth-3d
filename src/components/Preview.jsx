import { useEffect, useRef } from "react";

export default function Preview({ mode, photoURL }) {
  const videoRef = useRef(null);
  const imgRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // --- ALWAYS stop old camera first ---
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    // --- If it's PHOTO mode → nothing more to do ---
    if (mode !== "camera") return;

    const video = videoRef.current;
    video.playsInline = true;
    video.muted = true;

    // --- Start camera ---
    navigator.mediaDevices
      .getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "user",
        },
      })
      .then((stream) => {
        streamRef.current = stream;
        video.srcObject = stream;
        video.onloadedmetadata = () => video.play();
      })
      .catch((err) => console.error("Camera access error:", err));

    // --- Cleanup when component unmounts or mode changes ---
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, [mode]);

  return (
    <div className="preview-container">
      {mode === "camera" && (
        <video ref={videoRef} className="preview-media"></video>
      )}

      {mode === "photo" && (
        <img
          ref={imgRef}
          src={photoURL}
          className="preview-media"
          alt="preview"
        />
      )}
    </div>
  );
}
