import React from "react";

import { useEventStore } from "@/store/event-store";
import { CalendarCheck2, Globe, UserCog } from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

const useNavItems = () => {
  const { selectedEventId } = useEventStore();

  const defaultNavItems: NavItem[] = [
    {
      label: "Events",
      href: "/events",
      icon: <CalendarCheck2 className="w-6 h-6" />,
    },
    {
      label: "Global SSO",
      href: "/global-sso",
      icon: <Globe className="w-6 h-6" />,
    },
    {
      label: "User Management",
      // href: selectedEventId
      //   ? `/user-management?eventId=${selectedEventId}`
      //   : `/user-management`,
      href: "",
      icon: <UserCog className="w-6 h-6" />,
    },
  ];

  return defaultNavItems;
};

export default useNavItems;
