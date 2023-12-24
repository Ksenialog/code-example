const EMPTY_VALUES = [null, undefined, ''];

export default (object) => Object.entries(object).reduce(
  (acc, [name, value]) => {
    if (!EMPTY_VALUES.includes(value)) {
      acc[name] = value;
    }

    return acc;
  },
  {},
);
