import { isNull } from "lodash";
import React from "react";

export default function TooltipSet(props) {
  return (
    <div>
      <h4 className="font-semibold mr-1">{props.name}</h4>
      <div className="flex flex-row align-baseline">
        <h4 className="font-semibold mr-1">Pieces:</h4>
        <p>{props.pieces}</p>
      </div>
      <div className="flex flex-row align-baseline">
        <h4 className="font-semibold mr-1">Year:</h4>
        <p>{props.year}</p>
      </div>
      {!isNull(props.image) ? (
        <img
          src={props.image}
          alt="set image"
          height="200px"
          className="mx-auto p-2 my-3"
        />
      ) : null}
    </div>
  );
}
