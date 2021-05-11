import React, { useState, useEffect, useMemo } from "react";
import { isEmpty } from "lodash";
import { groupBy, n, summarize, tidy, mutate } from "@tidyjs/tidy";
import { extent } from "d3-array";
import { scaleTime, scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { AxisBottom } from "@visx/axis";

import TooltipBar from "./TooltipBar";
import LegoBrick from "./LegoBrick";

import { useChartDimensions } from "./hooks/useChartDimensions";
import { SIDE, SIDE_ANGLED, chartSettings } from "./constants";
import { randomColor } from "./utils";

export default function LegoBars(props) {
  const [chartRef, dms] = useChartDimensions(chartSettings);
  const [bars, setBars] = useState([]);

  const xScale = useMemo(
    () =>
      scaleTime({
        domain: [new Date(1990, 1), new Date(2021, 1)],
        range: [dms.marginLeft, dms.boundedWidth],
      }),
    [dms.marginLeft, dms.boundedWidth]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: extent(bars.map((bar) => bar["count"])),
        range: [dms.marginBottom, dms.boundedHeight],
      }),
    [bars, dms.marginBottom, dms.boundedHeight]
  );

  useEffect(() => {
    const updatedBars = tidy(
      props.sets,
      groupBy("year", [
        summarize({
          count: n(),
        }),
      ]),
      mutate({
        color: () => randomColor(),
      })
    );
    setBars(updatedBars);
  }, [props.sets]);

  return (
    <div ref={chartRef} className="w-full h-screen">
      <svg viewBox={`0 0 ${dms.width} ${dms.height}`}>
        {!isEmpty(bars) ? (
          <AxisBottom
            scale={xScale}
            top={dms.boundedHeight}
            label="Year"
            labelOffset={20}
            axisClassName="axis"
          />
        ) : null}
        <Group top={dms.marginTop} left={dms.marginLeft}>
          {bars.map((bar) => {
            return (
              <LegoBrick
                x={xScale(new Date(bar.year, 1)) - SIDE + 3}
                y={
                  dms.boundedHeight -
                  (2 + dms.marginBottom + (bar.count * SIDE) / 2)
                }
                unitSize={SIDE}
                width={1}
                height={bar.count}
                color={bar.color}
                rotation={0}
                tooltip={<TooltipBar year={bar.year} count={bar.count} />}
              />
            );
          })}
        </Group>
      </svg>
    </div>
  );
}
