import { ChecklistSection } from '../types/checklist';

export const exportProgress = (
  checklistData: ChecklistSection[],
  checkedItems: Record<string, boolean>
) => {
  const completed = Object.values(checkedItems).filter(Boolean).length;
  const total = checklistData.reduce((sum, section) => sum + section.items.length, 0);
  const date = new Date().toLocaleDateString();

  let report = `Frontend Implementation Checklist Report\n`;
  report += `Date: ${date}\n`;
  report += `Progress: ${completed}/${total} items (${Math.round((completed / total) * 100)}%)\n\n`;

  checklistData.forEach((section) => {
    report += `\n${section.title}\n`;
    report += '='.repeat(section.title.length) + '\n';
    section.items.forEach((item) => {
      const checked = checkedItems[item.id] ? '✓' : '☐';
      report += `${checked} ${item.text}\n`;
    });
  });

  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `checklist-report-${date}.txt`;
  a.click();
};
