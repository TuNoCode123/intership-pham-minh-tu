import type { IProduct } from "./interface";

const Cart = ({
  item,
  deleteItemCart,
  handleChangeQuantity,
}: {
  item: (IProduct & { quantity?: number })[];
  deleteItemCart: (id: number) => void;
  handleChangeQuantity: (id: number) => void;
}) => {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Id
            </th>
            <th scope="col" className="px-6 py-3">
              Product name
            </th>
            <th scope="col" className="px-6 py-3">
              Price
            </th>
            <th scope="col" className="px-6 py-3">
              Quantity
            </th>
            <th scope="col" className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {item?.map((c) => {
            return (
              <>
                <tr
                  key={c.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {c.id}
                  </th>
                  <td className="px-6 py-4">{c.name}</td>
                  <td className="px-6 py-4">{c.price}</td>
                  <td className="px-6 py-4">
                    {" "}
                    <input
                      id="quantity"
                      type="number"
                      value={c?.quantity}
                      onChange={(e) => handleChangeQuantity(c.id)}
                      min={0}
                      step={1}
                    />
                    {/* {c?.quantity} */}
                  </td>
                  <td className="px-6 py-4 flex gap-5 ">
                    <span
                      className="underline cursor-pointer text-red-500"
                      onClick={() => deleteItemCart(c.id)}
                    >
                      delete
                    </span>
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Cart;
