/**
 * Created by WDL on 2015/8/29.
 */
define(['jquery', 'validateEngine', 'liteValidate', 'simpleValidateEngine', 'validateEngineLang'], function (jq, ve, lv, simpleValidateEngine, validateEngineLang) {
    var g = {};
    //var validEngine = require('lib/validationEngine/simple-validate-engine');
    var builder;
    var process;
    var event;
    var helper;

    var config = {
        showOneMessage: true,
        promptPosition: 'topLeft',
        ajaxFormValidation: true,
        ajaxFormValidationMethod: 'post',
        autoHidePrompt: true,
        autoHideDelay: 2000
    };

    g.node = {
        step1: $('#step1'),
        step2: $('#step2'),
        step3: $('#step3'),
        step4: $('#step4'),
        step5: $('#step5'),
        step6: $('#step6'),
        step7: $('#step7'),
        stepForm1: $('#stepForm1'),
        next: $('#next'),  //
        validateCode: $('#validateCode'),
        account: $('#account'),
        account1: $('#account1'),
        account2: $('#account2'),
        account3: $('#account3'),
        account4: $('#account4'),
        changeCodeImage: $('#change-code-image'),
        refreshImage: $('#refresh-image'),
        tip1: $('#tip1'),
        tip2: $('#tip2'),
        tip3: $('#tip3'),
        tip4: $('#tip4'),
        tip5: $('#tip5'),
        email: $('#email'),
        mobile: $('#mobile'),
        sendEmail: $('#sendEmail'),
        sendMobile: $('#sendMobile'),
        second: $('#second'),
        alreadyEmail: $('#alreadyEmail'),
        alreadyMobile: $('#alreadyMobile'),
        reloadSendEmail: $('#reloadSendEmail'),
        againSendEmail: $('#againSendEmail'),
        otherStyle: $('#otherStyle'),
        noneFind: $('#noneFind'),
        emailUrl: $('#emailUrl'),
        otherFind: $('#otherFind'),
        mobileNext: $('#mobileNext'),
        verification: $('#verification'),
        countDown: $('#countDown'),
        replaySend: $('#replaySend'),
        inputCode: $('#inputCode'),
        replayCount: $('#replayCount')

    };
    g.data = {};
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
        initData: function () {
        },
        getUrlParam: function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        }
    };


    var wait = 60;
    process = {
        init: function () {
            event.listener();
            builder.initData();

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
        },
        next: function () {
            //var result = g.node.stepForm1.validationEngine('validate');

            if ($.trim(g.node.validateCode.val()) == '' && $.trim(g.node.account.val()) == '') {
                g.node.tip2.css('display', 'inline-block');
                g.node.tip1.css('display', 'inline-block');
                g.node.tip3.css('display', 'none');
                return;
            }

            if ($.trim(g.node.validateCode.val()) == '') {
                g.node.tip2.css('display', 'inline-block');
                g.node.tip3.css('display', 'none');
                return;
            } else {
                g.node.tip2.css('display', 'none');
            }

            if ($.trim(g.node.account.val()) == '') {
                g.node.tip1.css('display', 'inline-block');
                return;
            } else {
                g.node.tip1.css('display', 'none');
            }

            if (g.node.tip3.css("display") == "block" || g.node.tip3.css("display") == "inline-block") {
                return;
            }

            g.node.next.attr('disabled', 'disabled');
            var url = '/web/login/forgetPassword/forgetInfo';
            var account = g.node.account.val();
            g.data.loginInput = account;
            var reg = /^(.).+(.)$/g;
            //alert(account.replace(reg, "$1*$2"));
            g.data.account = account.replace(reg, "$1*******$2");
            var option = {};
            $.post(url, {loginInput: account}, function (data) {
                if (data.status) {
                    option.type = 'success';
                    if (data.info) {
                        g.data.email = data.info.email;
                        g.data.mobile = data.info.mobile;
                    }
                    g.node.account1.text(g.data.account);
                    if (data.info.email) {
                        g.node.email.html("<span>通过邮箱找回密码</span>" + data.info.email);
                    } else {
                        g.node.sendEmail.css('display', 'none');
                        g.node.sendEmail.addClass("hide");
                    }

                    if (data.info.mobile) {
                        g.node.mobile.html("<span>通过手机找回密码</span>" + data.info.mobile);
                    } else {
                        g.node.sendMobile.css('display', 'none');
                        g.node.sendEmail.removeClass('bor');
                    }
                    if (!data.info.email && !data.info.mobile) {
                        g.node.noneFind.css('display', 'inline-block');
                    }
                    g.node.step1.addClass('hide');
                    g.node.step2.removeClass('hide');
                } else {
                    //option.type = 'error';
                    alert('查询失败！');
                }
                //option.msg = data.messages;
                g.node.next.removeAttr("disabled");
                //tip.alert(option);
            }, 'json');
        },
        countDown: function () {
            if (wait == 0) {
                g.node.verification.addClass('hide');
                g.node.replayCount.addClass('hide');
                g.node.replaySend.removeClass('hide');
                g.node.countDown.css('display', 'none');
                wait = 60;
            } else {
                wait--;
                g.node.countDown.text('(' + wait + ')');
                setTimeout(function () {
                    process.countDown();
                }, 1000);
            }
        }
    };

    event = {
        listener: function () {
            //找回密码
            g.node.validateCode.bind('blur', function () {

                if (g.node.validateCode.val() == '') {
                    g.node.tip2.css('display', 'inline-block');
                    g.node.tip3.css('display', 'none');
                    return;
                } else {
                    g.node.tip2.css('display', 'none');
                }

                var url = "/web/login/validateCode/validation";
                $.post(url, {fieldValue: g.node.validateCode.val()}, function (data) {
                    if (data.status) {
                        if (data.info) {
                            g.node.tip3.css('display', 'none');
                        } else {
                            g.node.tip3.css('display', 'inline-block');
                        }
                    } else {

                    }
                }, 'json');
            });
            g.node.account.bind('blur', function () {
                if (g.node.account.val() == '') {
                    g.node.tip1.css('display', 'inline-block');
                } else {
                    g.node.tip1.css('display', 'none');
                }

            });
            g.node.next.bind('click', function () {

                process.next();
            });
            g.node.sendEmail.bind("click", function () {
                var url = '/web/login/forgetPassword/sendUUIDRandomNumber';
                g.data.sendStyle = true;
                var datas;
                if (g.data.setExecute) {
                    datas = {
                        type: 'email',
                        loginInput: g.data.loginInput,
                        code: g.data.code
                    };
                } else {
                    datas = {
                        type: 'email',
                        loginInput: g.data.loginInput
                    };
                }

                $.post(url, datas, function (data) {
                    if (data.status) {
                        g.node.account2.text(g.data.account);
                        g.node.account3.text(g.data.account);
                        g.node.account4.text(g.data.account);
                        if (data.info) {
                            g.data.code = data.info;
                            g.node.alreadyEmail.html(g.data.email);
                            g.node.emailUrl.attr('href', 'http://mail.' + g.data.email.substring(g.data.email.indexOf('@') + 1, g.data.email.length));
                            g.node.step1.addClass('hide');
                            g.node.step2.addClass('hide');
                            g.node.step4.addClass('hide');
                            g.node.step5.addClass('hide');
                            g.node.step3.removeClass('hide');
                            if (g.data.setExecute) {
                                alert("发送成功，请查收邮件！");
                            }
                        } else {
                            g.node.step1.addClass('hide');
                            g.node.step2.addClass('hide');
                            g.node.step3.addClass('hide');
                            g.node.step5.addClass('hide');
                            g.node.step4.removeClass('hide');
                        }
                    } else {
                        g.node.step1.addClass('hide');
                        g.node.step2.addClass('hide');
                        g.node.step3.addClass('hide');
                        g.node.step5.addClass('hide');
                        g.node.step4.removeClass('hide');
                    }

                    g.data.setExecute = false;
                }, 'json');
            });
            g.node.sendMobile.bind("click", function () {

                g.data.sendStyle = false;
                g.node.alreadyMobile.html(g.data.mobile);
                g.node.step1.addClass('hide');
                g.node.step2.addClass('hide');
                g.node.step4.addClass('hide');
                g.node.step3.addClass('hide');
                g.node.step5.removeClass('hide');
            });
            g.node.otherStyle.bind("click", function () {
                g.node.step1.addClass('hide');
                g.node.step3.addClass('hide');
                g.node.step4.addClass('hide');
                g.node.step5.addClass('hide');
                g.node.step2.removeClass('hide');
            });
            g.node.otherFind.bind("click", function () {
                g.node.step1.addClass('hide');
                g.node.step3.addClass('hide');
                g.node.step4.addClass('hide');
                g.node.step5.addClass('hide');
                g.node.step2.removeClass('hide');
            });
            g.node.mobileNext.bind("click", function () {
                if ($.trim(g.node.inputCode.val()) == '') {
                    g.node.tip4.css('display', 'inline-block');
                    g.node.tip5.css('display', 'none');
                    return;
                } else {
                    g.node.tip4.css('display', 'none');
                }

                if (g.node.tip5.css("display") == "block" || g.node.tip5.css("display") == "inline-block") {
                    return;
                }

                var url = "/web/login/forgetPassword/findMobileValidateCode";

                var remoteData = {
                    loginInput: g.node.account.val(),
                    type: 'mobile',
                    code: g.node.inputCode.val()
                };

                $.post(url, remoteData, function (data) {
                    if (data.status) {
                        if (data.info) {
                            g.node.tip5.css('display', 'none');
                            location.href = './forgetPassword-5.html?code=' + g.data.code;
                        } else {
                            g.node.tip5.css('display', 'inline-block');
                        }
                    } else {
                        alert('远程调用错误！');
                    }
                }, 'json');
            });
            g.node.reloadSendEmail.bind("click", function () {
                g.data.setExecute = true;
                if (g.data.sendStyle) {
                    //g.node.sendEmail.click();
                    //g.node.sendEmail.click();
                    g.node.sendEmail.trigger("click");
                } else {
                    g.node.sendMobile.click();
                    //g.node.sendMobile.click();
                    //g.node.sendMobile.trigger("click");
                }
            });
            g.node.replaySend.bind('click', function () {
                g.data.setExecute = true;
                g.node.verification.trigger('click');
            });
            g.node.verification.bind('click', function () {
                var url = '/web/login/forgetPassword/sendUUIDRandomNumber';
                var datas;
                if (g.data.setExecute) {
                    datas = {
                        type: 'mobile',
                        loginInput: g.data.loginInput,
                        code: g.data.code
                    };
                } else {
                    datas = {
                        type: 'mobile',
                        loginInput: g.data.loginInput
                    };
                }
                $.post(url, datas, function (data) {
                    if (data.status) {
                        if (data.info) {
                            if (g.data.setExecute) {
                                alert("发送成功，请查收短信！");
                            }
                            g.data.code = data.info;
                            g.node.verification.addClass('hide');
                            g.node.replaySend.addClass('hide');
                            g.node.replayCount.removeClass('hide');
                            if (g.node.countDown.css("display") == "none") {
                                g.node.countDown.css("display", "inline-block");
                            }
                            process.countDown();
                        }
                    } else {
                        alert("发送失败，请重新发送！")
                    }
                    g.data.setExecute = false;
                }, 'json');
            });
            g.node.againSendEmail.bind("click", function () {
                g.data.setExecute = true;
                if (g.data.sendStyle) {
                    //g.node.sendEmail.click();
                    //g.node.sendEmail.click();
                    g.node.sendEmail.trigger("click");
                } else {
                    g.node.sendMobile.click();
                    //g.node.sendMobile.click();
                    //g.node.sendMobile.trigger("click");
                }
            });
            g.node.changeCodeImage.bind("click", function () {
                g.node.refreshImage.attr('src', "/web/login/validateCode/code?" + Math.random());
            });
            g.node.refreshImage.bind("click", function () {
                g.node.refreshImage.attr('src', "/web/login/validateCode/code?" + Math.random());
            });

            g.node.inputCode.bind('blur', function () {
                if ($.trim(g.node.inputCode.val()) == '') {
                    g.node.tip4.css('display', 'inline-block');
                    g.node.tip5.css('display', 'none');
                    return;
                } else {
                    g.node.tip4.css('display', 'none');
                }

                var url = "/web/login/forgetPassword/findMobileValidateCode";

                var remoteData = {
                    loginInput: g.node.account.val(),
                    type: 'mobile',
                    code: g.node.inputCode.val()
                };

                $.post(url, remoteData, function (data) {
                    if (data.status) {
                        if (data.info) {
                            g.node.tip5.css('display', 'none');
                        } else {
                            g.node.tip5.css('display', 'inline-block');
                        }
                    } else {
                        alert('远程调用错误！');
                    }
                }, 'json');
            });
        },
        listen: function () {
            //页面enter事件
            $(document).keydown(function (e) {
                if (e.keyCode === 13) {
                    process.next();
                }
            });

        }
    };

    process.init();
});
