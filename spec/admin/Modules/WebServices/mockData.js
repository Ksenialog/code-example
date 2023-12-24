export const messages = {
  emptyStateTitle: 'Пусто',
  connected: 'Подключенные',
  notConnected: 'Не подключенные',
  configure: 'Настроить',
  connect: 'Подключить',
  contactTradesoft: 'phone',
  settingsTitle: 'Настройки',
  providerLatency: 'Скорость ответа от поставщика, сек',
  totalRequestsCount: 'Общее количество запросов к поставщику',
};

export const providerColumns = [
  {
    name: 'status',
  },
  {
    name: 'title',
    title: 'Поставщик',
  },
  {
    name: 'contractRequired',
    title: 'Согласование',
  },
  {
    name: 'orderFeature',
    title: 'Веб-заказ',
  },
  {
    name: 'syncFeature',
    title: 'Синхронизация',
  },
  {
    name: 'info',
  },
  {
    name: 'actions',
  },
];

export const logsColumns = [
  {
    name: 'provider',
    title: 'Поставщик',
  },
  {
    name: 'area',
    title: 'Тип ошибки',
  },
  {
    name: 'description',
    title: 'Описание',
  },
  {
    name: 'logDate',
    title: 'Дата',
  },
  {
    name: 'summary',
    title: 'Сводная информация',
  },
];

export const fakeWebOrderTabs = [
  {
    name: 'settings',
    title: 'Настройки',
  },
  {
    name: 'syncState',
    title: 'Синхронизация состояний',
  },
];

export const fakeFormItems = [
  {
    label: 'title WTextArea',
    controls: [{ name: 'test', value: '123', templateId: 'WTextArea' }],
  },
  {
    label: 'title WInput',
    controls: [{ name: 'field', value: 'text', templateId: 'WInput' }],
  },
  {
    title: 'title WTokenList',
    controls: [{
      name: '1111',
      value: [],
      templateId: 'WTokenList',
      items: [],
    }],
  },
  {
    label: 'title WSwitch',
    subLabel: 'Данная фильтрация производится на уровне данных',
    templateId: 'WebServicesSwitch',
    controls: [{
      name: 'switchName',
      templateId: 'WSwitch',
    }],
  },
];

export const fakeFormData = {
  test: '123',
  field: 'text',
  1111: [],
};

export const fakePostedFormData = {
  test: '321',
  field: 'text2',
  1111: [1, 2, 3],
};
