const fs = require('node:fs');
const vm = require('node:vm');
const crypto = require('node:crypto');
module.exports = function harness() {
  const elements = {}, store = {};
  const el = id => elements[id] ||= {id,value:'',innerHTML:'',innerText:'',textContent:'',style:{},classList:{add(){},remove(){},toggle(){},contains(){return false;}},addEventListener(){}};
  let copied = '';
  const context = {console,Math,Number,Date,parseFloat,parseInt,isNaN,setTimeout,clearTimeout,URLSearchParams,
    document:{getElementById:el,querySelectorAll:()=>[],querySelector:()=>null,addEventListener(){},body:el('body')},
    window:{addEventListener(){},crypto:crypto.webcrypto,matchMedia:()=>({matches:false})},
    localStorage:{getItem:k=>store[k]||null,setItem:(k,v)=>store[k]=v},
    navigator:{clipboard:{writeText:async t=>{copied=t;}}}};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('script.js','utf8'),context);
  const run = (code, timeout=1000) => vm.runInContext(code,context,{timeout});
  const inputs = values => Object.entries(values).forEach(([k,v])=>{el(k).value=String(v)});
  const dynamic = (tool,values) => {context.values=values;return run(`dynamicToolDefinitions.${tool}.calculate(values)`)};
  return {el,run,inputs,dynamic,context,copied:()=>copied};
};
