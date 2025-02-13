import fs from 'fs';
import path from 'path';

const SCHEMA_DIR = path.join(process.cwd(), 'src/context/api/schema');
const TYPES_DIR = path.join(process.cwd(), 'src/context/api/types');

// Ensure types directory exists
if (!fs.existsSync(TYPES_DIR)) {
  fs.mkdirSync(TYPES_DIR, { recursive: true });
}

// Read and process each schema file
fs.readdirSync(SCHEMA_DIR).forEach(async (file) => {
  if (!file.endsWith('.ts')) return;

  const schemaPath = path.join(SCHEMA_DIR, file);
  const typePath = path.join(TYPES_DIR, file);
  
  const schema = await import(schemaPath);
  const apiSchema = schema.default;
  
  const interfaceContent = Object.entries(apiSchema)
    .map(([endpoint, schemas]) => {
      const schemaTypes = Object.entries(schemas as Record<string, unknown>)
        .map(([type]) => `      ${type}: z.infer<typeof ${path.parse(file).name}.${endpoint}.${type}>;`)
        .join('\n');
      
      return `    ${endpoint}: {\n${schemaTypes}\n    };`;
    })
    .join('\n\n');

  const content = `// Generated from ${file}\n\nimport { z } from 'zod';\nimport ${
    path.parse(file).name
  } from '../schema/${path.parse(file).name}';\n\nexport default interface ${
    path.parse(file).name.charAt(0).toUpperCase() + path.parse(file).name.slice(1)
  }SchemaTypes {\n${interfaceContent}\n}`;
  
  fs.writeFileSync(typePath, content);
  console.log(`Generated types for ${file}`);
}); 