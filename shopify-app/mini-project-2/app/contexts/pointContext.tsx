// import pointService from "app/services/point-service";
import { POINT } from "app/constrant/enum";
import { getSocket } from "app/helpers/socket";
import { CustomerRanking } from "app/interfaces/point";
import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
export interface IearnPoint {
  moneyAmount: number;
  condition: number;
  id?: number;
}
export interface IspendPoint {
  moneyAmount: number;
  pointNumber: number;
  id?: number;
}
type UserContextType = {
  modalOpenEarn: boolean;
  setModalOpenEarn: (v: boolean) => void;
  earnPoint: IearnPoint;
  setEarnPoint: (v: IearnPoint) => void;
  title: string;
  setTitle: (v: string) => void;
  spendPoint: IspendPoint;
  setSpendPoint: (v: IspendPoint) => void;
  modalOpenSpend: boolean;
  setModalOpenSpend: (v: boolean) => void;
  modalOpenUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  selectedCustomer:
    | {
        id: number;
        totalPoints: number;
        rankId: number;
      }
    | undefined;
  setSelectedCustomer: (v: {
    id: number;
    totalPoints: number;
    rankId: number;
  }) => void;
  rankingCustomer: CustomerRanking | undefined;
  setRakingCustomer: (v: CustomerRanking) => void;
  err: {
    tierName: string;
    pointRate: string;
    min_spent: string;
  };
  setErr: (v: {
    tierName: string;
    pointRate: string;
    min_spent: string;
  }) => void;
  openModalUpdateRank: boolean;
  setOpenModalUpdateRank: (v: boolean) => void;
};
// type Action = { type: "increment" } | { type: "decrement" } | { type: "reset" };
// type State = {
//   MoneyAmount: number;
//   Condition: number;
// };
const initialState = { count: 0 };

// function reducer(state: State, action: Action): State {
//   switch (action.type) {
//     // case "increment":
//     //   return { count: state.count + 1 };
//     // case "decrement":
//     //   return { count: state.count - 1 };
//     // case "reset":
//     //   return initialState;
//     default:
//       return state;
//   }
// }
export const PointContext = createContext<UserContextType | undefined>(
  undefined,
);

export const PointProvider = ({ children }: { children: ReactNode }) => {
  //   const [state, dispatch] = useReducer(reducer, initialState);
  // const [socket, setSocket] = useState<any>();
  const [modalOpenEarn, setModalOpenEarn] = useState(false);
  const [modalOpenSpend, setModalOpenSpend] = useState(false);
  const [modalOpenUpdate, setOpenModalUpdate] = useState(false);
  const [openModalUpdateRank, setOpenModalUpdateRank] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<{
    id: number;
    totalPoints: number;
    rankId: number;
  }>();
  const [earnPoint, setEarnPoint] = useState<IearnPoint>({
    moneyAmount: 0,
    condition: 0,
  });

  const [err, setErr] = useState({
    tierName: "",
    pointRate: "",
    min_spent: "",
  });
  const [rankingCustomer, setRakingCustomer] = useState<CustomerRanking>();
  const [spendPoint, setSpendPoint] = useState<IspendPoint>({
    moneyAmount: 0,
    pointNumber: 0,
  });
  const [title, setTitle] = useState<string>(POINT.ADD);

  return (
    <PointContext.Provider
      value={{
        modalOpenEarn,
        setModalOpenEarn,
        earnPoint,
        setEarnPoint,
        title,
        setTitle,
        spendPoint,
        setSpendPoint,
        modalOpenSpend,
        setModalOpenSpend,
        modalOpenUpdate,
        setOpenModalUpdate,
        selectedCustomer,
        setSelectedCustomer,
        rankingCustomer,
        setRakingCustomer,
        err,
        setErr,
        openModalUpdateRank,
        setOpenModalUpdateRank,
      }}
    >
      {children}
    </PointContext.Provider>
  );
};
