import { Modal, TitleBar } from "@shopify/app-bridge-react";
import { usePoint } from "app/hooks/usePoint";

export function ModalSpend({ children }: { children: React.ReactNode }) {
  const { modalOpenSpend, setModalOpenSpend, title } = usePoint();

  return (
    <>
      <Modal
        id="my-modal-spend"
        onHide={() => setModalOpenSpend(false)}
        open={modalOpenSpend}
      >
        {children}
        <TitleBar title={`${title} Spend Point Principles`}></TitleBar>
      </Modal>
    </>
  );
}

export default ModalSpend;
