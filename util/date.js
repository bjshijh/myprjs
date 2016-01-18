Date.prototype.format = function (fmt) { 
    var o = {
        "M+": this.getMonth() + 1, 
        "d+": this.getDate(), 
        "h+": this.getHours(), 
        "m+": this.getMinutes(), 
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
Date.prototype.isToday = function(){
	var now = new Date();
	return now.getDate() == this.getDate() && 
		now.getYear() == this.getYear() &&
		now.getMonth() == this.getMonth();
};
Date.prototype.programTime = function(){
	var names = ['周日','周一','周二','周三','周四','周五','周六'];
	var day = this.getDay();
	var name;
	if ( this.isToday() ) name = '今天';
	else name = names[day];
	return this.format('M月d日(') + name + ')' + this.format(' hh:mm');
};


// 并不改变本身，返回一个新的日期值
Date.prototype.getLastDayOfMonth = function(  ) {
	var d = new Date( this.getTime() );
	d.setMonth( d.getMonth() + 1);
	d.setDate (0 );
	return d;
}
Date.prototype.isLastDayOfMonth = function(  ) {
	var d = new Date( this.getYear(), this.getMonth(), this.getDate() );
	d = this.getLastDayOfMonth( d );
	
	return ( this.getDate() == d.getDate() ) ;
}
Date.prototype.addDate = function(  datePart, diff ) {
	var d = new Date(  this.getTime() ); 
	switch ( datePart ) {
	case 'Y':
		return new Date( d.setFullYear( d.getFullYear() + diff ) );
	case 'M': { 
		if ( this.isLastDayOfMonth( d ) ) 
			return new Date( d.setDate( 0 ) );
		else	
			return new Date( d.setMonth( d.getMonth() + diff ) );
	}
	case 'D':
		return new Date( d.setDate( d.getDate() + diff ) );
	case 'm':
		return new Date( d.setMinute( d.getMinute() + diff ) );
	case 'h':
		return new Date( d.setHour( d.getHour() + diff ) );
	case 's':
		return new Date( d.setSecond( d.getSecond() + diff ) );
	}
}