import { random } from "lodash";

const COLORS = ["Yellow", "Royal Blue", "Red", "Green"];

export function randomColor() {
  const randomIndex = random(0, COLORS.length - 1);
  return COLORS[randomIndex];
}
