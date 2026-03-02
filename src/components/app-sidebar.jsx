"use client";

import { HeartHandshake, Megaphone, Users, Wallet } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Campaigns",
      url: "#",
      icon: Megaphone,
      items: [
        {
          title: "Create Campaign",
          url: "/admin/create-campaign",
        },
        {
          title: "All Campaigns",
          url: "#",
        },
      ],
    },
    {
      title: "Campaigners",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Create Campaigner",
          url: "/admin/create-campaigner",
        },
        {
          title: "All Campaigners",
          url: "/admin/campaigners",
        },
      ],
    },
    {
      title: "Seva's",
      url: "#",
      icon: HeartHandshake,
      items: [
        {
          title: "Add Seva",
          url: "/admin/add-seva",
        },
        {
          title: "Seva List",
          url: "/admin/seva-list",
        },
      ],
    },
    {
      title: "Funders",
      url: "#",
      icon: Wallet,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-center p-3">
          {state === "expanded" ? (
            <img
              src="https://storage.googleapis.com/campaigners-images/Temple%20Images/hkm%20logo%20png%20-%20black%20font.jpg"
              alt="HKM Logo"
              className="w-auto h-20 object-cover"
            />
          ) : (
            <div className="w-9 h-9 shrink-0 flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold text-sm">
              HK
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
