import ShopHeader from "@/components/sections/shop/content-shop/shop-header";
import ShopFilter from "@/components/sections/shop/shop-filter/shop-filter";
import ShopList from "@/components/sections/shop/shop-list/shop-list";

export default function ShopPage() {
  return (
    <div>
      <ShopHeader />
      <div className="container mx-auto p-10">
        <ShopFilter />
        <ShopList />
      </div>
    </div>
  );
}
