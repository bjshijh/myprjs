function Map(){

   this.container = new Object();

   this.put = function(key, value){
      this.container[key] = value;
   }

   this.get = function(key){
      return this.container[key];
   }

   this.containsKey = function(key){
      return this.container[key]?true:false;
   }

   this.keySet = function() {
      var keyset = new Array();
      var count = 0;
      for (var key in this.container) {
         // 跳过object的extend函数
         if (key == 'extend') {
            continue;
         }
         keyset[count] = key;
         count++;
      }
      return keyset;
   }

   this.size = function() {
      var count = 0;
      for (var key in this.container) {
         // 跳过object的extend函数
         if (key == 'extend'){
            continue;
         }
         count++;
      }
      return count;
    }

    this.remove = function(key) {
      delete this.container[key];
    }

    this.toString = function(){
       var str = "";
       for (var i = 0, keys = this.keySet(), len = keys.length; i < len; i++) {
          str = str + keys[i] + "=" + this.container[keys[i]] + ";\n";
       }
       return str;
    }
}

module.exports = Map;