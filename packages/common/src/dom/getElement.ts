function getElement<T extends Element>(elementId: string): T {
  const canvas: T | null = document.querySelector(elementId);
  if (!canvas) throw new Error("Not exist canvas element");
  return canvas;
}

export default getElement;
