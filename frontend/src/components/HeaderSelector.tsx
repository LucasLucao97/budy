"use client";

import { usePathname } from "next/navigation";
import ChatbotHeader from "@/components/ChatbotHeader";
import DefaultHeader from "@/components/DefaultHeader";

const HeaderSelector = () => {
  const pathname = usePathname();
  const isChatbotPath = pathname === "/chatbot";
  
  return isChatbotPath ? <ChatbotHeader /> : <DefaultHeader />;
};

export default HeaderSelector;
