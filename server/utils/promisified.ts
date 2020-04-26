import { promisify } from 'util';
import fs from 'fs';

// -----------------------------------------------
// FS promisify
export const fileExistsAsync = promisify(fs.exists);
export const readFileAsync = promisify(fs.readFile);
export const writeFileAsync = promisify(fs.writeFile);
export const getStatAsync = promisify(fs.stat);
export const mkDirAsync = promisify(fs.mkdir);
