const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),guides=require('../templates/batch01-guides');
function apply(html,target){
    const guide=guides[target];if(!guide)return html;
    const content=guide.html.trim().replace(/<table>/g,'<div class="guide-table" role="region" tabindex="0" aria-label="'+guide.title+' reference table"><table>').replace(/<\/table>/g,'</table></div>');
    const article='<article id="batch01-guide" class="batch-guide" data-target="'+target+'" data-panel="'+guide.panel+'" data-route="/'+guide.slug+'/" aria-label="'+guide.title+' educational guide">'+content+'</article>';
    const existing=/<article id="batch01-guide"[\s\S]*?<\/article>/;
    const old=/<section class="how-card" id="calculatorGuide"[\s\S]*?<\/section>/;
    if(!existing.test(html)&&!old.test(html))throw Error('Expected guide missing: '+target);
    html=html.replace(existing.test(html)?existing:old,article);
    html=html.replace(new RegExp('<section class="calculator-help" aria-label="'+guide.title+' help">[\\s\\S]*?<\\/section>'),'');
    const css='<style id="batch01-guide-css">'+fs.readFileSync(path.join(root,'templates/batch01-guide.css'),'utf8')+'</style>';
    const js='<script id="batch01-guide-ui">'+fs.readFileSync(path.join(root,'templates/batch01-guide-ui.js'),'utf8')+'</script>';
    html=html.includes('id="batch01-guide-css"')?html.replace(/<style id="batch01-guide-css">[\s\S]*?<\/style>/,()=>css):html.replace('</head>',css+'\n</head>');
    html=html.replace(/^[ \t]+$/gm,'');
    return html.includes('id="batch01-guide-ui"')?html.replace(/<script id="batch01-guide-ui">[\s\S]*?<\/script>/,()=>js):html.replace('</body>',js+'\n</body>');
}
if(require.main===module){for(const [target,g]of Object.entries(guides)){const file=path.join(root,g.slug,'index.html');fs.writeFileSync(file,apply(fs.readFileSync(file,'utf8'),target));}console.log('Updated only the 10 Batch 01 calculator guides.');}
module.exports={apply,guides};
