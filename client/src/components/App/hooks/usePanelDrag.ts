import { useEffect, useState } from 'react';
import { useDrag } from 'react-use-gesture';

export function usePanelDrag() {
  const [dimensions, setDimensions] = useState(calcDefaultDimensions());
  const [gridTemplateRows, setGridTemplateRows] = useState<string>(
    crateGridTemplateRows(
      dimensions.topBarHeight,
      dimensions.mapHeight,
      dimensions.dragPanelHeight,
    ),
  );

  const [bindDrag] = useState(
    useDrag(({ down, movement: [mx, my] }) => {
      const nextMapHeight = Math.max(
        dimensions.contentHeight / 7,
        Math.min(dimensions.contentHeight / 1.3, dimensions.mapHeight + my),
      );

      if (down) {
        setGridTemplateRows(
          crateGridTemplateRows(
            dimensions.topBarHeight,
            nextMapHeight,
            dimensions.dragPanelHeight,
          ),
        );
      } else {
        setDimensions(dimensions => ({
          ...dimensions,
          mapHeight: nextMapHeight,
        }));
      }
    }),
  );

  useEffect(() => {
    let resizeTimer: any;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const nextDimensions = calcDefaultDimensions();
        setDimensions(nextDimensions);
        setGridTemplateRows(
          crateGridTemplateRows(
            nextDimensions.topBarHeight,
            nextDimensions.mapHeight,
            nextDimensions.dragPanelHeight,
          ),
        );
      }, 250);
    };
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return { bindDrag, gridTemplateRows };
}

function calcDefaultDimensions() {
  const windowHeight = window.innerHeight;
  const topBarHeight = 47;
  const dragPanelHeight = 49;
  const contentHeight = windowHeight - topBarHeight - dragPanelHeight;
  return {
    windowHeight,
    topBarHeight,
    dragPanelHeight,
    contentHeight,
    mapHeight: contentHeight / 2,
  };
}

function crateGridTemplateRows(
  topBarHeight: number,
  mapHeight: number,
  dragPanelHeight: number,
) {
  return `[row-topbar] ${topBarHeight}px
  [row-map] ${mapHeight}px
  [row-drag] ${dragPanelHeight}px
  [row-panel] auto`;
}
