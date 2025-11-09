"use client";

import {useEffect} from "react";

const FullscreenDesktop = () => {
    useEffect(() => {
        if (window) {
            // @ts-ignore
            window.yaContextCb.push(() => {
                // @ts-ignore
                Ya.Context.AdvManager.render({
                    "blockId": "R-A-9149690-1",
                    "type": "fullscreen",
                    "platform": "desktop"
                });
            });
        }
    }, []);

    return null;
};

export default FullscreenDesktop;
