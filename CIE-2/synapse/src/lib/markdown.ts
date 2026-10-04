import { JSONContent } from '@tiptap/core';

/**
 * Convert Tiptap JSON to Markdown string.
 * Handles all extensions used in TiptapEditor.tsx.
 */
export function tiptapJsonToMarkdown(doc: JSONContent): string {
  if (!doc || !doc.content) return '';
  return doc.content.map(nodeToMarkdown).join('\n');
}

function nodeToMarkdown(node: JSONContent, index?: number): string {
  switch (node.type) {
    case 'heading': {
      const level = node.attrs?.level ?? 1;
      const hashes = '#'.repeat(level);
      const text = inlineToMarkdown(node.content ?? []);
      return `${hashes} ${text}`;
    }

    case 'paragraph': {
      const text = inlineToMarkdown(node.content ?? []);
      return text || '';
    }

    case 'bulletList': {
      return (node.content ?? [])
        .map((item) => `- ${listItemContent(item)}`)
        .join('\n');
    }

    case 'orderedList': {
      return (node.content ?? [])
        .map((item, i) => `${i + 1}. ${listItemContent(item)}`)
        .join('\n');
    }

    case 'taskList': {
      return (node.content ?? [])
        .map((item) => {
          const checked = item.attrs?.checked ? 'x' : ' ';
          return `- [${checked}] ${listItemContent(item)}`;
        })
        .join('\n');
    }

    case 'blockquote': {
      const inner = (node.content ?? []).map(nodeToMarkdown).join('\n');
      return inner
        .split('\n')
        .map((line) => `> ${line}`)
        .join('\n');
    }

    case 'codeBlock': {
      const lang = node.attrs?.language ?? '';
      const code = (node.content ?? []).map((n) => n.text ?? '').join('');
      return `\`\`\`${lang}\n${code}\n\`\`\``;
    }

    case 'horizontalRule':
      return '---';

    case 'hardBreak':
      return '  \n';

    default:
      return inlineToMarkdown(node.content ?? []);
  }
}

function listItemContent(item: JSONContent): string {
  return (item.content ?? []).map(nodeToMarkdown).join('\n').trim();
}

function inlineToMarkdown(nodes: JSONContent[]): string {
  return nodes.map(inlineNodeToMarkdown).join('');
}

function inlineNodeToMarkdown(node: JSONContent): string {
  if (node.type === 'text') {
    let text = node.text ?? '';
    const marks = node.marks ?? [];

    for (const mark of marks) {
      switch (mark.type) {
        case 'bold':
          text = `**${text}**`;
          break;
        case 'italic':
          text = `*${text}*`;
          break;
        case 'underline':
          text = `<u>${text}</u>`;
          break;
        case 'strike':
          text = `~~${text}~~`;
          break;
        case 'code':
          text = `\`${text}\``;
          break;
        case 'link':
          text = `[${text}](${mark.attrs?.href ?? ''})`;
          break;
      }
    }

    return text;
  }

  if (node.type === 'hardBreak') return '  \n';
  return '';
}

/**
 * Generate a filename-safe slug from a note title.
 */
export function titleToSlug(title: string): string {
  return (title || 'untitled')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Trigger a browser download of a Markdown file.
 * Only works on web.
 */
export function downloadMarkdown(markdown: string, title: string): void {
  const slug = titleToSlug(title);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${slug}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export ALL notes as a single combined markdown file.
 * On web, triggers a browser download.
 */
export function exportAllNotesAsMarkdown(notes: Array<{ title: string; content: any; content_text: string; status: string }>): void {
  const activeNotes = notes.filter((n) => n.status !== 'trashed');

  const combined = activeNotes.map((note) => {
    const title = note.title || 'Untitled';
    const body = note.content
      ? tiptapJsonToMarkdown(note.content)
      : note.content_text;
    return `# ${title}\n\n${body}`;
  }).join('\n\n---\n\n');

  const blob = new Blob([combined], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `synapse-export-${new Date().toISOString().slice(0, 10)}.md`;
  a.click();
  URL.revokeObjectURL(url);
}

