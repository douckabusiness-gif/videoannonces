import fs from 'fs';

const inputFile = 'd:/videoannonces-ci/doucka2026_videoboutique.sql';
const outputFile = 'd:/videoannonces-ci/scratch/restore-data.sql';
const tables = ['category', 'sitesettings', 'seosettings', 'setting', 'subscriptionplan', 'boostpackage', 'paymentmethod'];

// Read as buffer to preserve raw bytes
const buffer = fs.readFileSync(inputFile);
const content = buffer.toString('utf-8'); // Try utf-8 first
const lines = content.split(/\r?\n/);
const tableColumns: Record<string, string[]> = {};
const results: string[] = [
    'SET NAMES utf8mb4;',
    'SET CHARACTER SET utf8mb4;',
    'SET FOREIGN_KEY_CHECKS = 0;'
];

let currentTableSchema = '';
let inCreateTable = false;

for (const line of lines) {
    if (line.startsWith('CREATE TABLE')) {
        const match = line.match(/CREATE TABLE \`(\w+)\`/);
        if (match && tables.includes(match[1])) {
            currentTableSchema = match[1];
            inCreateTable = true;
            tableColumns[currentTableSchema] = [];
        }
    } else if (inCreateTable) {
        if (line.trim().startsWith('`')) {
            const colMatch = line.trim().match(/^\`(\w+)\`/);
            if (colMatch) {
                tableColumns[currentTableSchema].push(colMatch[1]);
            }
        } else if (line.trim().startsWith('PRIMARY KEY') || line.trim().startsWith(')')) {
            inCreateTable = false;
        }
    }
}

let inInsert = false;
let currentBlock: string[] = [];

for (const line of lines) {
    if (!inInsert) {
        for (const table of tables) {
            if (line.includes(`INSERT INTO \`${table}\` VALUES`) || line.includes(`INSERT INTO ${table} VALUES`)) {
                inInsert = true;
                const columns = tableColumns[table].map(c => `\`${c}\``).join(', ');
                currentBlock = [`REPLACE INTO \`${table}\` (${columns}) VALUES` ];
                break;
            }
        }
    } else {
        currentBlock.push(line);
        if (line.trim().endsWith(';')) {
            results.push(currentBlock.join('\n'));
            inInsert = false;
        }
    }
}

results.push('SET FOREIGN_KEY_CHECKS = 1;');

// Write back as UTF-8
fs.writeFileSync(outputFile, results.join('\n\n'));
console.log(`Extracted modules with raw buffer handling.`);
