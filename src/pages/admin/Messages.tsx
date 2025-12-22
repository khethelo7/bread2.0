import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Mail, MailOpen } from 'lucide-react';
import { format } from 'date-fns';
import type { Tables } from '@/integrations/supabase/types';

type Message = Tables<'messages'>;

const Messages = () => {
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Message[];
    },
  });

  const markReadMutation = useMutation({
    mutationFn: async ({ id, is_read }: { id: string; is_read: boolean }) => {
      const { error } = await supabase
        .from('messages')
        .update({ is_read })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      queryClient.invalidateQueries({ queryKey: ['admin-message-count'] });
    },
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-pixel text-3xl text-foreground mb-2">Messages</h1>
          <p className="text-muted-foreground font-retro">Customer inquiries and feedback</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : messages?.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No messages yet
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages?.map((message) => (
              <Card key={message.id} className={message.is_read ? 'opacity-75' : ''}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {message.is_read ? (
                        <MailOpen className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <Mail className="h-5 w-5 text-primary" />
                      )}
                      <div>
                        <CardTitle className="font-retro text-lg">{message.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{message.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {!message.is_read && (
                        <Badge className="mb-1">New</Badge>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(message.created_at), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {message.subject && (
                    <p className="font-semibold mb-2">{message.subject}</p>
                  )}
                  <p className="text-muted-foreground whitespace-pre-wrap">{message.message}</p>
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        markReadMutation.mutate({ id: message.id, is_read: !message.is_read })
                      }
                    >
                      Mark as {message.is_read ? 'Unread' : 'Read'}
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`mailto:${message.email}`}>Reply</a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Messages;
