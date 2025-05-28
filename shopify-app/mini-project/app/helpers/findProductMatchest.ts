import {
  InodeMediaVariant,
  InodeVariant,
  IselectOption,
} from "interfaces/product";

export function findBestMatchedVariant(
  selectedOptions: Record<string, string>,
  variants: InodeMediaVariant[],
) {
  const customSelectedOptionsArr = variants.map((item) => {
    return {
      selectedOptions: item.node.selectedOptions,
      id: item.node.id,
    };
  });
  let flag = -1;
  for (let i = 0; i < customSelectedOptionsArr.length; i++) {
    let cnt = 0;
    const lengthOptions = customSelectedOptionsArr[i].selectedOptions.length;
    for (let j = 0; j < lengthOptions; j++) {
      if (
        selectedOptions[customSelectedOptionsArr[i].selectedOptions[j].name] ===
        customSelectedOptionsArr[i].selectedOptions[j].value
      ) {
        cnt++;

        // selectedObject = customSelectedOptionsArr[i];
      }
    }
    console.log(cnt);
    if (cnt == lengthOptions) {
      flag = i;
      break;
    }
  }
  if (flag != -1) {
    return variants[flag];
  } else {
    return null;
  }
}

// function countMatch(
//   variantOptions: IselectOption[],
//   selectedOptions: Record<string, string>,
// ) {
//   const customObject = {} as any;
//   variantOptions.map((item) => (customObject[item.name] = item.value));
//   return Object.entries(selectedOptions).reduce((count, [key, value]) => {
//     if (customObject[key] === value) {
//       return count + 1;
//     }
//     return count;
//   }, 0);
// }
