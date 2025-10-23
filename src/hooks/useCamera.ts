import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

export const useCamera = (
  shouldCheck: boolean,
  onCheckComplete: (detected: boolean) => void
) => {
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
        setModelsLoaded(true);
      } catch (error) {
        console.error("Error loading face detection models:", error);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (shouldCheck && modelsLoaded && !isChecking) {
      performFaceCheck();
    }
  }, [shouldCheck, modelsLoaded]);

  const performFaceCheck = async () => {
    if (isChecking) {
      // Already checking, skip this round
      console.log("Face check already in progress, skipping");
      onCheckComplete(true); // Assume detected to avoid false alarm
      return;
    }

    console.log("Starting face check...");
    setIsChecking(true);

    let mediaStream: MediaStream | null = null;

    try {
      // Start camera
      console.log("Requesting camera access...");
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });
      console.log("Camera access granted");

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        console.log("Video playing");

        // Wait for video to be ready
        await new Promise((resolve) => setTimeout(resolve, 1500));
        console.log("Video ready, performing detection...");

        // Perform detection
        const detection = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        );

        const faceDetected = !!detection;
        console.log("Face detection result:", faceDetected);
        onCheckComplete(faceDetected);

        // Clear video source
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    } catch (error) {
      console.error("Error during face check:", error);
      // If camera is busy or error, assume user is present
      onCheckComplete(true);
    } finally {
      // CRITICAL: Always stop camera tracks
      if (mediaStream) {
        console.log("Stopping camera tracks...");
        mediaStream.getTracks().forEach((track) => {
          track.stop();
          console.log("Track stopped:", track.label);
        });
      }
      setIsChecking(false);
      console.log("Face check complete");
    }
  };

  return {
    videoRef,
    modelsLoaded,
    isChecking,
  };
};
