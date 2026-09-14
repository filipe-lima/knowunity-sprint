import Image from 'next/image';

/**
 * The real Knowie mascot artwork, for dropping into MascotSlot's
 * `children` (components/MascotSlot — that component's own doc comment:
 * "The mascot artwork itself... has no real asset in this codebase... left
 * to the caller via children"). Every MascotSlot usage built this session
 * before this component existed used a plain placeholder circle instead,
 * because `public/images/Knowie.png` — the one real mascot asset in this
 * repo — turned out not to be a usable single image at all: it's a 16-pose
 * reference sheet (a flat PNG export of a Figma page, each cell labelled
 * "01 standby", "03 Approving", etc., the label text baked directly into
 * the pixels), not individual production-ready pose images.
 *
 * The two poses this prototype actually needs — standby (the default/idle
 * pose) and Approving (docs/sprint-context.md's one pose change in the
 * whole flow, on an all-clear summary) — are cropped out of that sheet
 * here, not hand-drawn or invented: extracted below each cell's label
 * divider, then chroma-keyed against the sheet's own flat background
 * (confirmed via direct pixel sampling to be exactly `background/page`,
 * rgb(9,12,24) — the same token this app's own page background uses,
 * which is a lucky coincidence, not a guarantee for any future export) so
 * the mascot sits on a real transparent background instead of carrying a
 * dark rectangle that would show against `background/surface` or any
 * lighter surface. Saved as `public/images/mascot/standby.png` and
 * `public/images/mascot/approving.png` — derived assets, not the
 * designer's own export; flagged here so that's traceable, and so a real
 * per-pose export can replace them later without hunting for where they
 * came from.
 *
 * Only these two poses exist. The sheet has fourteen named poses total
 * (plus two "TBD" placeholders) — cropping the rest is real, repeatable
 * work (same divider-relative crop + chroma-key), not done here because
 * nothing in docs/SPEC.md's first screens needs them yet.
 */
export type MascotPose = 'standby' | 'approving';

const SOURCES: Record<MascotPose, { src: string; width: number; height: number }> = {
  standby: { src: '/images/mascot/standby.png', width: 200, height: 216 },
  approving: { src: '/images/mascot/approving.png', width: 200, height: 216 },
};

export interface MascotArtProps {
  pose?: MascotPose;
}

export function MascotArt({ pose = 'standby' }: MascotArtProps) {
  const { src, width, height } = SOURCES[pose];
  return (
    <Image
      src={src}
      alt=""
      width={width}
      height={height}
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
    />
  );
}
