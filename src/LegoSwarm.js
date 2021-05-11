import { useEffect, useState, useMemo, React } from "react";
import { isEmpty } from "lodash";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { AxisBottom } from "@visx/axis";
import { extent } from "d3-array";
import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";

import { useChartDimensions } from "./hooks/useChartDimensions";
import { randomColor } from "./utils";
import { SIDE, SIDE_ANGLED, chartSettings } from "./constants";
import LegoBrick from "./LegoBrick";
import TooltipSet from "./TooltipSet";

const simulation = forceSimulation()
  .force("collide", forceCollide(SIDE_ANGLED))
  .alphaMin(0.03);

export default function LegoSwarm(props) {
  const [chartRef, dms] = useChartDimensions(chartSettings);
  const [renderCounter, setRenderCounter] = useState(0);
  const [bricks, setBricks] = useState([]);

  const xScale = useMemo(
    () =>
      scaleLinear({
        domain: extent(props.sets.map((set) => set["num_parts"])),
        range: [100, dms.boundedWidth],
      }),
    [props.sets, dms.boundedWidth]
  );

  function endSimulation() {
    setRenderCounter((count) => count + 1);
  }

  function updateSimulation() {
    setRenderCounter((count) => count + 1);
    simulation.tick(5);
  }

  useEffect(() => {
    const nodes = props.sets.map((set) => {
      return {
        ...set,
        color: randomColor(),
      };
    });
    setBricks(nodes);

    simulation
      .force(
        "forceX",
        forceX((d) => xScale(d["num_parts"]))
      )
      .force("forceY", forceY(dms.boundedHeight / 2))
      .on("tick", updateSimulation)
      .on("end", endSimulation)
      .nodes(nodes)
      .alpha(1)
      .restart();
  }, [props.sets, xScale, dms.boundedHeight]);

  return (
    <div ref={chartRef} className="w-full h-screen">
      <svg viewBox={`0 0 ${dms.width} ${dms.height}`}>
        {!isEmpty(bricks) ? (
          <AxisBottom
            scale={xScale}
            top={dms.height / 2}
            label="Number of pieces"
            labelOffset={20}
            axisClassName="axis"
          />
        ) : null}
        <Group top={dms.marginTop} left={dms.marginLeft}>
          {bricks.map((brick) => {
            const iterationRotation =
              (Math.atan2(brick.vy, brick.vx) * 180) / Math.PI;
            return (
              <LegoBrick
                key={brick["set_num"]}
                x={brick.x}
                y={brick.y}
                unitSize={SIDE}
                width={1}
                height={1}
                color={brick.color}
                rotation={iterationRotation}
                tooltip={
                  <TooltipSet
                    name={brick["name"]}
                    pieces={brick["num_parts"]}
                    year={brick["year"]}
                    image={brick["set_img_url"]}
                  />
                }
              />
            );
          })}
        </Group>
      </svg>
    </div>
  );
}
