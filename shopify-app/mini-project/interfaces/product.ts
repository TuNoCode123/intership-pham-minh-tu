interface IEdgeImage {
  node: {
    id: string;
    altText: string;
    originalSrc: string;
    transformedSrc: string;
  };
}
interface INodeProduct {
  id: string;
  title: string;
  handle: string;
  totalInventory: number;
  priceRangeV2: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: IEdgeImage[];
  };
  description: string;
}
interface InodeMedia {
  mediaContentType: "IMAGE" | "EXTERNAL_VIDEO";
  alt: string;
  image: {
    url: string;
  };
}
export interface IselectOption {
  name: string;
  value: string;
}
interface IinventoryLevels {
  edges: InodeInventoryLevels[];
}
interface Ilocation {
  quantities: [
    {
      quantity: number;
    },
  ];
  location: {
    id: string;
    name: string;
  };
}
export interface IchangeQuantity {
  delta: number;
}
interface InodeInventoryLevels {
  node: Ilocation;
}

interface IinventoryItem {
  id: string;
  inventoryLevels: IinventoryLevels;
}

export interface InodeVariant {
  selectedOptions: IselectOption[];
  price: string;
  compareAtPrice: string;
  media: Imedia;
  inventoryQuantity: string;
  id: string;
  inventoryItem: IinventoryItem;
  title: string;
  currentInventoryQuantity: number;
}
export interface InodeMediaVariant {
  node: InodeVariant;
  currencyCode?: string;
}
interface IedgeMedia {
  node: InodeMedia;
}
interface Imedia {
  edges: IedgeMedia[];
}
interface Icategory {
  fullName: string;
}
interface Ivariant {
  edges: InodeMediaVariant[];
}
export interface IproductDetail {
  title: string;
  category: Icategory;
  descriptionHtml: string;
  totalInventory: number;
  vendor: string;
  media: Imedia;
  variants: Ivariant;
}
interface IEdgeproduct {
  node: INodeProduct;
  cursor: string;
}
export interface IpageInfor {
  hasPreviousPage: false;
  startCursor: string;
  hasNextPage: true;
  endCursor: string;
}
export interface Iproduct {
  edges: IEdgeproduct[];
  pageInfo: IpageInfor;
}
interface Ishop {
  currencyCode: string;
}
export enum statePaginate {
  BEFORE = "before",
  AFTER = "after",
}
export interface IuserErrors {
  field: string[];
  message: string;
}
