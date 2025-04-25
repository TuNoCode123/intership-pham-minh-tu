import { useState } from "react";
import type { ItodoList } from "./interface";
import TodoList from "./todoList";

const CounterApp = () => {
  const [counter, setCounter] = useState(0);
  const [open, setOpen] = useState(true);

  const increase = () => {
    setCounter(counter + 1);
  };
  const decrease = () => {
    setCounter(counter - 1);
  };
  return (
    <>
      <div className="p-5">
        {" "}
        <div>
          <div className="flex justify-center items-center mt-5">
            <div>
              <div>
                <button
                  onClick={() => setOpen(!open)}
                  type="button"
                  className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  {open ? "Close" : "Open"}
                </button>
              </div>
              {open && (
                <>
                  <div className="relative w-96 h-80 bg-blue-300  rounded-2xl">
                    <div className=" text-white text-9xl w-fit mt-10 mx-auto">
                      {counter}
                    </div>
                    <div className=" absolute bottom-5 left-22">
                      <button
                        onClick={increase}
                        type="button"
                        className=" cursor-pointer focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:focus:ring-yellow-900"
                      >
                        Increase
                      </button>
                      <button
                        onClick={decrease}
                        type="button"
                        className="cursor-pointer focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
                      >
                        Decrease
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div>
          <div style={{ width: "90%", margin: "auto" }}>
            <div className=" text-6xl text-center mt-5 text-amber-500 font-bold">
              Your todo list
            </div>
            <div>
              <TodoList />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CounterApp;
