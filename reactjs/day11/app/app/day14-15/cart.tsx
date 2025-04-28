import { useEffect, useState } from "react";
import type { ICart } from "./interface";
import useCart from "./hooks/useCart";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";

const Cart = () => {
  const {
    cart,
    setCart,
    totalPrice,
    deleteOneItemFromCart,
    deleteSelectedItem,
  } = useCart();

  const handleQuantityChange = (id: number, newQuantity: number) => {
    const cloneCart = JSON.parse(JSON.stringify(cart)) as ICart[];
    const findItem = cloneCart.find((item: ICart) => item.id === id);
    if (findItem) {
      findItem.quantity += newQuantity;
      if (findItem.quantity <= 0) {
        deleteOneItemFromCart(id);
        return;
      }
      const findItemIndex = cloneCart.findIndex(
        (item: ICart) => item.id === id
      );
      cloneCart[findItemIndex] = findItem;
      setCart(cloneCart);
    }
    //   updateQuantity(id, newQuantity);
  };
  const [selectItems, setSelectItems] = useState<{ id: number }[]>([]);
  const handleSelectAll = async () => {
    if (selectItems.length === cart.length) {
      setSelectItems([]);
      return;
    }
    const listId: { id: number }[] = [];
    cart.map((c) => {
      listId.push({ id: c.id });
    });
    setSelectItems([...selectItems, ...listId]);
  };
  const handleCheckboxChange = (id: number) => {
    const cloneSlect = JSON.parse(JSON.stringify(selectItems)) as {
      id: number;
    }[];
    const findItemIndex = cloneSlect.findIndex((item) => item.id === id);
    if (findItemIndex >= 0) {
      cloneSlect.splice(findItemIndex, 1);
      setSelectItems(cloneSlect);
      return;
    }
    setSelectItems([...cloneSlect, { id }]);
  };
  const onlickDeleteSelectedItem = () => {
    deleteSelectedItem(selectItems);
    setSelectItems([]);
  };
  return (
    <div className="flex flex-col p-6 sm:p-8 max-w-8xl mx-auto">
      <span className="mb-5 text-2xl underline text-blue-600 cursor-pointer">
        <Link to={"/day14-15"}> Back</Link>
      </span>
      <div className="w-full overflow-x-auto shadow-lg rounded-xl">
        <table className="min-w-full divide-y divide-gray-300 bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider sm:px-8"
              >
                <input
                  type="checkbox"
                  checked={
                    selectItems.length === cart.length && cart.length > 0
                  }
                  onChange={handleSelectAll}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  aria-label="Select all items"
                />
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider sm:px-8"
              >
                Id
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider sm:px-8"
              >
                Image
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider sm:px-8"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider sm:px-8"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-right text-sm font-medium text-gray-600 uppercase tracking-wider sm:px-8"
              >
                Quantity
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-right text-sm font-medium text-gray-600 uppercase tracking-wider sm:px-8"
              >
                Total Price
              </th>
              <th
                scope="col"
                className="px-6 py-4 text-right text-sm font-medium text-gray-600 uppercase tracking-wider sm:px-8"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {cart.length > 0 ? (
              cart.map((c, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-100 transition-colors duration-200"
                >
                  <td className="px-6 py-5 whitespace-nowrap text-base text-gray-700 sm:px-8">
                    <input
                      type="checkbox"
                      checked={selectItems.some((item) => item.id == c.id)}
                      onChange={() => handleCheckboxChange(c.id)}
                      className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      aria-label={`Select item ${c.title}`}
                    />
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-2xl text-gray-700 sm:px-8">
                    {c.id}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-base text-gray-700 sm:px-8">
                    <img
                      src={c.image}
                      alt={c.title}
                      className="h-16 w-16 object-contain rounded-md"
                    />
                  </td>
                  <td className="px-6 py-5 text-2xl text-gray-700 sm:px-8 max-w-sm truncate">
                    {c.title}
                  </td>
                  <td className="px-6 py-5  whitespace-nowrap text-2xl text-gray-700 sm:px-8">
                    ${Number(c.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-base text-gray-700 text-right sm:px-8">
                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => handleQuantityChange(c.id, -1)}
                        className="p-3 rounded-l-md bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-200"
                        aria-label="Decrease quantity"
                      >
                        <FontAwesomeIcon
                          icon={faMinus}
                          className="h-4 w-4 text-gray-700"
                        />
                      </button>
                      <input
                        type="number"
                        value={c.quantity}
                        className="w-16 text-center border-t border-b border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 py-2 text-base"
                        aria-label="Quantity"
                      />
                      <button
                        onClick={() => handleQuantityChange(c.id, 1)}
                        className="p-3 rounded-r-md bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
                        aria-label="Increase quantity"
                      >
                        <FontAwesomeIcon
                          icon={faPlus}
                          className="h-4 w-4 text-gray-700"
                        />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-2xl text-gray-700 text-right sm:px-8">
                    ${Number(c.price * c.quantity).toFixed(2)}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right text-base sm:px-8">
                    <FontAwesomeIcon
                      onClick={() => deleteOneItemFromCart(c.id)}
                      icon={faTrash}
                      className="h-6 w-6 text-red-600 hover:text-red-800 cursor-pointer transition-colors duration-200"
                      aria-label="Delete item"
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-base text-gray-600 sm:px-8"
                >
                  Your cart is empty
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-6 text-6xl gap-6">
        Total Price:
        <span className="underline text-blue-600">{totalPrice.toFixed(2)}</span>
      </div>
      {selectItems.length > 0 && (
        <div>
          <button
            onClick={onlickDeleteSelectedItem}
            type="button"
            className="cursor-pointer text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-medium rounded-lg text-base px-6 py-3 text-center me-2 mb-2"
          >
            Delete Selected Items
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
