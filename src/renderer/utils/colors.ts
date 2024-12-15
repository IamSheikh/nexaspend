/* eslint-disable prettier/prettier */
export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const calculateLuminance = (hexColor: any) => {
  const rgb = hexColor
    .replace('#', '')
    .match(/.{1,2}/g)
    .map((x: any) => parseInt(x, 16));

  const [r, g, b] = rgb.map((channel: any) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  return luminance > 0.5 ? 'black' : 'white';
};
