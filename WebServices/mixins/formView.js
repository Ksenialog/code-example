import isEqual from 'lodash-es/isEqual';
import isNeedSave from '../utils/isNeedSave';

/* При использовании данного миксина должен быть реализован метод saveFormData у компонента */
export default {
  inject: ['messages'],
  data() {
    return {
      formData: {},
      initialFormData: {},
      formControls: [],
    };
  },
  computed: {
    isEqual() {
      return isEqual(this.initialFormData, this.formData);
    },
  },
  watch: {
    isEqual() {
      this.$emit('change', !this.isEqual);
    },
  },
  methods: {
    setFormData(value, name) {
      this.$set(this.formData, name, value);
    },
  },
  async beforeRouteLeave(to, from, next) {
    if (!this.isEqual) {
      const isConfirmed = await isNeedSave(this.messages);

      if (isConfirmed) {
        await this.saveFormData();
      }

      next();
      return;
    }

    next();
  },
};
