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

        // Set video dimensions for better detection
        videoRef.current.width = 640;
        videoRef.current.height = 480;

        await videoRef.current.play();
        console.log("Video playing");

        // Wait for video to be ready (check readyState)
        let attempts = 0;
        while (videoRef.current.readyState < 2 && attempts < 50) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          attempts++;
        }
        console.log("Video ready state:", videoRef.current.readyState);

        // Additional time for camera to adjust exposure
        await new Promise((resolve) => setTimeout(resolve, 2000));
        console.log("Camera warmed up, performing detection...");

        // Try detection multiple times to improve reliability
        const options = new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.1, // Very sensitive
        });

        let bestDetection = null;
        let highestConfidence = 0;

        // Try 3 times over 1.5 seconds
        for (let i = 0; i < 3; i++) {
          try {
            const detections = await faceapi.detectAllFaces(
              videoRef.current,
              options
            );

            if (detections && detections.length > 0) {
              // Get detection with highest confidence
              const best = detections.reduce((prev, current) =>
                current.score > prev.score ? current : prev
              );

              if (best.score > highestConfidence) {
                bestDetection = best;
                highestConfidence = best.score;
              }

              console.log(
                `Attempt ${i + 1}: Found ${
                  detections.length
                } face(s), best confidence: ${best.score.toFixed(3)}`
              );
            } else {
              console.log(`Attempt ${i + 1}: No faces detected`);
            }

            // Wait a bit between attempts
            if (i < 2) {
              await new Promise((resolve) => setTimeout(resolve, 500));
            }
          } catch (detectError) {
            console.error(`Detection attempt ${i + 1} failed:`, detectError);
          }
        }

        const faceDetected = !!bestDetection;
        console.log(
          "Final detection result:",
          faceDetected,
          bestDetection
            ? `(best confidence: ${bestDetection.score.toFixed(3)})`
            : ""
        );

        // If face detected, log confidence score
        if (bestDetection) {
          console.log(
            "✅ Face detected with confidence:",
            bestDetection.score.toFixed(3)
          );
        } else {
          console.log(
            "❌ No face detected in any attempt - ensure good lighting and face camera"
          );
        }

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
