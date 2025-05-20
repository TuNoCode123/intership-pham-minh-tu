// import { Button, Frame, Modal, TextContainer } from "@shopify/polaris";
// import { useState, useCallback } from "react";
// interface IModalProps {
//   open: boolean;
//   handleChange: () => void;

//   title: string;
//   primaryAction: {
//     content: string;
//     onAction: () => void;
//   };
//   secondaryActions: {
//     content: string;
//     onAction: () => void;
//   }[];
//   children: React.ReactNode;
// }
// function ModalComponent(props: IModalProps) {
//   //   const [active, setActive] = useState(true);

//   //   const handleChange = useCallback(() => setActive(!active), [active]);

//   //   const activator = <Button onClick={handleChange}>Open</Button>;

//   return (
//     <div style={{ height: "500px" }}>
//       <Frame>
//         <Modal
//           //   activator={activator}
//           open={props.open}
//           onClose={props.handleChange}
//           title={props.title}
//           primaryAction={{ ...props.primaryAction }}
//           secondaryActions={[...props.secondaryActions]}
//         >
//           <Modal.Section>
//             <TextContainer>{props.children}</TextContainer>
//           </Modal.Section>
//         </Modal>
//       </Frame>
//     </div>
//   );
// }
// export default ModalComponent;
import {
  Modal,
  ShopifyGlobal,
  TitleBar,
  useAppBridge,
} from "@shopify/app-bridge-react";
import { ActionType } from "app/routes/app.my-page";
import { useState } from "react";
interface IModalProps {
  //   shopify: ShopifyGlobal;
  open: boolean;
  handleClose: () => void;
  title: string;
  handleFunction?: () => void;
  id: string;
  //   primaryAction: {
  //     content: string;
  //     onAction: () => void;
  //   };
  //   secondaryActions: {
  //     content: string;
  //     onAction: () => void;
  //   }[];
  children: React.ReactNode;
}

function MyModal(props: IModalProps) {
  const {
    handleClose,
    children: propschildren,
    title,
    handleFunction,
    id,
  } = props;

  return (
    <>
      <Modal id={id} variant="base">
        {propschildren}

        <TitleBar title={title}>
          {id == ActionType.DELETE && (
            <>
              <button variant="primary" onClick={handleFunction}>
                Save
              </button>
              <button onClick={handleClose}>Cancel</button>
            </>
          )}
        </TitleBar>
      </Modal>
    </>
  );
}

export default MyModal;
