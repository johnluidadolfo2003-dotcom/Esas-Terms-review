/** All gaze coordinates are viewport CSS pixels; timestamps are performance.now() milliseconds. */
export const EYE_DEFAULTS = {
  settleMs: 700, validCollectionMs: 1200, pointTimeoutMs: 7000, minSamples: 12,
  maxFrameAgeMs: 250, maxSampleGapMs: 180, prolongedLossMs: 600,
  dwellMs: 900, releaseMs: 180, boundaryPx: 6,
  minCutoffHz: 1.1, beta: 0.006, derivativeCutoffHz: 1,
  ridge: 0.001, complexImprovement: 0.10, complexImprovementPx: 5,
  minValidFraction: 0.65, minEffectiveHz: 6,
  guidedTimeoutMs: 8000,
};
export type EyeSettings = typeof EYE_DEFAULTS;
export function validateSettings(input: Partial<EyeSettings>): EyeSettings {
  const settings = {...EYE_DEFAULTS, ...input};
  const ranges:Record<keyof EyeSettings,[number,number]>={
    settleMs:[0,3000],validCollectionMs:[300,5000],pointTimeoutMs:[1000,20000],minSamples:[3,300],
    maxFrameAgeMs:[50,1000],maxSampleGapMs:[50,500],prolongedLossMs:[200,3000],
    dwellMs:[300,3000],releaseMs:[50,1000],boundaryPx:[0,12],minCutoffHz:[.1,10],beta:[0,.1],derivativeCutoffHz:[.1,10],
    ridge:[.000001,1],complexImprovement:[0,.9],complexImprovementPx:[0,50],minValidFraction:[.1,1],minEffectiveHz:[1,60],guidedTimeoutMs:[2000,30000],
  };
  for(const key of Object.keys(ranges) as (keyof EyeSettings)[]){const value=settings[key],[min,max]=ranges[key];if(!Number.isFinite(value)||value<min||value>max)throw new Error(`Invalid eye setting: ${key} (${min}–${max})`);}
  if(settings.pointTimeoutMs<settings.validCollectionMs)throw new Error('Point timeout must allow the required valid collection time');
  return settings;
}
