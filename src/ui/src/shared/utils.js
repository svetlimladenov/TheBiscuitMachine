export default function pulse(biscuits, biscuitBox, currentId, isRunning) {
  const movedBiscuits = biscuits.map((biscuit) => {
    return { y: biscuit.y + 25, step: biscuit.step + 1, id: biscuit.id };
  });

  if (isRunning) {
    // add new biscuit
    movedBiscuits.push({ y: 12, step: 0, id: currentId });
  }

  // filter the biscut for the box
  const biscuitForBox = movedBiscuits.filter((biscuit) => biscuit.step === 4);

  let updatedBox = [...biscuitBox, ...biscuitForBox];

  const updatedBiscuits = movedBiscuits.filter((biscuit) => biscuit.step < 4);

  return [updatedBiscuits, updatedBox];
}
