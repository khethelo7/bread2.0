import { Gamepad2, Zap, Heart, Users } from "lucide-react";
import { Layout } from "@/components/layout/Layout";

const About = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-32 gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 scanlines" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-pixel text-3xl md:text-4xl text-primary-foreground mb-6">
              OUR STORY
            </h1>
            <p className="font-retro text-2xl md:text-3xl text-primary-foreground/90">
              Born from a love of pixels and fashion, BREAD brings the nostalgia of 
              retro gaming to modern streetwear.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-pixel text-xl md:text-2xl text-foreground mb-6">
                THE BEGINNING
              </h2>
              <div className="space-y-4 font-retro text-xl text-muted-foreground leading-relaxed">
                <p>
                  BREAD started in 2020 when a group of friends realized that their 
                  love for retro games and street fashion could create something unique.
                </p>
                <p>
                  We grew up mashing buttons on 8-bit consoles, staying up late to 
                  beat that final boss, and collecting memories in pixelated form.
                </p>
                <p>
                  Now, we channel that energy into every piece we create — from the 
                  bold graphics to the comfortable fits that let you game for hours.
                </p>
              </div>
            </div>
            <div className="aspect-square bg-bread-black pixel-border retro-shadow flex items-center justify-center">
              <Gamepad2 className="h-32 w-32 text-primary animate-float" />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="font-pixel text-xl md:text-2xl text-foreground text-center mb-12">
            WHAT WE STAND FOR
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card pixel-border retro-shadow p-8 text-center">
              <Zap className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="font-pixel text-sm text-card-foreground mb-3">
                QUALITY
              </h3>
              <p className="font-retro text-lg text-muted-foreground">
                Every piece is crafted with premium materials built to last through 
                countless gaming sessions.
              </p>
            </div>

            <div className="bg-card pixel-border retro-shadow p-8 text-center">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-pixel text-sm text-card-foreground mb-3">
                PASSION
              </h3>
              <p className="font-retro text-lg text-muted-foreground">
                We're gamers at heart. Every design comes from genuine love for 
                the games that shaped us.
              </p>
            </div>

            <div className="bg-card pixel-border retro-shadow p-8 text-center">
              <Users className="h-12 w-12 text-secondary mx-auto mb-4" />
              <h3 className="font-pixel text-sm text-card-foreground mb-3">
                COMMUNITY
              </h3>
              <p className="font-retro text-lg text-muted-foreground">
                We're building more than a brand — we're creating a home for gamers 
                who wear their passion proudly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-bread-black">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-pixel text-xl md:text-2xl text-bread-white mb-8">
              OUR MISSION
            </h2>
            <p className="font-retro text-2xl md:text-3xl text-bread-white/80 leading-relaxed">
              To create clothing that celebrates gaming culture while delivering 
              comfort and style for everyday wear. We believe fashion should be 
              fun, expressive, and unapologetically geeky.
            </p>
          </div>
        </div>
      </section>

      {/* Fun Facts */}
      <section className="py-20 gradient-blue relative">
        <div className="absolute inset-0 scanlines" />
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="font-pixel text-xl md:text-2xl text-secondary-foreground text-center mb-12">
            FUN FACTS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="font-pixel text-3xl md:text-4xl text-accent mb-2">
                10K+
              </p>
              <p className="font-retro text-lg text-secondary-foreground/80">
                Happy Gamers
              </p>
            </div>
            <div className="text-center">
              <p className="font-pixel text-3xl md:text-4xl text-accent mb-2">
                50+
              </p>
              <p className="font-retro text-lg text-secondary-foreground/80">
                Unique Designs
              </p>
            </div>
            <div className="text-center">
              <p className="font-pixel text-3xl md:text-4xl text-accent mb-2">
                8-BIT
              </p>
              <p className="font-retro text-lg text-secondary-foreground/80">
                Nostalgia Level
              </p>
            </div>
            <div className="text-center">
              <p className="font-pixel text-3xl md:text-4xl text-accent mb-2">
                100%
              </p>
              <p className="font-retro text-lg text-secondary-foreground/80">
                Player Approved
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
