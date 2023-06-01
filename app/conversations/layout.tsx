import getConversations from "../actions/getConversations";
import SideBar from "../components/sidebar/SideBar";
import ConversationList from "./ConversationList";

export default async function ConversationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const conversations = await getConversations();

  return (
    // @ts-expect-error Server Component
    <SideBar>
      <div className="h-full">
        <ConversationList initialItem={conversations} />
        {children}
      </div>
    </SideBar>
  );
}