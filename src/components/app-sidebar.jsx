"use client";

import {
  HeartHandshake,
  LayoutDashboard,
  Megaphone,
  UserCog,
  Users,
  Wallet,
} from "lucide-react";

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

const navMain = {
  admin: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
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
          url: "/admin/campaigns",
        },
      ],
    },
    {
      title: "Campaigners",
      url: "#",
      icon: UserCog,
      items: [
        {
          title: "Create Campaigner",
          url: "/admin/create-campaigner",
        },
        {
          title: "All Campaigners",
          url: "/admin/campaigners",
        },
        {
          title: "Registration Requests",
          url: "/admin/campaigner/registrations",
        },
      ],
    },
    {
      title: "Sevas",
      url: "#",
      icon: HeartHandshake,
      items: [
        {
          title: "Add Seva",
          url: "/admin/add-seva",
        },
        {
          title: "All Sevas",
          url: "/admin/seva-list",
        },
      ],
    },
    {
      title: "Devotees",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Add Devotee",
          url: "/admin/add-devotee",
        },
        {
          title: "All Devotees",
          url: "/admin/devotees",
        },
      ],
    },
    {
      title: "Funders",
      url: "/admin/funders",
      icon: Wallet,
    },
  ],
  devotee: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Donors",
      url: "/admin/funders",
      icon: Wallet,
    },
    {
      title: "Campaigners",
      url: "#",
      icon: UserCog,
      items: [
        {
          title: "Create Campaigner",
          url: "/admin/create-campaigner",
        },
        {
          title: "All Campaigners",
          url: "/admin/campaigners",
        },
        {
          title: "Registration Requests",
          url: "/admin/campaigner/registrations",
        },
      ],
    },
  ],
};

export function AppSidebar({ loading, ...props }) {
  const { state } = useSidebar();

  if (loading) {
    return (
      <Sidebar collapsible="icon" {...props}>
        <SidebarHeader>
          <div className="flex items-center justify-center p-3">
            <div className="w-16 h-16 rounded-md bg-gray-200 animate-pulse" />
          </div>
        </SidebarHeader>

        <SidebarContent>
          <div className="space-y-3 p-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </SidebarContent>

        <SidebarFooter>
          <div className="p-4">
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </SidebarFooter>
      </Sidebar>
    );
  }

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
        <NavMain items={navMain?.[props?.details?.role]} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={props?.details} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
