import type { ShoppingList } from "@/lib/types";

export function formatShoppingListForCopy(shoppingList: ShoppingList): string {
  const lines: string[] = [];

  // Only copy color codes and names
  shoppingList.bySection.forEach((section) => {
    section.colors.forEach((color) => {
      lines.push(`${color.code} - ${color.name}`);
    });
  });

  return lines.join("\n");
}
