"use client";

import { motion } from "motion/react";
import type { Product } from "@/lib/catalog";
import { useShop } from "@/lib/store";
import { ProductCard } from "./ProductCard";

/** Responsive product grid with a delicate entry stagger. Hidden (Demo Studio) products are skipped. */
export function ProductGrid({
  products,
  columns = "grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
  priorityCount = 0,
  skipHidden = true,
}: {
  products: Product[];
  columns?: string;
  priorityCount?: number;
  skipHidden?: boolean;
}) {
  const shop = useShop();
  const list = skipHidden ? products.filter((p) => !(shop.productById(p.id)?.hidden ?? p.hidden)) : products;
  return (
    <ul className={`grid gap-x-3 gap-y-10 sm:gap-x-5 ${columns}`}>
      {list.map((p, i) => (
        <motion.li
          key={p.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -5% 0px" }}
          transition={{ duration: 0.6, delay: Math.min(i % 4, 3) * 0.07, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProductCard product={p} priority={i < priorityCount} />
        </motion.li>
      ))}
    </ul>
  );
}
