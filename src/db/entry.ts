import path from 'path';
import fs from 'fs';
import { app } from 'electron';

const mainConfigPath = path.join(app.getPath('userData'), 'config.json');
const tempPath = '/Users/Flysandwich/Desktop/sandwichNote';

function readMainConfig(file?: string): { configFolder: string } {
  try {
    const data = fs.readFileSync(mainConfigPath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { configFolder: '' };
  }
}

function writeMainConfig(folderPath: string) {
  fs.writeFileSync(
    mainConfigPath,
    JSON.stringify({ configFolder: folderPath }, null, 2),
  );
}
