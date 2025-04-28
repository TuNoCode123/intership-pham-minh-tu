import { useEffect, useState } from "react";

const AppDay13 = () => {
  const [users, setUsers] = useState<any>([]);
  const getListuser = async () => {
    const url = "https://jsonplaceholder.typicode.com/users";
    const body = {
      method: "GET", // hoặc 'POST', 'PUT', tùy API
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await fetch(url, body);
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    } else {
      return <>Api error</>;
    }
  };
  useEffect(() => {
    getListuser();
  }, []);
  return (
    <>
      <div className="container p-5 text-3xl grid grid-cols-3 gap-4">
        {users.length > 0 &&
          users?.map((u: any, index: number) => {
            return (
              <div key={index} className="mt-3 border-2 rounded-2xl  p-3">
                <div>{u?.name}</div>
                <div>{u?.phone}</div>
                <div>{u?.email}</div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default AppDay13;
