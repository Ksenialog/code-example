export default (value = null, templateId) => {
  switch (templateId) {
    case 'WInput':
    case 'WTextArea':
    case 'WRadioGroup': {
      return value === null ? '' : String(value);
    }
    case 'WCheckbox':
    case 'WSwitch': {
      return Boolean(value);
    }
    case 'WTokenList': {
      return value?.length ? value : [];
    }
    default: {
      return value;
    }
  }
};
