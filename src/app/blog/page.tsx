import BlogHeader from "@/components/sections/blog/content-header/blog-header";
import Image from "next/image";

export default function BlogPage() {
  return (
    <div>
      <BlogHeader />
      <Image src="/images/wait-me.webp" alt={""} width={2000} height={1000} />
    </div>
  );
}
