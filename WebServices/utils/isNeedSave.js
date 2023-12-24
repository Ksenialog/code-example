import ConfirmationPopup from '@tradesoft/war-ui/components/shared/ConfirmationPopup';

/**
 * @param {object} messages
 */
export default (messages) => ConfirmationPopup.confirmAccent({
  phrase: messages.modalChangesTitle,
  yes: messages.save,
  no: messages.notSave,
});
