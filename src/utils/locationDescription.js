// Pretvara poziciju bounding box-a (u koordinatama originalne slike) u
// opisnu lokaciju na slici, npr. "gore lijevo", "centar", "dole desno".
export function describeLocation(box, imageWidth, imageHeight) {
  if (!box || !imageWidth || !imageHeight) {
    return '';
  }

  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;

  const relX = centerX / imageWidth;
  const relY = centerY / imageHeight;

  let horizontal = 'centar';
  if (relX < 0.34) horizontal = 'lijevo';
  else if (relX > 0.66) horizontal = 'desno';

  let vertical = 'sredina';
  if (relY < 0.34) vertical = 'gore';
  else if (relY > 0.66) vertical = 'dole';

  if (vertical === 'sredina' && horizontal === 'centar') {
    return 'centar slike';
  }
  if (vertical === 'sredina') {
    return `${horizontal} strana, sredina visine`;
  }
  if (horizontal === 'centar') {
    return `${vertical}, po sredini`;
  }
  return `${vertical} ${horizontal}`;
}
