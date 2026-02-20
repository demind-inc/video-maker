import { Composition } from 'remotion';
import { TeaserVideo } from './TeaserVideo';

const FPS = 30;
/** Horizontal (landscape) desktop size: 16:9 */
const WIDTH = 1920;
const HEIGHT = 1080;
const DURATION_SEC = 8;

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="Teaser"
        component={TeaserVideo}
        durationInFrames={FPS * DURATION_SEC}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
        defaultProps={{
          title: 'Product Name',
          description: 'Short description of your product.',
          image: undefined,
        }}
      />
    </>
  );
};
