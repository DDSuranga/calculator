(function(root) {
    const categories = [
        {max:18.5, label:'Underweight', color:'#1578bd'},
        {max:25, label:'Healthy weight', color:'#16804b'},
        {max:30, label:'Overweight', color:'#a96800'},
        {max:35, label:'Obesity — class 1', color:'#c54b16'},
        {max:40, label:'Obesity — class 2', color:'#c32350'},
        {max:Infinity, label:'Obesity — class 3', color:'#852047'}
    ];
    const heightUnits = {cm:.01, m:1, in:.0254, ft:.3048};
    const weightUnits = {kg:1, lb:.45359237};
    function validate({age,height,weight,heightUnit='cm',weightUnit='kg'}) {
        const errors={},finite=v=>String(v).trim()!==''&&Number.isFinite(Number(v));
        if(!finite(age)||!Number.isInteger(Number(age))||Number(age)<2||Number(age)>120)errors.age='Enter age as a whole number from 2 to 120 years.';
        for(const [field,value,unit,units,min,max,label]of [['height',height,heightUnit,heightUnits,.5,2.5,'50–250 cm'],['weight',weight,weightUnit,weightUnits,2,400,'2–400 kg']]){
            const converted=Number(value)*units[unit];
            if(!Object.hasOwn(units,unit)||!finite(value)||!Number.isFinite(converted)||converted<=0||converted<min-1e-11||converted>max+1e-11)errors[field]='Enter '+field+' equivalent to '+label+' and check the selected unit.';
        }
        return errors;
    }
    function calculate(input) {
        const errors=validate(input);
        if(Object.keys(errors).length){const error=Error(Object.values(errors)[0]);error.fields=errors;throw error;}
        const {height,weight,heightUnit='cm',weightUnit='kg'}=input,age=Number(input.age);
        const m=Number(height)*heightUnits[heightUnit],kg=Number(weight)*weightUnits[weightUnit];
        const bmi=kg/(m*m), adult=age>=20;
        return {age,m,kg,bmi,adult,category:adult?categories.find(c=>bmi<c.max):null,low:adult?18.5*m*m:null,high:adult?25*m*m:null,pi:kg/(m*m*m)};
    }
    function convert(value, from, to, type) {
        const units=type==='height'?heightUnits:weightUnits;
        if(!Object.hasOwn(units,from)||!Object.hasOwn(units,to)) throw Error('Unsupported unit.');
        if(String(value).trim()===''||!Number.isFinite(Number(value)))return '';
        return Number(value)*units[from]/units[to];
    }
    const api={calculate,convert,categories,validate};
    if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BmiInteractive=api;
})(typeof globalThis!=='undefined'?globalThis:this);
