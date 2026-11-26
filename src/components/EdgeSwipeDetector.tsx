"use client";

import { useCallback, useEffect, useRef } from "react";
import { useMobileSidebar } from "./MobileSidebarContext";

const EDGE_WIDTH = 20; // Width of the touch-sensitive edge in pixels
const SWIPE_THRESHOLD = 50; // Minimum swipe distance to trigger open
const SWIPE_VELOCITY_THRESHOLD = 0.3; // Minimum velocity to trigger open

/**
 * EdgeSwipeDetector - Detects swipe gestures from the left edge of the screen
 * to open the mobile sidebar. This component renders an invisible touch area
 * at the left edge that responds to swipe gestures.
 */
export default function EdgeSwipeDetector() {
  const { open, isOpen } = useMobileSidebar();
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  const isTracking = useRef(false);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      // Don't track if sidebar is already open
      if (isOpen) return;

      const touch = e.touches[0];
      // Only track touches that start near the left edge
      if (touch.clientX <= EDGE_WIDTH) {
        touchStartX.current = touch.clientX;
        touchStartY.current = touch.clientY;
        touchStartTime.current = Date.now();
        isTracking.current = true;
      }
    },
    [isOpen],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isTracking.current || isOpen) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - touchStartX.current;
      const deltaY = Math.abs(touch.clientY - touchStartY.current);

      // If vertical movement is greater than horizontal, cancel tracking
      // This prevents interfering with vertical scrolling
      if (deltaY > Math.abs(deltaX)) {
        isTracking.current = false;
        return;
      }

      // If swiping right with enough distance, open the sidebar
      if (deltaX >= SWIPE_THRESHOLD) {
        const elapsed = Date.now() - touchStartTime.current;
        const velocity = deltaX / elapsed;

        if (velocity >= SWIPE_VELOCITY_THRESHOLD) {
          open();
          isTracking.current = false;
        }
      }
    },
    [isOpen, open],
  );

  const handleTouchEnd = useCallback(() => {
    isTracking.current = false;
  }, []);

  useEffect(() => {
    // Add listeners to document to catch all edge touches
    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // This component doesn't render anything visible
  return null;
}
