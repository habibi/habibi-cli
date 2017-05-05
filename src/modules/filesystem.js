import findParentDir from 'find-parent-dir';

export const projectDir = findParentDir.sync(process.cwd(), '.habibi.json');
