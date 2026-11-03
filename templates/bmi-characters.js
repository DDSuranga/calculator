(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BmiCharacters=factory();})(typeof window==='object'?window:this,function(){
    const ageBand=age=>age<5?'toddler':age<13?'child':age<18?'teen':age<40?'adult':age<60?'middle':age<80?'senior':'elderly';
    function select(age,bmi){
        const validAge=Number.isInteger(age)&&age>=2&&age<=120;
        const band=validAge?ageBand(age):'adult';
        const adult=validAge&&age>=20&&Number.isFinite(bmi)&&bmi>0;
        const build=adult?[18.5,25,30,35,40,Infinity].findIndex(limit=>bmi<limit):1;
        return {band,build,height:{toddler:430,child:555,teen:695,adult:740,middle:740,senior:710,elderly:670}[band]};
    }
    return {select};
});
