"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type PackageType = "pack" | "block";

interface ProductViewContextType {
  packageType: PackageType;
  setPackageType: (type: PackageType) => void;
}

const ProductViewContext = createContext<ProductViewContextType | null>(null);

export const ProductViewProvider = ({ children }: { children: ReactNode }) => {
  const [packageType, setPackageType] = useState<PackageType>("pack");
  return (
    <ProductViewContext.Provider value={{ packageType, setPackageType }}>
      {children}
    </ProductViewContext.Provider>
  );
};

export const useProductView = () => {
  const ctx = useContext(ProductViewContext);
  if (!ctx)
    throw new Error("useProductView must be used within ProductViewProvider");
  return ctx;
};
