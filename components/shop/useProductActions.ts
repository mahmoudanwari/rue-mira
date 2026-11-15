"use client";

import { useI18n } from "@/lib/i18n/client";
import { useShop, useUI } from "@/lib/store";

/** Shared add-to-bag / wishlist / compare behaviour with screen-reader announcements. */
export function useProductActions() {
  const { t, fill } = useI18n();
  const shop = useShop();
  const ui = useUI();

  const add = (productId: string, size: string, qty = 1) => {
    const p = shop.productById(productId);
    const added = shop.addToCart(productId, size, qty);
    if (added > 0 && p) {
      ui.notifyAdded(productId, size);
      ui.announce(`${t.common.addedToBag}: ${p.copy.name}${size !== "One Size" ? `, ${size}` : ""}`);
    } else if (p) {
      ui.announce(t.bag.adjustedStock);
    }
    return added;
  };

  const toggleWishlist = (productId: string) => {
    const p = shop.productById(productId);
    const was = shop.wishlist.includes(productId);
    shop.toggleWishlist(productId);
    if (p) ui.announce(`${was ? t.common.wishlistRemove : t.common.wishlistAdd}: ${p.copy.name}`);
  };

  const toggleCompare = (productId: string) => {
    const p = shop.productById(productId);
    const was = shop.compare.includes(productId);
    const ok = shop.toggleCompare(productId);
    if (!ok) ui.announce(t.compare.max);
    else if (p) ui.announce(`${was ? t.common.compareRemove : t.common.compareAdd}: ${p.copy.name}`);
    return ok;
  };

  return { add, toggleWishlist, toggleCompare, fill };
}
