function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    try {
        var r = window.location.search.substr(1).match(reg);
        if (r != null) 
            return unescape(r[2]); 
        else
            return null;
    } catch(e) {
        return null;
    }
};

function setDocElementValues( obj ) {
    var eles = $('input, select, textarea, img') ; 
    var cfname, cfvalue; 
    for ( n=0; n<eles.length; n++ ) {
        var ce = $(eles[n]); 
        
        cfname = ce.attr( 'control_field'); 
        cfvalue = obj[cfname];
        if ( !cfname )
            continue;
        
        var tagcls = ce.attr('class') ;
        var iseasyui = ( tagcls && tagcls.indexOf('easyui')>=0 ? true : false );
        var tagname = ce[0].tagName, tagtype= ce[0].type; 
        switch( tagname ) {
            case 'INPUT': 
                if ( tagtype== 'text' || tagtype=='hidden' || tagtype=='password' ) {
                    if ( iseasyui )
                        ce.textbox( 'setValue', cfvalue ) ;   
                    else
                        ce[0].value = cfvalue;
                } else if ( tagtype == 'checkbox' ) {
                    for ( var i=0; i< cfvalue.length; i++) {
                        if ( cfvalue[i] == ce.val() ) {
                            ce[0].checked = true;
                            break;
                        }
                    }
                } else if ( tagtype =='radio') {
                    if ( ce.val() == cfvalue ) {
                        ce[0].checked =true;
                    }
                }    
                break;
            case 'SELECT':
                for ( var i=0; i<ce.attr('options').length; i++) {
                    if ( ce.attr('options')[i].value == cfvalue ) {
                        ce.attr('options')[i].selected = true;
                        break;
                    }
                }
                break;
            case 'TEXTAREA':
                ce.val( cfvalue );
                break;
            case 'IMG':
                ce[0].src = cfvalue;
                break;
            defualt;
        }
    }
    
}


