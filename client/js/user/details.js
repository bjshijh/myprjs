var needlogin = checkNeedToLogin ();
if ( !needlogin) {
    window.location = '../login.html'; 
}

columns_borrow: [ 
    null,
    [ [ 
        { field : 'option', title : '选项', width : '60px', align : 'center',
            editor : { type : 'textbox', required : true } }, 
        { field : 'percentage', title : '数值', width : '160px', align : 'center',
            editor : { type : 'numberbox', required : true, options : { precision : 0 } }
    } ] ],
    [ [ 
        { field : 'option', title : '选项', width : '60px', align : 'center',
            editor : { type : 'textbox', required : true } }, 
        { field : 'percentage', title : '数值', width : '160px', align : 'center',
            editor : { type : 'numberbox', required : true, options : { precision : 0 } }
    } ] ],
    null,
    [ [ 
        { field : 'option', title : '选项', width : '60px', align : 'center',
            editor : { type : 'textbox', required : true } }, 
        { field : 'percentage', title : '数值', width : '160px', align : 'center',
            editor : { type : 'numberbox', required : true, options : { precision : 0 } }
    } ] ]
];

function myborrow( args ) {
    var rp = { z: JSON.stringify( { userid: needlogin.userid, sessionid: needlogin.sessionid, biztype: 0, ticketstatus: args } ) };  // type - 0: 借书记录, 1: 还书记录
    $.ajax( { url: "/borrowlenddetails/query",
        method: "post",
        data: rp, 
        async: false,
        success: function ( data) {
            if ( data.errCode == 0 )
                refreshResultGrid( data.value ); ;
        }
    } )
}