document.addEventListener('DOMContentLoaded',()=>{
    const guide=document.getElementById('batch01-guide');
    const panel=document.getElementById(guide.dataset.panel);
    const active=()=>location.pathname.replace(/\/$/,'')===guide.dataset.route.replace(/\/$/,'');
    const help=document.getElementById('dynamicToolHelp');
    const sync=()=>{
        const hide=!active();
        if(guide.hidden!==hide)guide.hidden=hide;
        if(active()&&guide.dataset.panel==='dynamicToolCalculator'&&help?.childNodes.length)help.replaceChildren();
    };
    sync();
    new MutationObserver(sync).observe(panel,{attributes:true,attributeFilter:['style']});
    if(help)new MutationObserver(sync).observe(help,{childList:true});
    window.addEventListener('popstate',sync);
    document.addEventListener('click',()=>setTimeout(sync,0));
    document.addEventListener('keydown',event=>{
        if(!active()||event.isComposing||event.ctrlKey||event.altKey||event.metaKey)return;
        const expression=['basic','scientific'].includes(guide.dataset.target);
        const within=panel.contains(event.target);
        const display=expression&&within&&event.target.matches('input[readonly]');
        if(display&&(['Escape','Backspace'].includes(event.key)||/^[0-9.+*/()\-]$/.test(event.key))){
            event.preventDefault();event.stopImmediatePropagation();
            if(event.key==='Escape')clearDisplay();else if(event.key==='Backspace')deleteLast();else appendToDisplay(event.key);
            return;
        }
        if(event.key!=='Enter'||!within||!event.target.matches('input'))return;
        const action={basic:'calculate',scientific:'calculate',area:'calculateArea',percentage:'calculatePercentage',loanEmi:'calculateLoanEmi',mortgage:'calculateMortgage'}[guide.dataset.target]||'calculateDynamicTool';
        event.preventDefault();event.stopImmediatePropagation();window[action]();
    },true);
});
