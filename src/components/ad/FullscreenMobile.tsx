"use client";

import {useEffect} from "react";

const FullscreenMobile = () => {
    useEffect(() => {
        if (window) {
            // @ts-ignore
            window.yaContextCb.push(() => {
                // @ts-ignore
                Ya.Context.AdvManager.render({
                    "blockId": "R-A-9149690-2",
                    "type": "fullscreen",
                    "platform": "touch"
                });
            });
        }
    }, []);

    return null;
};

export default FullscreenMobile;
