function getPrevLoginInfo () {
    var uid = getCookie( 'userid');
    var sid = getCookie( 'sessionid');
    return { userid: uid, sessionid: sid };
}

function checkNeedToLogin() {
    var prv = getPrevLoginInfo();
    var need2 = null; 
    if ( prv.userid && prv.sessionid ) { // 以前登陆过
        var rp = { z: JSON.stringify( prv ) }; 
        $.ajax ( {
            url: "/user/login2",
            method: "post",
            data: rp, 
            async: false,
            success: function ( data) {
                if ( data.errCode == 0 ) {
                    need2 = prv;
                } 
            }
        }) 
    }
    return need2;
}

