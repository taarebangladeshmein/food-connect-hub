import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Heart, Building2, Truck, Loader2 } from "lucide-react";

const SelectRole = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUserId(user.id);

    // Check if user already has a role
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleData?.role) {
      navigate(`/dashboard/${roleData.role}`);
    }
  };

  const selectRole = async (role: "donor" | "ngo" | "volunteer") => {
    if (!userId) return;
    
    setLoading(true);

    try {
      // Insert role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role });

      if (roleError) throw roleError;

      // Create role-specific profile if needed
      if (role === "ngo") {
        const { error: ngoError } = await supabase
          .from("ngo_profiles")
          .insert({ 
            user_id: userId, 
            organization_name: "My Organization" 
          });
        if (ngoError) throw ngoError;
      } else if (role === "volunteer") {
        const { error: volError } = await supabase
          .from("volunteer_profiles")
          .insert({ user_id: userId });
        if (volError) throw volError;
      }

      toast.success(`Welcome as a ${role}!`);
      navigate(`/dashboard/${role}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to set role");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      id: "donor",
      title: "Food Donor",
      description: "Share surplus food from restaurants, events, or home",
      icon: Heart,
      color: "from-primary to-primary/80"
    },
    {
      id: "ngo",
      title: "NGO / Organization",
      description: "Collect and distribute food to communities in need",
      icon: Building2,
      color: "from-accent to-accent/80"
    },
    {
      id: "volunteer",
      title: "Volunteer Driver",
      description: "Help transport food from donors to NGOs",
      icon: Truck,
      color: "from-info to-info/80"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Role</h1>
          <p className="text-xl text-muted-foreground">
            How would you like to contribute to fighting hunger?
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card 
              key={role.id}
              className="hover:shadow-xl transition-all border-2 hover:border-primary"
            >
              <CardHeader>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 mx-auto`}>
                  <role.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-center text-2xl">{role.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-center text-base">
                  {role.description}
                </CardDescription>
                <Button 
                  className="w-full"
                  onClick={() => selectRole(role.id as any)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    `Continue as ${role.title}`
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SelectRole;
