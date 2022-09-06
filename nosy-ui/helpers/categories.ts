export const categoryToUrlParam = (name: string): string => {
  return name.toLowerCase().replace(" ", "-");
};

export const categoryFromUrlParam = (param: string): string => {
  return param
    .split("-")
    .map((x) => x.slice(0, 1).toUpperCase() + x.slice(1)) // Title case
    .join(" ");
};
