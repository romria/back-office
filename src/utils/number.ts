export const getPagesLimit = ({dataLength, perPage}: {dataLength: number, perPage: number}): number => {
  if (dataLength === 0) return 1;
  return Math.ceil(dataLength / perPage);
};
