// Get initials from name for avatar
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Generate consistent color from string
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 60%, 50%)`;
}

// Parse commit type from message
export function parseCommitType(message: string): { type: string; color: string } | null {
  const match = message.match(
    /^(feat|fix|docs|style|refactor|test|chore|build|ci|perf|revert)(\(.*?\))?:/i
  );
  if (!match) return null;

  const typeColors: Record<string, string> = {
    feat: '#10b981',
    fix: '#ef4444',
    docs: '#3b82f6',
    style: '#8b5cf6',
    refactor: '#f59e0b',
    test: '#06b6d4',
    chore: '#6b7280',
    build: '#ec4899',
    ci: '#14b8a6',
    perf: '#f97316',
    revert: '#dc2626',
  };

  const type = match[1].toLowerCase();
  return { type, color: typeColors[type] || '#6b7280' };
}

// Group commits by date
export function groupCommitsByDate(commits: { timestamp: string | number | Date }[]) {
  const groups: { label: string; commits: { timestamp: string | number | Date }[] }[] = [];
  let currentGroup: { label: string; commits: { timestamp: string | number | Date }[] } | null =
    null;

  commits.forEach((commit) => {
    const date = new Date(commit.timestamp);
    let label: string;

    if (date.toDateString() === new Date().toDateString()) {
      label = 'Today';
    } else if (date.toDateString() === new Date(Date.now() - 86400000).toDateString()) {
      label = 'Yesterday';
    } else if (Date.now() - date.getTime() < 7 * 86400000) {
      label = date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      label = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    if (!currentGroup || currentGroup.label !== label) {
      currentGroup = { label, commits: [] };
      groups.push(currentGroup);
    }
    currentGroup.commits.push(commit);
  });

  return groups;
}
