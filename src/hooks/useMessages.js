// hooks/useMessages.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../supabase";

// Returns the number of conversations that have at least one unread message for the given user.
export function useUnreadConversationsCount(user_id) {
  return useQuery({
    queryKey: ["unreadConversations", user_id],
    enabled: !!user_id,
    refetchInterval: 30000,
    queryFn: async () => {
      const { count, error } = await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true })
        .or(`buyer_id.eq.${user_id},seller_id.eq.${user_id}`)
        .gt("unread_count", 0);
      if (error) throw error;
      return count ?? 0;
    },
  });
}

// get all conversations for current user
export function useConversations(user_id) {
  return useQuery({
    queryKey: ["conversations", user_id],
    enabled: !!user_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("conversations")
        .select(
          `
      id,
      created_at,
      buyer_id,
      seller_id,
      listing_id,
      listings ( title, image_url ),
      buyer:profiles!conversations_buyer_id_fkey ( id, full_name, avatar_url ),
      seller:profiles!conversations_seller_id_fkey ( id, full_name, avatar_url )
    `,
        )
        .or(`buyer_id.eq.${user_id},seller_id.eq.${user_id}`);

      //   console.log("conversations:", data, error);
      if (error) throw error;
      return data;
    },
  });
}

// get messages for a conversation
export function useMessages(conversation_id) {
  return useQuery({
    queryKey: ["messages", conversation_id],
    enabled: !!conversation_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversation_id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data;
    },
    refetchInterval: 3000, // poll every 3 seconds for new messages
  });
}

// send a message
export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ conversation_id, sender_id, text }) => {
      const { data, error } = await supabase
        .from("messages")
        .insert({ conversation_id, sender_id, content: text })
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversation_id],
      });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

// Creates a conversation between buyer and seller, or returns the existing one.
// listing_id is optional — when null it finds/creates a direct conversation without a listing context.
export function useStartConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ buyer_id, seller_id, listing_id = null }) => {
      // Build the lookup query — use .is() for null listing_id, .eq() otherwise.
      const lookup = supabase
        .from("conversations")
        .select("id")
        .eq("buyer_id", buyer_id)
        .eq("seller_id", seller_id);

      const { data: existing } = await (listing_id
        ? lookup.eq("listing_id", listing_id)
        : lookup.is("listing_id", null)
      ).maybeSingle();

      if (existing) return existing;

      // No existing conversation — create a fresh one.
      const { data, error } = await supabase
        .from("conversations")
        .insert({ buyer_id, seller_id, listing_id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

// mark messages as read
export function useMarkMessagesRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ conversation_id, user_id }) => {
      const { error } = await supabase
        .from("messages")
        .update({ read: true })
        .eq("conversation_id", conversation_id)
        .neq("sender_id", user_id)
        .eq("read", false);
      if (error) throw error;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversation_id],
      });
    },
  });
}

// Delete messages

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (message_id) => {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", message_id);
      if (error) throw error;
    },
    onSuccess: (data, message_id, context) => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });
}

// delete conversation
export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (conversation_id) => {
      // messages cascade delete automatically
      const { error } = await supabase
        .from("conversations")
        .delete()
        .eq("id", conversation_id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
