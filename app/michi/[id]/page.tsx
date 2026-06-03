import { supabase } from "@/app/admin/lib/supabase";
import CatDetailPage from "@/app/components/CatDetailPage";
import type { Metadata } from "next";

const SITE_URL = "https://michipacenos.vercel.app";

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;

  const { data: cat } = await supabase
    .from("cats")
    .select("name, description, image_url, age, color, gender")
    .eq("id", id)
    .single();

  if (!cat) return { title: "Michi no encontrado | Michi Paceños" };

  const title = `Adopta a ${cat.name} 🐱 | Michi Paceños`;
  const description =
    cat.description ??
    `${cat.name} es un${cat.gender === "hembra" ? "a" : ""} gat${cat.gender === "hembra" ? "a" : "o"} de ${cat.age} en busca de un hogar amoroso.`;
  const url = `${SITE_URL}/michi/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: "Michi Paceños",
      images: cat.image_url
        ? [{ url: cat.image_url, width: 800, height: 800, alt: cat.name }]
        : [],
      type: "website",
      locale: "es_MX",
    },
  };
}

export default function Page() {
  return <CatDetailPage />;
}
