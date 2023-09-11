const fs = require('fs');
const path = require('path');

(async () => {

    const dir = path.join(process.cwd(), 'src', 'courses');
    const courses = fs.readdirSync(dir)
        .filter(f => f.endsWith('.ts'))
        .map(c => 
            c
            .split('.')
            .slice(0, -1)
            .join('')
        );

    
    console.log('[+]', `Found a total of ${courses.length} courses`);
    
    const distDir = path.join(process.cwd(), 'dist', 'courses');
    const indexPath = path.join(distDir, 'index.json');
    fs.writeFileSync(indexPath, JSON.stringify(courses));
})();