import React from "react";

export default function TooltipBar(props) {
  return (
    <div>
      <h4 className="font-semibold mr-1">{props.year}</h4>
      <div className="flex flex-row align-baseline">
        <h4 className="font-semibold mr-1"># Sets:</h4>
        <p>{props.count}</p>
      </div>
    </div>
  );
}
