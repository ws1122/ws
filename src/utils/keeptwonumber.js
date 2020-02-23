 
  /*只能输入2位小数点的处理 */
 const twonumber = function (name) {
   return name.target.value = (name.target.value.match(/^\d*(\.?\d{0,2})/g)[0]) || null

 }
 export default {

   twonumber

 }
