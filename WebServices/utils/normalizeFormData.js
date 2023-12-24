import normalizeControlValue from './normalizeControlValue';

export default (data, items) => items.reduce((acc, item) => {
  if ('controls' in item) {
    item.controls.forEach((control) => {
      const { name, templateId, defaultValue } = control;

      if (name !== 'nameEmpty') {
        acc[name] = normalizeControlValue(data[name] ?? defaultValue, templateId);
      }

      return acc;
    });
  }

  return acc;
}, {});
