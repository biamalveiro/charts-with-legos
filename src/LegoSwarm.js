import { useEffect, useState, useRef, useMemo, React } from "react";
import { isEmpty, random } from "lodash";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";
import { AxisBottom } from "@visx/axis";
import { extent } from "d3-array";
import { forceSimulation, forceCollide, forceX, forceY } from "d3-force";

import { useChartDimensions } from "./hooks/useChartDimensions";
import LegoBrick from "./LegoBrick";

const TOP = 400;
const SIDE = 25;
const SIDE_ANGLED = Math.sqrt(2 * (SIDE / 2) ** 2);
const COLORS = ["Yellow", "Royal Blue", "Red", "Green"];

const chartSettings = {
  marginLeft: SIDE_ANGLED,
  marginTop: SIDE_ANGLED,
  marginRight: SIDE_ANGLED * 2,
  marginBottom: SIDE_ANGLED,
};

const simulation = forceSimulation()
  .force("collide", forceCollide(SIDE_ANGLED))
  .force("forceY", forceY(TOP))
  .alphaMin(0.05);

const randomColor = () => {
  const randomIndex = random(0, COLORS.length - 1);
  return COLORS[randomIndex];
};

export default function LegoSwarm(props) {
  const [chartRef, dms] = useChartDimensions(chartSettings);
  const [scale, setScale] = useState(null);
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
    simulation.tick(10);
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
      .force("forceX", forceX((d) => xScale(d["num_parts"])).strength(1))
      .on("tick", updateSimulation)
      .on("end", endSimulation)
      .nodes(nodes)
      .alpha(1)
      .restart();
  }, [props.sets]);

  console.log(bricks);
  return (
    <div ref={chartRef} className="w-full h-screen">
      <svg viewBox={`0 0 ${dms.width} ${dms.height}`}>
        {!isEmpty(bricks) ? (
          <AxisBottom
            scale={xScale}
            top={TOP + dms.marginTop}
            label="Number of pieces"
            labelOffset={20}
            axisClassName="axis"
          />
        ) : null}
        <Group top={dms.marginTop} left={dms.marginLeft}>
          {bricks.map((brick, idx) => {
            const angle = (Math.atan2(brick.vy, brick.vx) * 180) / Math.PI;
            return (
              <LegoBrick
                key={brick["set_num"]}
                x={brick.x}
                y={brick.y}
                unitSize={SIDE}
                width={1}
                height={1}
                color={brick.color}
                rotation={angle}
                data={brick}
              />
            );
          })}
        </Group>
      </svg>
    </div>
  );
}
