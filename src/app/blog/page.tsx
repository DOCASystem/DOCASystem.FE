import BlogList from "@/components/sections/blog/blog-list/blog-list";
import BlogHeader from "@/components/sections/blog/content-header/blog-header";

export default function BlogPage() {
  return (
    <div>
      <BlogHeader />
      <div className="my-10">
        <BlogList />
      </div>
    </div>
  );
}
