export function animate(animations) {
  let lastTime = null;
  let rafid = null;

  let timePlaying = 0;
  let animationIndex = 0;

  const tick = (time) => {
    rafid = requestAnimationFrame(tick);
    const delta = time - lastTime;
    lastTime = time;
    timePlaying += delta;

    const { duration, update } = animations[animationIndex];

    if (timePlaying > duration) {
      // Next animation.
      animationIndex++;
      animationIndex %= animations.length;
      // Carry over any time playing.
      timePlaying = timePlaying - duration;
    } else {
      update(timePlaying / duration);
    }
  };

  const play = () => {
    if (rafid) return;
    lastTime = performance.now();
    tick(lastTime);
  };

  const pause = () => {
    if (rafid) cancelAnimationFrame(rafid);
    rafid = null;
  };

  const stop = () => {
    pause();
    timePlaying = 0;
    animationIndex = 0;
  };

  return {
    play,
    pause,
    stop
  };
}

export function lerp(a, b, t) {
  if (Array.isArray(a) && Array.isArray(b)) {
    const result = [];
    for (let i = 0; i < Math.min(a.length, b.length); i++)
      result[i] = a[i] * (1.0 - t) + b[i] * t;
    return result;
  } else {
    return a * (1.0 - t) + b * t;
  }
}

const rgb2Arr = (val) => [val.r, val.g, val.b, val.a];

export const getAnimationValues = (cameraPos) => {
  const {
    position,
    target,
    settings: { exaggeration, sunAltitude, sunAzimuth, sunHalo, sunAtmosphere },
    targetElevation
  } = cameraPos;

  return {
    position,
    targetElevation,
    target,
    exaggeration,
    sunAltitude,
    sunAzimuth,
    sunHalo: rgb2Arr(sunHalo),
    sunAtmosphere: rgb2Arr(sunAtmosphere)
  };
};
