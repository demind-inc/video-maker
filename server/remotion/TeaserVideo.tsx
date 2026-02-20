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
/** First scene: only streaming text (seconds). Then image + rest appear. */
const FIRST_SCENE_DURATION_SEC = 4;

export const TeaserVideo: React.FC<Props> = ({ title, description, image }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const descText = description || 'Discover more.';
  const firstSceneEndFrame = fps * FIRST_SCENE_DURATION_SEC;

  // ---- Scene 1: Title streams from start; description after delay ----
  const titleVisibleChars = Math.min(
    title.length,
    Math.floor((frame / fps) * CHARS_PER_SEC)
  );
  const titleStreamed = title.slice(0, Math.max(0, titleVisibleChars));
  const titleOpacity = interpolate(frame, [0, fps * 0.3], [0, 1], { extrapolateRight: 'clamp' });
  const titleSlideX = interpolate(frame, [0, fps * 0.4], [-40, 0], { extrapolateRight: 'clamp', easing: easeOutCubic });

  const descStartFrame = fps * DESC_STREAM_DELAY_SEC;
  const descVisibleChars = Math.min(
    descText.length,
    Math.floor(((frame - descStartFrame) / fps) * CHARS_PER_SEC)
  );
  const descStreamed = descText.slice(0, Math.max(0, descVisibleChars));
  const descOpacity = interpolate(
    frame,
    [descStartFrame, descStartFrame + fps * 0.3],
    [0, 1],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );
  const descSlideY = interpolate(
    frame,
    [descStartFrame, descStartFrame + fps * 0.4],
    [30, 0],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: easeOutCubic }
  );

  // ---- Scene 2: Image and rest appear after first scene ----
  const imageStartFrame = firstSceneEndFrame;
  const imageSlideY = interpolate(
    frame,
    [imageStartFrame, imageStartFrame + fps * 0.7],
    [80, 0],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: easeOutCubic }
  );
  const imageOpacity = interpolate(
    frame,
    [imageStartFrame, imageStartFrame + fps * 0.5],
    [0, 1],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );
  const imageScale = interpolate(
    frame,
    [imageStartFrame, imageStartFrame + fps * 0.6],
    [0.92, 1],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp', easing: easeOutQuart }
  );
  const imageMarginBottom = interpolate(
    frame,
    [imageStartFrame, imageStartFrame + fps * 0.5],
    [0, 48],
    { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
  );

  // Title/desc size: big in scene 1, smaller in scene 2 (smooth transition)
  const transitionFrames = fps * 0.35;
  const titleFontSize = Math.round(
    interpolate(
      frame,
      [firstSceneEndFrame, firstSceneEndFrame + transitionFrames],
      [80, 56],
      { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
    )
  );
  const descFontSize = Math.round(
    interpolate(
      frame,
      [firstSceneEndFrame, firstSceneEndFrame + transitionFrames],
      [32, 28],
      { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' }
    )
  );
  const titleMinHeight = frame < firstSceneEndFrame + transitionFrames ? 96 : 68;
  const descMinHeight = frame < firstSceneEndFrame + transitionFrames ? 48 : 80;

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
          {/* Image: only visible after first scene; then slide-in from below + fade-in + scale */}
          <div
            style={{
              width: '90%',
              maxWidth: 1600,
              aspectRatio: '16/10',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              opacity: imageOpacity,
              transform: `translateY(${imageSlideY}px) scale(${imageScale})`,
              marginBottom: imageMarginBottom,
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

          {/* Title: streaming text (big in scene 1, smaller in scene 2) */}
          <h1
            style={{
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              fontSize: titleFontSize,
              fontWeight: 700,
              color: '#f8fafc',
              textAlign: 'center',
              margin: 0,
              opacity: titleOpacity,
              transform: `translateX(${titleSlideX}px)`,
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
              minHeight: titleMinHeight,
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
              fontFamily: 'ui-sans-serif, system-ui, sans-serif',
              fontSize: descFontSize,
              color: 'rgba(203, 213, 225, 0.95)',
              textAlign: 'center',
              maxWidth: 800,
              lineHeight: 1.4,
              marginTop: 24,
              opacity: descOpacity,
              transform: `translateY(${descSlideY}px)`,
              minHeight: descMinHeight,
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
