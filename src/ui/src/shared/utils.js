export default function pulse(biscuits, biscuitBox, currentId) {
  const movedBiscuits = biscuits.map((biscuit) => {
    return { y: biscuit.y + 33, step: biscuit.step + 1, id: biscuit.id };
  });

  // add new biscuit
  movedBiscuits.push({ y: 0, step: 0, id: currentId });

  // filter the biscut for the box
  const biscuitForBox = movedBiscuits.filter((biscuit) => biscuit.step === 3);

  let updatedBox = [...biscuitBox, ...biscuitForBox];

  const updatedBiscuits = movedBiscuits.filter((biscuit) => biscuit.step < 3);

  return [updatedBiscuits, updatedBox];
}
