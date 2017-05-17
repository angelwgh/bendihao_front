/**
 * Created by WDL on 2015/9/2.
 */
define(['jquery', 'validateEngine', 'liteValidate', 'cookie'], function (jq, ve, lv, cookie) {
    var g = {};
    var builder;
    var process;
    var event;
    g.node = {
        newpw: $('#newpw'),
        enterpw: $('#enterpw'),
        account: $('#account'),
        account1: $('#account1'),
        account2: $('#account2'),
        account3: $('#account3'),
        step4: $('#step4'),
        step6: $('#step6'),
        step7: $('#step7'),
        next: $('#next'),
        tip1: $('#tip1'),
        tip2: $('#tip2'),
        tip3: $('#tip3')
    };
    g.data = {
        account: '',
        password: '',
        currentUser: 'student',
        expires: 60 * 60 * 24 * 30
    };
    g.config = {
        validationEventTrigger: 'blur',
        showPrompts: true,
        scroll: false,
        promptPosition: 'topRight',
        autoHidePrompt: true,
        autoHideDelay: 10000,
        showOneMessage: true,
        onFailure: false,
        focusFirstField: true
    };

    builder = {
        initPage: function () {
            var url = '/web/login/forgetPassword/findUUIDRandomNumber';
            $.post(url, {account: g.data.account, code: g.data.code}, function (data) {
                if (data.status) {
                    if (data.info.length > 0) {
                        if (data.info[0].userId == 'true') {
                            g.node.account1.text(data.info[0].accountId);
                            g.node.account2.text(data.info[0].accountId);
                            g.node.account3.text(data.info[0].accountId);
                            g.node.step6.removeClass('hide');
                        } else {
                            g.node.account1.text(data.info[0].accountId);
                            g.node.account2.text(data.info[0].accountId);
                            g.node.account3.text(data.info[0].accountId);
                            g.node.step4.removeClass('hide');
                        }
                    } else {
                        g.node.step4.removeClass('hide');
                    }

                    //g.node.email.html("<span>通过邮箱找回密码</span>" + data.info.email);
                    //g.node.mobile.html("<span>通过手机找回密码</span>" + data.info.mobile);

                    //g.node.step6.addClass('hide');
                } else {
                }
            }, 'json');
        },
        initValidationEngine: function () {
            g.node.mainOperation.validationEngine('attach', g.config);
        },
        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        },

        initData: function (cruuent) {
            var cookiePassword,
                cookieAccount;
            if (cruuent == 'admin') {
                cookiePassword = cookie.get('adminPassword');
                cookieAccount = cookie.get('adminAccount');
            } else {
                cookiePassword = cookie.get('studentPassword');
                cookieAccount = cookie.get('studentAccount');
            }

            if (cookiePassword) {
                if (cookiePassword !== null && cookiePassword !== '') {
                    g.node.password.val(cookiePassword);
                    g.data.password = cookiePassword;
                }
            } else {
                g.node.password.val(cookiePassword);
            }
            if (cookieAccount) {
                if (cookieAccount !== null && cookieAccount !== '') {
                    g.node.account.val(cookieAccount);
                    g.data.account = cookieAccount;
                    g.node.rememberPassword.prop('checked', true);
                }
            } else {
                g.node.account.val(cookieAccount);
                g.node.rememberPassword.prop('checked', false);
            }
        }
    };

    process = {
        init: function () {
            g.data.code = builder.getUrlParam('code');
            g.data.account = builder.getUrlParam('account');
            builder.initPage();
            event.listen();
            //process.getLoginPioneer();

            (function () {
                $(function () {
                    $(':input[placeholder]').each(function (index, element) {
                        placeHolder(element, true);
                    });
                });

                function getStyle(obj, styleName) {
                    var oStyle = null;
                    if (obj.currentStyle)
                        oStyle = obj.currentStyle[styleName];
                    else if (window.getComputedStyle)
                        oStyle = window.getComputedStyle(obj, null)[styleName];
                    return oStyle;
                }

                function placeHolder(obj, span) {
                    if (!obj.getAttribute('placeholder')) return;
                    var imitateMode = span === true ? true : false;
                    var supportPlaceholder = 'placeholder' in document.createElement('input');
                    if (!supportPlaceholder) {
                        var defaultValue = obj.getAttribute('placeholder');
                        var type = obj.getAttribute('type');
                        if (!imitateMode) {
                            obj.onfocus = function () {
                                (obj.value == defaultValue) && (obj.value = '');
                                obj.style.color = '';
                            }
                            obj.onblur = function () {
                                if (obj.value == defaultValue) {
                                    obj.style.color = '';
                                } else if (obj.value == '') {
                                    obj.value = defaultValue;
                                    obj.style.color = '#ACA899';
                                }
                            }
                            obj.onblur();
                        } else {
                            var placeHolderCont = document.createTextNode(defaultValue);
                            var oWrapper = document.createElement('span');
                            oWrapper.style.cssText = 'position:absolute; color:#ACA899; display:inline-block; overflow:hidden;';
                            oWrapper.className = 'wrap-placeholder';
                            oWrapper.style.fontFamily = getStyle(obj, 'fontFamily');
                            oWrapper.style.fontSize = getStyle(obj, 'fontSize');
                            oWrapper.style.marginLeft = parseInt(getStyle(obj, 'marginLeft')) ? parseInt(getStyle(obj, 'marginLeft')) + 3 + 'px' : 3 + 'px';
                            oWrapper.style.marginTop = parseInt(getStyle(obj, 'marginTop')) != 0 ? getStyle(obj, 'marginTop') : 0 + 'px';
                            oWrapper.style.paddingLeft = getStyle(obj, 'paddingLeft');
                            oWrapper.style.width = (obj.offsetWidth - parseInt((getStyle(obj, 'marginLeft') == "auto" ? 0 : (getStyle(obj, 'marginLeft'))))) == 0 ? 100 : (obj.offsetWidth - parseInt((getStyle(obj, 'marginLeft') == "auto" ? 0 : (getStyle(obj, 'marginLeft'))))) + 'px';
                            oWrapper.style.height = obj.offsetHeight == 0 ? 34 : obj.offsetHeight + 'px';
                            oWrapper.style.lineHeight = obj.nodeName.toLowerCase() == 'textarea' ? '' : (obj.offsetHeight == 0 ? 34 : obj.offsetHeight) + 'px';
                            oWrapper.appendChild(placeHolderCont);
                            obj.parentNode.insertBefore(oWrapper, obj);
                            oWrapper.onclick = function () {
                                obj.focus();
                            };
                            //绑定input或onpropertychange事件,ie9中删除时无法触发此事件
                            if (typeof(obj.oninput) == 'object') {
                                obj.addEventListener("input", function () {
                                    oWrapper.style.display = obj.value != "" ? 'none' : 'inline-block';
                                }, false);
                                obj.onpropertychange = function () {
                                    oWrapper.style.display = obj.value != "" ? 'none' : 'inline-block';
                                };
                                obj.onkeyup = function (e) {
                                    var e = e || window.event;
                                    if (e.keyCode == 8 || e.keyCode == 46 || (event.ctrlKey && e.keyCode == 88)) {
                                        oWrapper.style.display = obj.value != '' ? 'none' : 'inline-block';
                                    }
                                };
                            } else {
                                obj.onpropertychange = function () {
                                    oWrapper.style.display = obj.value != "" ? 'none' : 'inline-block';
                                };
                                obj.onkeyup = function (e) {
                                    var e = e || window.event;
                                    if (e.keyCode == 8 || e.keyCode == 46 || (event.ctrlKey && e.keyCode == 88)) {
                                        oWrapper.style.display = obj.value != '' ? 'none' : 'inline-block';
                                    }
                                };
                            }
                        }
                    }
                }
            })();
        }
    };

    event = {
        listen: function () {

            //页面enter事件
            $(document).keydown(function (e) {
                if (e.keyCode === 13) {
                    process.tologin();
                }
            });
            g.node.next.bind("click", function () {

                if (g.node.newpw.val() == '') {
                    g.node.tip1.removeClass('hide');
                    g.node.tip2.addClass('hide');
                    g.node.tip3.addClass('hide');
                    g.node.newpw.focus();
                    return;
                }

                if (g.node.enterpw.val() == '') {
                    g.node.tip1.addClass('hide');
                    g.node.tip2.removeClass('hide');
                    g.node.tip3.addClass('hide');
                    g.node.enterpw.focus();
                    return;
                }

                if (g.node.newpw.val() != g.node.enterpw.val()) {
                    g.node.tip3.removeClass('hide');
                    g.node.tip1.addClass('hide');
                    g.node.tip2.addClass('hide');
                    g.node.enterpw.focus();
                    return;
                }

                var url = '/web/login/forgetPassword/updateUserPassword';
                g.data.sendStyle = false;
                var datas = {
                    code: g.data.code,
                    newPassword: g.node.newpw.val()
                };
                $.post(url, datas, function (data) {
                    if (data.status) {
                        if (data.info) {
                            g.node.step4.addClass('hide');
                            g.node.step6.addClass('hide');
                            g.node.step7.removeClass('hide');
                        } else {

                        }
                        //window.location = data.location;
                    } else {

                    }
                }, 'json');
            });
            g.node.newpw.bind('blur', function () {
                if (g.node.newpw.val() == '') {
                    g.node.tip1.removeClass('hide');
                    g.node.tip2.addClass('hide');
                    g.node.tip3.addClass('hide');
                    //g.node.newpw.focus();
                    return;
                }
                if (g.node.newpw.val() != '' && g.node.enterpw.val() != '' && g.node.newpw.val() != g.node.enterpw.val()) {
                    g.node.tip3.removeClass('hide');
                    g.node.tip1.addClass('hide');
                    g.node.tip2.addClass('hide');
                    //g.node.newpw.focus();
                    return;
                }
            });
            g.node.enterpw.bind('blur', function () {
                if (g.node.enterpw.val() == '') {
                    g.node.tip1.addClass('hide');
                    g.node.tip2.removeClass('hide');
                    g.node.tip3.addClass('hide');
                    //g.node.enterpw.focus();
                    return;
                }
                if (g.node.newpw.val() != '' && g.node.enterpw.val() != '' && g.node.newpw.val() != g.node.enterpw.val()) {
                    g.node.tip3.removeClass('hide');
                    g.node.tip1.addClass('hide');
                    g.node.tip2.addClass('hide');
                    //g.node.enterpw.focus();
                    return;
                }
                /*if (g.node.enterpw.val()=='') {
                 g.node.newpw.val('请输入新密码');
                 }*/
            });
            /*g.node.newpw.focus(function(){
             if(g.node.newpw.val()=='请输入新密码') {
             g.node.newpw.val('');
             }
             });
             g.node.newpw.blur(function(){
             if (g.node.newpw.val()=='') {
             g.node.newpw.val('请输入新密码');
             }
             });
             g.node.enterpw.focus(function(){
             if(g.node.enterpw.val()=='请再次输入新密码') {
             g.node.enterpw.val('');
             }
             });
             g.node.enterpw.blur(function(){
             if (g.node.enterpw.val()=='') {
             g.node.enterpw.val('请再次输入新密码');
             }
             });*/

        }
    };
    process.init();
});
