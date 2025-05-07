import { Button, Frame, Modal, TextContainer } from "@shopify/polaris";
import { useState, useCallback } from "react";
interface IModalProductProps {
  title: string;
  active: boolean;
  setActive: (active: boolean) => void;
  children: React.ReactNode;
}
function ModalProduct({
  children,
  title,
  active,
  setActive,
}: IModalProductProps) {
  const handleChange = useCallback(() => setActive(!active), [active]);

  return (
    <div style={{ height: "500px" }}>
      <Frame>
        <Modal open={active} onClose={handleChange} title={title}>
          <Modal.Section>{children}</Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}
export default ModalProduct;
