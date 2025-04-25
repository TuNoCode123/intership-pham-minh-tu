import type { IProduct } from "./interface";

const Product = ({
  item,
  addTocart,
}: {
  item: IProduct;
  addTocart: (id: number) => void;
}) => {
  return (
    <div className="p-2 bg-amber-400 rounded-sm">
      <div>
        <span className="text-white">Title:</span> {item.name}
      </div>
      <div>
        <span className="text-white">Price:</span>
        <span className=" text-2xl text-cyan-700">{item.price}</span>
      </div>
      <div className="flex justify-end cursor-pointer">
        <div
          className="p-2 rounded-2xl bg-blue-600 w-fit text-white"
          onClick={() => addTocart(item.id)}
        >
          Add to cart
        </div>
      </div>
    </div>
  );
};

export default Product;
