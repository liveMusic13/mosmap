"use client";

import {useEffect} from "react";

const MailRu = () => {
    useEffect(() => {
        if (window) {
            // @ts-ignore
            var _tmr = window._tmr || (window._tmr = []);
            _tmr.push({id: "1132896", type: "pageView", start: (new Date()).getTime()});
            (function (d, w, id) {
                if (d.getElementById(id)) return;
                var ts = d.createElement("script");
                ts.type = "text/javascript";
                ts.async = true;
                ts.id = id;
                ts.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//top-fwz1.mail.ru/js/code.js";
                var f = function () {
                    var s = d.getElementsByTagName("script")[0];
                    // @ts-ignore
                    s.parentNode.insertBefore(ts, s);
                };
                // @ts-ignore
                if (w.opera == "[object Opera]") {
                    d.addEventListener("DOMContentLoaded", f, false);
                } else {
                    f();
                }
            })(document, window, "topmailru-code");
        }
    }, []);

    return null;
};

export default MailRu;
