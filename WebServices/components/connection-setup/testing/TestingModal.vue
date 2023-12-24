<template>
  <WModal width="500px" class="testing-modal" :loading="isLoading" @close="closeModal">
    <template v-if="isShowTitle" #title>
      {{ modalData.title }}
    </template>

    <template v-if="isShowSubtitle" #subtitle>
      {{ modalData.description }}
    </template>

    <template v-if="isShowImages">
      <div class="testing-modal__images">
        <button
          v-for="img in modalData.images"
          :key="img"
          class="testing-modal__image-item"
          type="button"
          @click="setImgPreview(img)"
        >
          <img :src="img" :alt="modalData.description">
        </button>

        <WImagePreview
          v-if="imgPreviewValue"
          :alt="modalData.description"
          :src="imgPreviewValue"
          @close="setImgPreview(null)"
        />
      </div>
    </template>
  </WModal>
</template>

<script>
import { WModal, WImagePreview } from '@tradesoft/war-ui';
import NoticeMessages from 'Common/Components/NoticeMessages';
import Api from '../../../api';

export default {
  name: 'TestingModal',
  components: {
    WModal,
    WImagePreview,
  },
  props: {
    producerCode: { type: String, required: true },
  },
  data() {
    return {
      isLoading: true,
      modalData: {},
      imgPreviewValue: null,
    };
  },
  computed: {
    isShowImages() {
      return this.modalData.images?.length;
    },
    isShowSubtitle() {
      return this.modalData.description && !this.isLoading;
    },
    isShowTitle() {
      return this.modalData.title && !this.isLoading;
    },
  },
  created() {
    this.getUsedPartsInfo();
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
    setImgPreview(val) {
      this.imgPreviewValue = val;
    },
    async getUsedPartsInfo() {
      const { providerId } = this.$route.params;

      const result = await Api.getInstance().getUsedPartsInfo({
        providerName: providerId,
        producerCode: this.producerCode,
      });
      this.isLoading = false;

      result.either(
        ({ message }) => {
          this.closeModal();
          NoticeMessages.showErrorNotice(message);
        },
        ({ data, meta }) => {
          this.modalData = { ...data, title: meta.messages.h1 };
        },
      );
    },
  },
};
</script>

<style lang="less" scoped>
.testing-modal {
  &__images {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;

    img {
      max-width: 100%;
    }
  }

  &__image-item {
    display: flex;
    justify-content: center;
    align-items: center;
    background: transparent;
    border: none;
    outline: none;
  }
}
</style>
