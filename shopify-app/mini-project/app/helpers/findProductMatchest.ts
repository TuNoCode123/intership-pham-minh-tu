import {
  InodeMediaVariant,
  InodeVariant,
  IselectOption,
} from "interfaces/product";

export function findBestMatchedVariant(
  selectedOptions: Record<string, string>,
  variants: InodeMediaVariant[],
) {
  // Sắp xếp các variant theo mức độ khớp giảm dần
  const sorted = [...variants].sort((a, b) => {
    const aMatch = countMatch(a.node.selectedOptions, selectedOptions);
    const bMatch = countMatch(b.node.selectedOptions, selectedOptions);
    return bMatch - aMatch; // nhiều match hơn thì lên đầu
  });

  return sorted[0] || null;
}

function countMatch(
  variantOptions: IselectOption[],
  selectedOptions: Record<string, string>,
) {
  const customObject = {} as any;
  variantOptions.map((item) => (customObject[item.name] = item.value));
  return Object.entries(selectedOptions).reduce((count, [key, value]) => {
    if (customObject[key] === value) {
      return count + 1;
    }
    return count;
  }, 0);
}
