import { useState } from "react";
import type { ItodoList } from "./interface";
import { v4 as uuidv4 } from "uuid";
const TodoList = () => {
  const [todoList, setTodoList] = useState<ItodoList[]>([]);
  const [input, setInput] = useState<string>("");
  const [err, setErr] = useState("");
  const addTasks = () => {
    if (input == "") {
      return setErr("input is empty");
    }
    const targetTodo = {
      id: uuidv4(),
      description: input,
    };
    setTodoList([...todoList, targetTodo]);
    setInput("");
  };
  const updateTask = (event: any, id: string) => {
    const findIndex = todoList.findIndex((item) => item.id == id);
    const value = event?.target?.value;
    if (!value || value == "") {
      return setErr("input is empty");
    }

    if (findIndex >= 0) {
      todoList[findIndex].description = value;
      setTodoList([...todoList]);
      setErr("");
    }
  };
  const deleteTask = (id: string) => {
    const newArr = todoList.filter((item) => item.id != id);
    if (newArr.length > 0) {
      setTodoList(newArr);
    }
  };
  return (
    <>
      <div className="w-fit mt-10 mx-auto p-10 h-fit bg-emerald-400 rounded-2xl">
        {err != "" && <div className=" text-4xl text-red-500">{err}</div>}
        <div className="flex gap-5">
          <div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              type="text"
              id="first_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Enter your Task"
              required
            />
          </div>
          <div>
            <button
              onClick={addTasks}
              type="button"
              className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
              Submit
            </button>
          </div>
        </div>
        <div>
          {todoList.length > 0 ? (
            <>
              {todoList.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="p-2 rounded-xl  mt-2 flex gap-5 items-center"
                  >
                    <input
                      onChange={(e) => updateTask(e, item.id)}
                      value={item.description}
                      className=" bg-black text-white p-3 rounded-2xl"
                    />
                    <div>
                      <span
                        onClick={() => deleteTask(item.id)}
                        className=" text-4xl font-bold cursor-pointer text-red-500"
                      >
                        X
                      </span>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>None</>
          )}
        </div>
      </div>
    </>
  );
};

export default TodoList;
