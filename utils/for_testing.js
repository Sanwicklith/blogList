const reverse = (string)=>{
  return string.split("").reverse().join("");
}

const average = (array)=>{
  return array.reduce((a,b)=>a+b,0)/array.length;
}

module.exports = {
  reverse,
  average
}