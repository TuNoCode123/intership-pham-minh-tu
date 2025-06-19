import { Modal, TitleBar } from "@shopify/app-bridge-react";
import { usePoint } from "app/hooks/usePoint";

export function ModalEarn({ children }: { children: React.ReactNode }) {
  const { modalOpenEarn, setModalOpenEarn, title } = usePoint();

  return (
    <>
      <Modal
        id="my-modal"
        onHide={() => setModalOpenEarn(false)}
        open={modalOpenEarn}
      >
        {children}
        <TitleBar title={`${title} Earn Point Principles`}></TitleBar>
      </Modal>
    </>
  );
}

export default ModalEarn;
