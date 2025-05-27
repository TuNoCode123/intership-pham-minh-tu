import { InodeMediaVariant, Iproduct, IselectOption } from "interfaces/product";
import _ from "lodash";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

type UserContextType = {
  products: Iproduct | null;
  setProducts: (v: Iproduct) => void;
  pickedVariant: InodeMediaVariant | undefined;
  setPickedVarant: (v: InodeMediaVariant) => void;
  openModalUpdateProduct: () => void;
  closeModalUpdateProduct: () => void;
  modalOpen: boolean;
  handleSetOption: (v: Iselect[]) => void;
  options: Iselect[];
  handleSelectChange: (value: string) => void;
  selected: string;
  listVariants: Record<string, any>;
  setListVariants: (v: Record<string, any>) => void;
  onclickChangeVariant: (key: string, value: string) => void;
  isClickChangeVariant: boolean;
  setIsClickChangeVariant: (v: boolean) => void;
};
export interface Iselect {
  label: string;
  value: string;
}
export const ProductContext = createContext<UserContextType | undefined>(
  undefined,
);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Iproduct | null>(null);
  const [pickedVariant, setPickedVarant] = useState<InodeMediaVariant>();
  const [modalOpen, setModalOpen] = useState(false);
  const [options, setOptions] = useState<Iselect[]>([]);
  const [selected, setSelected] = useState("");
  const [listVariants, setListVariants] = useState<Record<string, any>>({});
  const [isClickChangeVariant, setIsClickChangeVariant] = useState(false);
  const handleSelectChange = useCallback(
    (value: string) => {
      const cloneArr = _.cloneDeep(pickedVariant) as InodeMediaVariant;
      if (!cloneArr) return;
      const {
        node: {
          inventoryItem: {
            inventoryLevels: { edges },
          },
        },
      } = cloneArr;
      const isgetQUantity = edges.find(
        (item) => item.node.location.id === value,
      );

      if (isgetQUantity) {
        const quantity = isgetQUantity.node.quantities[0].quantity;
        cloneArr.node.currentInventoryQuantity = quantity;
        setPickedVarant(cloneArr);
      }
      console.log(isgetQUantity);
      setSelected(value);
    },
    [pickedVariant],
  );
  const handleSetOption = (v: Iselect[]) => {
    setOptions([...v]);
  };
  const openModalUpdateProduct = () => {
    setModalOpen(true);
  };
  const closeModalUpdateProduct = () => {
    setModalOpen(false);
  };

  const onclickChangeVariant = (key: string, value: string) => {
    setListVariants((prev) => ({
      ...prev,
      [key]: value,
    }));
    setIsClickChangeVariant(!isClickChangeVariant);
  };
  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        pickedVariant,
        setPickedVarant,
        openModalUpdateProduct,
        closeModalUpdateProduct,
        modalOpen,
        handleSetOption,
        options,
        handleSelectChange,
        selected,
        listVariants,
        setListVariants,
        onclickChangeVariant,
        isClickChangeVariant,
        setIsClickChangeVariant,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
