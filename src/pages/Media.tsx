import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/layout/Layout";

interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  category: string | null;
  is_featured: boolean | null;
}

const Media = () => {
  const { data: mediaItems, isLoading } = useQuery({
    queryKey: ["media"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("media")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as MediaItem[];
    },
  });

  const featuredItems = mediaItems?.filter((m) => m.is_featured);
  const galleryItems = mediaItems?.filter((m) => !m.is_featured);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 md:py-20 gradient-hero relative">
        <div className="absolute inset-0 scanlines" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-pixel text-2xl md:text-4xl text-primary-foreground text-center mb-4">
            MEDIA
          </h1>
          <p className="font-retro text-xl md:text-2xl text-primary-foreground/80 text-center">
            Lookbooks, campaigns, and community highlights
          </p>
        </div>
      </section>

      {/* Featured */}
      {featuredItems && featuredItems.length > 0 && (
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="font-pixel text-lg md:text-xl text-foreground mb-8">
              FEATURED
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-video overflow-hidden pixel-border retro-shadow"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bread-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="font-pixel text-sm text-bread-white mb-2">
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="font-retro text-lg text-bread-white/80">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {item.category && (
                    <div className="absolute top-4 left-4 bg-primary text-primary-foreground font-pixel text-xs px-3 py-1">
                      {item.category.toUpperCase()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="py-12 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-pixel text-lg md:text-xl text-foreground mb-8">
            GALLERY
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-muted-foreground/20 animate-pulse"
                />
              ))}
            </div>
          ) : galleryItems && galleryItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-square overflow-hidden pixel-border"
                >
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-bread-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                    <p className="font-pixel text-xs text-bread-white text-center px-4">
                      {item.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="font-pixel text-xl text-muted-foreground mb-4">
                NO MEDIA YET
              </p>
              <p className="font-retro text-lg text-muted-foreground">
                Check back soon for photos and lookbooks
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Community CTA */}
      <section className="py-16 bg-bread-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-pixel text-xl md:text-2xl text-bread-white mb-4">
            JOIN THE COMMUNITY
          </h2>
          <p className="font-retro text-xl text-bread-white/70 mb-8 max-w-xl mx-auto">
            Tag us @BREAD on social media to be featured in our gallery
          </p>
          <div className="flex justify-center gap-6">
            <a
              href="#"
              className="font-pixel text-sm text-primary hover:text-accent transition-colors"
            >
              INSTAGRAM
            </a>
            <a
              href="#"
              className="font-pixel text-sm text-primary hover:text-accent transition-colors"
            >
              TWITTER
            </a>
            <a
              href="#"
              className="font-pixel text-sm text-primary hover:text-accent transition-colors"
            >
              TIKTOK
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Media;
