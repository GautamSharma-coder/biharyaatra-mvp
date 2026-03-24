const fs = require('fs');

const files = [
  'app/auth/login/page.tsx',
  'app/auth/register/page.tsx',
  'app/auth/onboarding/page.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace literal backslash-backtick with just backtick
    content = content.replace(/\\`/g, '`');
    // Replace literal backslash-dollar with just dollar
    content = content.replace(/\\\$/g, '$');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed backticks in ${file}`);
  }
});
