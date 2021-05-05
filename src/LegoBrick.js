import React, { useState } from "react";
import { Group } from "@visx/group";
import { find } from "lodash";
import colors from "./colors.json";
import { brightness } from "chromatism";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

export default function LegoBrick(props) {
  const [isSelected, setIsSelected] = useState(false);
  const hexColor = `#${
    find(colors, (color) => color.name === props.color).rgb
  }`;
  const widthPx = props.width * props.unitSize;
  const heightPx = props.height * props.unitSize;
  return (
    <Group left={props.x - widthPx / 2} top={props.y - heightPx / 2}>
      <Group
        transform={`rotate(${props.rotation} ${widthPx / 2} ${heightPx / 2})`}
      >
        <rect
          width={widthPx}
          height={heightPx}
          style={{
            fill: isSelected ? brightness(20, hexColor).hex : hexColor,
            stroke: "black",
            strokeWidth: 3,
          }}
        />
        {[...Array(props.width).keys()].map((ix) =>
          [...Array(props.height).keys()].map((iy) => (
            <circle
              cx={props.unitSize * (ix + 1 / 2)}
              cy={props.unitSize * (iy + 1 / 2)}
              r={(props.unitSize / 2) * 0.6}
              style={{ stroke: "black", strokeWidth: 2, fill: "transparent" }}
            />
          ))
        )}
        <Tippy content={props.tooltip}>
          <rect
            width={widthPx}
            height={heightPx}
            onMouseEnter={() => setIsSelected(true)}
            onMouseLeave={() => setIsSelected(false)}
            style={{
              fill: "transparent",
              strokeWidth: 0,
              cursor: isSelected ? "pointer" : "default",
            }}
          />
        </Tippy>
      </Group>
    </Group>
  );
}
