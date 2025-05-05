import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router";
import useCart from "../hooks/useCart";
import { ActionTypes } from "../contexts/cartContext";

const Cart = () => {
  // const { cart, totalPrice, removeItemFromCart } = useCart();
  const { state, dispatch, totalPrice } = useCart();
  const { cart } = state;

  return (
    <>
      <span className="mb-5 text-2xl underline text-red-500 cursor-pointer">
        <Link to={"/day17"}> Back</Link>
      </span>
      <div className="flex flex-col p-6 sm:p-8 max-w-8xl mx-auto">
        <div className="w-full overflow-x-auto shadow-lg rounded-xl">
          <table className="min-w-full divide-y divide-gray-300 bg-white">
            <thead className="bg-gray-100">
              <tr>
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
                    <td className="px-6 py-5 whitespace-nowrap text-2xl text-gray-700 sm:px-8">
                      {c.id}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-base text-gray-700 sm:px-8">
                      <img
                        src={c.image}
                        alt={c.title ?? c.name}
                        className="h-16 w-16 object-contain rounded-md"
                      />
                    </td>
                    <td className="px-6 py-5 text-2xl text-gray-700 sm:px-8 max-w-sm truncate">
                      {c.title ?? c.name}
                    </td>
                    <td className="px-6 py-5  whitespace-nowrap text-2xl text-gray-700 sm:px-8">
                      ${Number(c.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-5 text-2xl text-gray-700 sm:px-8 max-w-sm text-right">
                      {c.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-2xl text-gray-700 text-right sm:px-8">
                      ${Number(c.price * c.quantity).toFixed(2)}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right text-base sm:px-8">
                      <FontAwesomeIcon
                        onClick={() =>
                          dispatch({
                            type: ActionTypes.REMOVE_ITEM,
                            payload: c?.id,
                          })
                        }
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
          <span className="underline text-blue-600">
            {totalPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </>
  );
};

export default Cart;
