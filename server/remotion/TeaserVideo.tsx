import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing } from 'remotion';

type Props = {
  title: string;
  description: string;
  image?: string;
};

const easeOutCubic = Easing.bezier(0.33, 1, 0.68, 1);
const easeOutQuart = Easing.bezier(0.25, 1, 0.5, 1);

/** Characters to reveal per second for streaming text */
const CHARS_PER_SEC = 18;
/** Delay in seconds before description starts streaming */
const DESC_STREAM_DELAY_SEC = 1.2;

export const TeaserVideo: React.FC<Props> = ({ title, description, image }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const descText = description || 'Discover more.';

  // ---- Image: slide up + fade in ----
  const imageSlideY = interpolate(
    frame,
    [0, fps * 0.7],
    [80, 0],
    { extrapolateRight: 'clamp', easing: easeOutCubic }
  );
  const imageOpacity = interpolate(frame, [0, fps * 0.4], [0, 1], { extrapolateRight: 'clamp' });
  const imageScale = interpolate(
    frame,
    [0, fps * 0.6],
    [0.88, 1],
    { extrapolateRight: 'clamp', easing: easeOutQuart }
  );

  // ---- Title: stream in + slide from left + fade ----
  const titleStartFrame = fps * 0.5;
  const titleVisibleChars = Math.min(
    title.length,
    Math.floor(((frame - titleStartFrame) / fps) * CHARS_PER_SEC)
  );
  const titleStreamed = title.slice(0, Math.max(0, titleVisibleChars));
  const titleSlideX = interpolate(
    frame,
    [titleStartFrame, titleStartFrame + fps * 0.4],
    [-60, 0],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: easeOutCubic }
  );
  const titleOpacity = interpolate(
    frame,
    [titleStartFrame, titleStartFrame + fps * 0.25],
    [0, 1],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  // ---- Description: stream in + slide up + fade ----
  const descStartFrame = fps * (0.5 + DESC_STREAM_DELAY_SEC);
  const descVisibleChars = Math.min(
    descText.length,
    Math.floor(((frame - descStartFrame) / fps) * CHARS_PER_SEC)
  );
  const descStreamed = descText.slice(0, Math.max(0, descVisibleChars));
  const descSlideY = interpolate(
    frame,
    [descStartFrame, descStartFrame + fps * 0.5],
    [40, 0],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: easeOutCubic }
  );
  const descOpacity = interpolate(
    frame,
    [descStartFrame, descStartFrame + fps * 0.3],
    [0, 1],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  // ---- End fade out ----
  const endFade = interpolate(
    frame,
    [durationInFrames - fps * 1.5, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}
    >
      <AbsoluteFill style={{ opacity: endFade }}>
        {/* Top gradient overlay */}
        <AbsoluteFill
          style={{
            background: 'linear-gradient(to bottom, rgba(15,23,42,0.7) 0%, transparent 40%)',
            pointerEvents: 'none',
          }}
        />

        <AbsoluteFill style={{ justifyContent: 'center', alignItems: 'center', padding: 48 }}>
          {/* Image: slide-in from below + fade-in + scale */}
          <div
            style={{
              width: '85%',
              maxWidth: 720,
              aspectRatio: '16/10',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              opacity: imageOpacity,
              transform: `translateY(${imageSlideY}px) scale(${imageScale})`,
              marginBottom: 48,
              backgroundColor: 'rgba(30, 41, 59, 0.8)',
            }}
          >
            {image ? (
              <img
                src={image}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(148, 163, 184, 0.6)',
                  fontSize: 24,
                }}
              >
                No image
              </div>
            )}
          </div>

          {/* Title: streaming text + slide-in from left + fade-in */}
          <h1
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: 56,
              fontWeight: 700,
              color: '#f8fafc',
              textAlign: 'center',
              margin: 0,
              opacity: titleOpacity,
              transform: `translateX(${titleSlideX}px)`,
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
              minHeight: 68,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {titleStreamed}
            {titleVisibleChars < title.length && (
              <span style={{ opacity: 0.6, marginLeft: 2 }}>|</span>
            )}
          </h1>

          {/* Description: streaming text + slide-in from below + fade-in */}
          <p
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: 28,
              color: 'rgba(203, 213, 225, 0.95)',
              textAlign: 'center',
              maxWidth: 800,
              lineHeight: 1.4,
              marginTop: 24,
              opacity: descOpacity,
              transform: `translateY(${descSlideY}px)`,
              minHeight: 80,
            }}
          >
            {descStreamed}
            {descVisibleChars < descText.length && (
              <span style={{ opacity: 0.6, marginLeft: 2 }}>|</span>
            )}
          </p>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
