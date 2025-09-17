import { useState, useEffect } from 'react';

/**
 * Sprint 3 Story 4: Mobile Detection Hook
 * Expert Lead: Maya Rodriguez (UX Expert)
 *
 * Custom hook for detecting mobile devices and screen sizes
 * to provide optimal executive mobile experience
 */

interface MobileState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  isTouchDevice: boolean;
}

const BREAKPOINTS = {
  mobile: 768, // Below 768px
  tablet: 1024, // 768px - 1024px
  desktop: 1024, // Above 1024px
} as const;

export function useMobile(): MobileState {
  const [mobileState, setMobileState] = useState<MobileState>({
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 0,
    screenHeight: 0,
    orientation: 'landscape',
    isTouchDevice: false,
  });

  useEffect(() => {
    const updateMobileState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < BREAKPOINTS.mobile;
      const isTablet =
        width >= BREAKPOINTS.mobile && width < BREAKPOINTS.tablet;
      const isDesktop = width >= BREAKPOINTS.desktop;
      const orientation = height > width ? 'portrait' : 'landscape';

      // Detect touch capability
      const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore - for older browsers
        navigator.msMaxTouchPoints > 0;

      setMobileState({
        isMobile,
        isTablet,
        isDesktop,
        screenWidth: width,
        screenHeight: height,
        orientation,
        isTouchDevice,
      });
    };

    // Initial update
    updateMobileState();

    // Listen for resize events
    window.addEventListener('resize', updateMobileState);
    window.addEventListener('orientationchange', updateMobileState);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateMobileState);
      window.removeEventListener('orientationchange', updateMobileState);
    };
  }, []);

  return mobileState;
}

/**
 * Hook for executive-specific mobile preferences
 */
export function useExecutiveMobile() {
  const mobile = useMobile();

  return {
    ...mobile,
    // Executive-specific configurations
    shouldUseMobileLayout:
      mobile.isMobile || (mobile.isTouchDevice && mobile.isTablet),
    shouldShowMobileNav: mobile.isMobile,
    shouldUseLargeTouchTargets: mobile.isTouchDevice,
    shouldOptimizeForMeetings:
      mobile.isMobile && mobile.orientation === 'portrait',
    recommendedInputMethod: mobile.isMobile ? 'voice' : 'keyboard',
  };
}

/**
 * Hook for detecting specific mobile contexts
 */
export function useMobileContext() {
  const mobile = useMobile();

  return {
    // Meeting-friendly contexts
    isMeetingMode: mobile.isMobile && mobile.orientation === 'portrait',
    isQuickCaptureMode: mobile.isMobile && mobile.screenWidth < 400,

    // Performance contexts
    shouldReduceAnimations: mobile.isMobile,
    shouldLazyLoadImages: mobile.isMobile,
    shouldOptimizeForTouch: mobile.isTouchDevice,

    // Layout contexts
    shouldUseBottomNav: mobile.isMobile,
    shouldUseFloatingActions: mobile.isMobile,
    shouldUseFullScreen: mobile.isMobile && mobile.orientation === 'landscape',
  };
}
