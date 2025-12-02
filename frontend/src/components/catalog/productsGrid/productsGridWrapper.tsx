// components/catalog/productsGrid/productsGridWrapper.tsx
export default function ProductsGridSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-gray-200 rounded-lg h-80"></div>
        ))}
      </div>
    </div>
  );
}
