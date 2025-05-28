import { Modal, TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { MODAL } from "app/constraints/variants";

export default function NotFoundModal() {
  const shopify = useAppBridge();

  return (
    <>
      <Modal id={MODAL.MY_MODAL_NOT_FOUND}>
        <p>Sản phẩm không được tìm thấy hoặc đã bị xóa</p>
        <TitleBar title="Title">
          <button variant="primary">Label</button>
          <button onClick={() => shopify.modal.hide(MODAL.MY_MODAL_NOT_FOUND)}>
            Label
          </button>
        </TitleBar>
      </Modal>
    </>
  );
}
