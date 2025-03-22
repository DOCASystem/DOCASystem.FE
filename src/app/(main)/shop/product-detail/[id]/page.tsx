import ProductDetailView from "@/components/sections/shop/product-detail/view/product-detail-view";
interface ProductDetailViewProps {
  params: { id: string };
}

export default function ProductDetailPage({ params }: ProductDetailViewProps) {
  return <ProductDetailView productId={params.id} />;
}
