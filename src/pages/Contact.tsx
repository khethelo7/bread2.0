import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("messages").insert({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      if (error) throw error;

      toast({
        title: "Message sent!",
        description: "We'll get back to you soon.",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 md:py-20 gradient-blue relative">
        <div className="absolute inset-0 scanlines" />
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="font-pixel text-2xl md:text-4xl text-secondary-foreground text-center mb-4">
            CONTACT US
          </h1>
          <p className="font-retro text-xl md:text-2xl text-secondary-foreground/80 text-center">
            Got questions? We'd love to hear from you
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="font-pixel text-lg text-foreground mb-6">
                SEND A MESSAGE
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="font-retro text-lg text-foreground block mb-2"
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="font-retro text-lg border-2 border-bread-black focus:ring-primary py-3"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="font-retro text-lg text-foreground block mb-2"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="font-retro text-lg border-2 border-bread-black focus:ring-primary py-3"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="font-retro text-lg text-foreground block mb-2"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="font-retro text-lg border-2 border-bread-black focus:ring-primary py-3"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="font-retro text-lg text-foreground block mb-2"
                  >
                    Message
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    required
                    rows={6}
                    className="font-retro text-lg border-2 border-bread-black focus:ring-primary resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full font-pixel text-sm bg-primary text-primary-foreground py-6 retro-shadow hover-lift"
                >
                  {isSubmitting ? (
                    "SENDING..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      SEND MESSAGE
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="font-pixel text-lg text-foreground mb-6">
                GET IN TOUCH
              </h2>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-primary p-3">
                    <Mail className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-pixel text-xs text-foreground mb-1">
                      EMAIL
                    </h3>
                    <p className="font-retro text-xl text-muted-foreground">
                      hello@bread.style
                    </p>
                    <p className="font-retro text-lg text-muted-foreground/70">
                      We reply within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-secondary p-3">
                    <MapPin className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-pixel text-xs text-foreground mb-1">
                      LOCATION
                    </h3>
                    <p className="font-retro text-xl text-muted-foreground">
                      Los Angeles, CA
                    </p>
                    <p className="font-retro text-lg text-muted-foreground/70">
                      Shipping worldwide
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-accent p-3">
                    <Phone className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-pixel text-xs text-foreground mb-1">
                      SUPPORT
                    </h3>
                    <p className="font-retro text-xl text-muted-foreground">
                      Mon - Fri, 9am - 5pm PST
                    </p>
                    <p className="font-retro text-lg text-muted-foreground/70">
                      Discord support available
                    </p>
                  </div>
                </div>
              </div>

              {/* FAQ Preview */}
              <div className="mt-12 bg-muted pixel-border p-6">
                <h3 className="font-pixel text-sm text-foreground mb-4">
                  COMMON QUESTIONS
                </h3>
                <ul className="space-y-3 font-retro text-lg text-muted-foreground">
                  <li>• Shipping takes 3-7 business days</li>
                  <li>• Free returns within 30 days</li>
                  <li>• All sizes are true to fit</li>
                  <li>• We accept all major credit cards</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
