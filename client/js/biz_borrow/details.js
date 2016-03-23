var needlogin = checkNeedToLogin ();
if ( !needlogin) {
    window.location = '../login.html'; 
}
var dateFormat = 'yyyy-MM-dd';
function formatDttm(val, row) {
    val = new Date(val);
    return date2String(val, dateFormat);
}
function formatApproveStatus(val, row) {
    return ( val==0 ? 'N' : 'Y');
}
function formatBorrowStatus (val, row) {
    if ( val==0) return '未确认';
    if ( val==1) return '已借出';
    if ( val==2) return '已收到';
}   
var columns_borrow =[ 
    null,
    [ [ 
        { field : 'booktitle', title : '书名', width : '200px', align : 'center' }, 
        { field : 'nickname', title : '借书人', width : '80px', align : 'center' },
        { field : 'createddttm', title : '请求日期', width : '80px', align : 'center' , formatter: formatDttm },
        { field : 'forecastedreturndate', title : '预计归还日期', width : '80px', align : 'center' , formatter: formatDttm },
        { field : 'ownerapproved', title : '已批准', width : '40px', align : 'center'  , formatter: formatApproveStatus },
        { field : 'requestconfirmed', title : '状态', width : '40px', align : 'center', formatter: formatBorrowStatus  }
     ] ],
    [ [ 
        { field : 'option', title : '选项', width : '60px', align : 'center' }, 
        { field : 'percentage', title : '数值', width : '160px', align : 'center'  }
    ] ],
    null,
    [ [ 
        { field : 'option', title : '选项', width : '60px', align : 'center',
            editor : { type : 'textbox', required : true } }, 
        { field : 'percentage', title : '数值', width : '160px', align : 'center',
            editor : { type : 'numberbox', required : true, options : { precision : 0 } }
    } ] ]
];

var curBizType, curTicketStatus, curRowIndex, curRowData;

function myborrow( args ) {
    curBizType = 0;
    curTicketStatus = args; 
    var rp = { z: JSON.stringify( { userid: needlogin.userid, sessionid: needlogin.sessionid, biztype: 0, ticketstatus: args } ) };  // type - 0: 借书记录, 1: 还书记录
    $.ajax( { url: "/borrowlenddetails/query",
        method: "post",
        data: rp, 
        async: false,
        success: function ( data) {
            if ( data.errCode == 0 )
                refreshResultGrid( 'dgHeaders', { columns: columns_borrow[args], onClickRow: borrowList_onClickRow  }, data.value ); 
                hideAllButtons( );
                showButtons(0, args);
        }
    } )
}

function refreshResultGrid( dgName, opts, data ) {
    var ctrlid ='#'+dgName; 
    var dg = $( ctrlid  );
    dg.datagrid( opts );
    dg.datagrid( 'reload' );
    dg.datagrid( 'loadData', { rows: data } );
}

function borrowList_onClickRow( index, row ) {
    curRowData = row;
    curRowIndex = index; 
    var btncancel = $('#btnBorrower_Cancel'), btnconfirm = $('#btnBorrower_Confirm'); 
    if ( row.requestconfirmed == 0 ) {  // 借书人还未确认给书, 都可以取消
        btncancel.linkbutton('enable');
        btnconfirm.linkbutton('disable');
    } else if ( row.requestconfirmed == 1 ) {  // 借书人已经确认给书, 不能取消， 可以确认收到
        btncancel.linkbutton('disable');
        btnconfirm.linkbutton('enable');
    }
}

function hideAllButtons() {
    var btnb1 = document.getElementById('btnzoneBorrow_1'), btnb2=document.getElementById('btnzoneBorrow_2');
    btnb1.style.visibility="hidden";
    btnb1.style.height="0px";
    btnb2.style.visibility="hidden";
    btnb2.style.height="0px";
}
function showButtons ( bizType, ticketStatus ) {
    var btnb1 = document.getElementById('btnzoneBorrow_1'), btnb2=document.getElementById('btnzoneBorrow_2');
    if ( bizType == 0 ) { // 借入
        if ( ticketStatus == 1 ) {
            btnb1.style.visibility="";
            btnb1.style.height="40px";            
        } else  if ( ticketStatus == 2 ) {
            btnb2.style.visibility="";
            btnb2.style.height="40px"; 
        }
    } else if ( bizType == 1 ) { // 借出
        
    }
}

function cancelBorrowing() {  // 取消借书
    var rp = { z: JSON.stringify( { userid: needlogin.userid, sessionid: needlogin.sessionid, borrowrecordid: curRowData.borrowrecordid } ) };
    $.ajax( { url: "/borrowlenddetails/cancelBorrowing",
        method: "post",
        data: rp, 
        async: false,
        success: function ( data) {
            if ( data.errCode == 0 )
                alert( JSON.stringify(data ));
        }
    } );
}

function confirmReceived( args) {
    
}

function confirmReturned ( args) {
    
}

function confirmLost() {
    
}