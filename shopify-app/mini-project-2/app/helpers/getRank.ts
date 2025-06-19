export const getRank = (
  totolSpent: number,
  listRank: {
    id: number;
    min_spent: number;
  }[],
  currentRankId: number,
) => {
  const ArrSort = listRank.sort((a, b) => a.min_spent - b.min_spent);
  let fag = 0;
  for (let i = 0; i < ArrSort.length; i++) {
    if (ArrSort[fag].min_spent <= totolSpent) {
      fag = i;
    }
  }
  return ArrSort[fag].id != currentRankId ? ArrSort[fag] : null;
};
export const getGreaterRank = (
  totolSpent: number,
  listRank: {
    id: number;
    min_spent: number;
  }[],
  currentRankId: number,
) => {
  const ArrSort = listRank.sort((a, b) => a.min_spent - b.min_spent);

  let fag = -1;
  for (let i = 0; i < ArrSort.length; i++) {
    if (ArrSort[i].min_spent > totolSpent) {
      fag = i;
      break;
    }
  }
  if (fag == -1) return null;

  return ArrSort[fag].id != currentRankId ? ArrSort[fag] : null;
};
