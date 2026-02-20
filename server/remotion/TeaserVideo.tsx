import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from 'remotion';

type Props = {
  title: string;
  description: string;
  image?: string;
};

export const TeaserVideo: React.FC<Props> = ({ title, description, image }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, fps], [0, 1], { extrapolateRight: 'clamp' });
  const titleSlide = interpolate(frame, [fps * 0.5, fps * 1.5], [30, 0], { extrapolateRight: 'clamp' });
  const descOpacity = interpolate(frame, [fps * 1.2, fps * 2], [0, 1], { extrapolateRight: 'clamp' });
  const scale = interpolate(frame, [0, fps * 0.8], [0.92, 1], { extrapolateRight: 'clamp' });
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
          {/* Image or placeholder */}
          <div
            style={{
              width: '85%',
              maxWidth: 720,
              aspectRatio: '16/10',
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
              opacity: fadeIn,
              transform: `scale(${scale})`,
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

          {/* Title */}
          <h1
            style={{
              fontFamily: 'system-ui, sans-serif',
              fontSize: 56,
              fontWeight: 700,
              color: '#f8fafc',
              textAlign: 'center',
              margin: 0,
              opacity: fadeIn,
              transform: `translateY(${titleSlide}px)`,
              textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            }}
          >
            {title}
          </h1>

          {/* Description */}
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
            }}
          >
            {description || 'Discover more.'}
          </p>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
