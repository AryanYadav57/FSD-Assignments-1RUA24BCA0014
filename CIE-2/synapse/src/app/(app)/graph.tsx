import React, { useEffect, useState } from 'react';
import { View, Text } from '@/tw';
import { useNotesStore } from '@/store/notesStore';
import { useRouter } from 'expo-router';
import GraphView from '@/components/GraphView';
import { NoteLink } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export default function GraphScreen() {
  const { notes } = useNotesStore();
  const router = useRouter();
  const [links, setLinks] = useState<NoteLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadLinks() {
      try {
        const { data, error } = await supabase
          .from('note_links')
          .select('*');
        
        if (data) setLinks(data);
      } catch (e) {
        console.error('Failed to load links', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadLinks();
  }, []);

  const activeNotes = notes.filter((n) => n.status !== 'trashed' && n.status !== 'archived');

  return (
    <View className="flex-1 bg-synapse-bg">
      <View className="p-8 pb-4">
        <Text className="font-serif text-4xl text-synapse-text mb-2">
          Knowledge Graph
        </Text>
        <Text className="font-sans text-base text-synapse-text-muted">
          Visualize connections between your ideas.
        </Text>
      </View>
      
      <View className="flex-1 rounded-2xl overflow-hidden m-8 mt-0 border border-synapse-border bg-synapse-surface">
        {!isLoading && (
          <GraphView
            notes={activeNotes}
            links={links}
            onNodeClick={(id) => {
              router.push(`/(app)/note/${id}`);
            }}
          />
        )}
      </View>
    </View>
  );
}
