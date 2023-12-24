export default (statistics) => statistics.map(({ key, value }) => {
  /* key мб как timestamp в секундах, так и ISOdateTimeFormat */
  const timestamp = typeof key === 'number'
    ? key * 1000
    : new Date(key).getTime();

  return {
    x: timestamp,
    y: value,
  };
});
