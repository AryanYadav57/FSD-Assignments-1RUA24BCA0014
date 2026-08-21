import { DetailTemplate } from "@/components/site/detail-template";

type Params = {
  slug: string;
};

export default async function ProductDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  return (
    <DetailTemplate
      section="Store Product"
      title={slug.replaceAll("-", " ")}
      subtitle="Product detail scaffold with space for gallery, price options, quantity controls, and shipping details."
      meta={["Product", "Store", "Shippable"]}
      ctaLabel="Add To Cart"
    />
  );
}
