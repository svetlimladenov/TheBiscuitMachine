import Biscuit from "./Biscuit";

export default function MovingBiscuits({ biscuits, speed }) {
  return biscuits.map((biscuit) => {
    return (
      <Biscuit
        key={biscuit.id}
        y={biscuit.y}
        speed={speed}
        step={biscuit.step}
      />
    );
  });
}
