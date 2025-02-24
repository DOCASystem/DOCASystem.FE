import ShopHeader from "@/components/sections/shop/content-shop/shop-header";
import ProductFilter from "@/components/sections/shop/product-filter/filter/product-filter";
import ProductList from "@/components/sections/shop/product-list/product-list";

export default function ShopPage() {
  return (
    <div>
      <ShopHeader />
      <div className="container mx-auto py-10">
        <div className="flex flex-row gap-2">
          <ProductFilter />
          <ProductList />
        </div>
      </div>
    </div>
  );
}
