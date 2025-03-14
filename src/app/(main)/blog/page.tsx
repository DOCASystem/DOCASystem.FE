import BlogList from "@/components/sections/blog/blog-list/blog-list";
import BlogHeader from "@/components/sections/blog/content-header/blog-header";

export default function BlogPage() {
  return (
    <div>
      <BlogHeader />
      <div className="container mx-auto px-4 py-6 md:py-10 lg:py-12">
        <BlogList />
      </div>
    </div>
  );
}
