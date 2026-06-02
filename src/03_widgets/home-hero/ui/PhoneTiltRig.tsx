'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTilt3d } from '@/shared/model/hooks';

type TProps = {
  children: ReactNode;
};

/**
 * 3-D tilt rig for the hero phone preview.
 *
 * Outer div establishes the perspective context (.tilt-rig-outer).
 * Inner motion.div carries the transform-style: preserve-3d stage (.tilt-rig-inner)
 * and receives framer-motion rotateX / rotateY from useTilt3d.
 *
 * Children (phone + floating side-cards) compose inside the 3-D stage.
 * Side-cards that carry .tilt-card-lifted get translateZ(var(--tilt-card-z))
 * so they float above the phone plane during tilt.
 *
 * Tilt is automatically disabled under prefers-reduced-motion: reduce
 * and on coarse-pointer (touch) devices — both handled inside useTilt3d.
 */
export const PhoneTiltRig = ({ children }: TProps) => {
  const { ref, style, onPointerMove, onPointerLeave } = useTilt3d({ max: 10 });

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className="tilt-rig-outer"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <motion.div className="tilt-rig-inner" style={style}>
        {children}
      </motion.div>
    </div>
  );
};
