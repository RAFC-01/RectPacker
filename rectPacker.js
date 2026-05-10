class RectPacker{
    constructor(){
        this.padding = 1;
        this.accuracy = 0; // lower better
        this.guillotine_after = 2000;
        this.skyline_after = 8000;
        this.status = null;
        this.newFreeRects = [];
        this.algs = {
            MAX_RECTS: 0,
            GUILLOTINE: 1,
            SKYLINE: 2
        }
    }
    intersects(a, b) {
        return !(
            a.x + a.width <= b.x ||
            b.x + b.width <= a.x ||
            a.y + a.height <= b.y ||
            b.y + b.height <= a.y
        );
    }
    packMaxRects(sizeX, sizeY, rectsCopy, minW, minH){
        let freeRects = [{x: 0, y: 0, width: sizeX, height: sizeY}];
        const rLen = rectsCopy.length;
    
        let newFreeRects = this.newFreeRects;

        for (let i = 0; i < rectsCopy.length; i++){
            const rect = rectsCopy[i]; 
    
            const width = rect.width + this.padding;
            const height = rect.height + this.padding;
    
            let bestFit = {x: 0, y: 0, shortSide: undefined, index: 0};
    
            let bestFitIdx = -1;
            let bestShortSide = Infinity;
            let bestX = 0, bestY = 0;
    
            for (let j = 0; j < freeRects.length; j++){
                const fr = freeRects[j];
    
                if (width > fr.width ||
                   height > fr.height)
                {
                    continue;
                }
                const shortSide = Math.min(fr.width - width, fr.height - height);
                
                if (bestShortSide > shortSide){
                    // new best
                    bestFitIdx = j;
                    bestX = fr.x;
                    bestY = fr.y;
                    bestShortSide = shortSide;
    
                    if (shortSide === 0) break; // perfect, break early 
                }
            }
    
            if (bestFitIdx === -1) return false;
    
            // place rect into best spot (top-left)
            rect.x = bestX;
            rect.y = bestY;
    
            const pX = bestX;
            const pY = bestY;
            const pW = width;
            const pH = height;
            const currentBest = freeRects[bestFit.index];
    
            const pR = pX + pW;
            const pB = pY + pH;
    
            newFreeRects.length = 0;    
    
            // cutting rects
            for (let j = 0, fLen = freeRects.length; j < fLen; j++) {
                const fr = freeRects[j];
                const frR = fr.x + fr.width;
                const frB = fr.y + fr.height;
    
                if (pX >= frR || pR <= fr.x || pY >= frB || pB <= fr.y) {
                    newFreeRects.push(fr);
                    continue;
                }
                // top 
                if (pY > fr.y) { 
                    const h = pY - fr.y; 
                    if (h >= minH) newFreeRects.push({ x: fr.x, y: fr.y, width: fr.width, height: h }); 
                } 
                // bottom 
                if (pB < frB) { 
                    const h = frB - pB; 
                    if (h >= minH) newFreeRects.push({ x: fr.x, y: pB, width: fr.width, height: h }); 
                } 
                // left 
                if (pX > fr.x) { 
                    const w = pX - fr.x;
                    if (w >= minW) newFreeRects.push({ x: fr.x, y: fr.y, width: w, height: fr.height }); 
                } 
                // right
                if (pR < frR) { 
                    const w = frR - pR; 
                    if (w >= minW) newFreeRects.push({ x: pR, y: fr.y, width: w, height: fr.height }); 
                }
            }
    
            if (newFreeRects.length > rectsCopy.length){
                // prune pass
                for (let j = 0; j < newFreeRects.length; j++) {
                    const frJ = newFreeRects[j];
                    if (!frJ) continue;
                    
                    for (let k = j + 1; k < newFreeRects.length; k++) {
                        const frK = newFreeRects[k];
                        if (!frK) continue;
    
                        if ((
                            newFreeRects[k].x >= newFreeRects[j].x &&
                            newFreeRects[k].y >= newFreeRects[j].y &&
                            newFreeRects[k].x + newFreeRects[k].width <= newFreeRects[j].x + newFreeRects[j].width &&
                            newFreeRects[k].y + newFreeRects[k].height <= newFreeRects[j].y + newFreeRects[j].height
                        )) {    
                            newFreeRects[k] = null;
                        } else if ((
                            newFreeRects[j].x >= newFreeRects[k].x &&
                            newFreeRects[j].y >= newFreeRects[k].y &&
                            newFreeRects[j].x + newFreeRects[j].width <= newFreeRects[k].x + newFreeRects[k].width &&
                            newFreeRects[j].y + newFreeRects[j].height <= newFreeRects[k].y + newFreeRects[k].height
                        )) {    
                            newFreeRects[j] = null;
                            break;
                        }
                    }
                }
            }
            freeRects = [];
    
            for (let j = 0; j < newFreeRects.length; j++){
                if (newFreeRects[j] != null) freeRects.push(newFreeRects[j]);
            }
        }
        return true;
    }
    packGuillotine(sizeX, sizeY, rectsCopy, minW, minH){
        let freeRects = [{x: 0, y: 0, width: sizeX, height: sizeY}];
        const rLen = rectsCopy.length;
    
        let newFreeRects = this.newFreeRects;

        for (let i = 0; i < rectsCopy.length; i++){
            const rect = rectsCopy[i]; 
    
            const width = rect.width + this.padding;
            const height = rect.height + this.padding;
    
            let bestFit = {x: 0, y: 0, shortSide: undefined, index: 0};
    
            let bestFitIdx = -1;
            let bestShortSide = Infinity;
            let bestX = 0, bestY = 0;
    
            for (let j = 0; j < freeRects.length; j++){
                const fr = freeRects[j];
    
                if (width > fr.width ||
                   height > fr.height)
                {
                    continue;
                }
                const shortSide = Math.min(fr.width - width, fr.height - height);
                
                if (bestShortSide > shortSide){
                    // new best
                    bestFitIdx = j;
                    bestX = fr.x;
                    bestY = fr.y;
                    bestShortSide = shortSide;
    
                    if (shortSide === 0) break; // perfect, break early 
                }
            }
    
            if (bestFitIdx === -1) return false;
    
            // place rect into best spot (top-left)
            rect.x = bestX;
            rect.y = bestY;
    
            const pX = bestX;
            const pY = bestY;
            const pW = width;
            const pH = height;
            const currentBest = freeRects[bestFit.index];
    
            const pR = pX + pW;
            const pB = pY + pH;
    
            newFreeRects.length = 0;    
    
            // cutting rects
            for (let j = 0, fLen = freeRects.length; j < fLen; j++) {
                const fr = freeRects[j];
                const frR = fr.x + fr.width;
                const frB = fr.y + fr.height;
    
                if (pX >= frR || pR <= fr.x || pY >= frB || pB <= fr.y) {
                    newFreeRects.push(fr);
                    continue;
                }
    
                const remainingRight = fr.width - width;
                const remainingBottom = fr.height - height;
    
                if (remainingRight > remainingBottom) {
    
                    // split vertically
    
                    if (remainingRight >= minW) {
                        newFreeRects.push({
                            x: fr.x + width,
                            y: fr.y,
                            width: remainingRight,
                            height: fr.height
                        });
                    }
    
                    if (remainingBottom >= minH) {
                        newFreeRects.push({
                            x: fr.x,
                            y: fr.y + height,
                            width: width,
                            height: remainingBottom
                        });
                    }
    
                } else {
    
                    // split horizontally
    
                    if (remainingBottom >= minH) {
                        newFreeRects.push({
                            x: fr.x,
                            y: fr.y + height,
                            width: fr.width,
                            height: remainingBottom
                        });
                    }
    
                    if (remainingRight >= minW) {
                        newFreeRects.push({
                            x: fr.x + width,
                            y: fr.y,
                            width: remainingRight,
                            height: height
                        });
                    }
                }
            }
    
            if (newFreeRects.length > rectsCopy.length){
                // prune pass
                for (let j = 0; j < newFreeRects.length; j++) {
                    const frJ = newFreeRects[j];
                    if (!frJ) continue;
                    
                    for (let k = j + 1; k < newFreeRects.length; k++) {
                        const frK = newFreeRects[k];
                        if (!frK) continue;
    
                        if ((
                            newFreeRects[k].x >= newFreeRects[j].x &&
                            newFreeRects[k].y >= newFreeRects[j].y &&
                            newFreeRects[k].x + newFreeRects[k].width <= newFreeRects[j].x + newFreeRects[j].width &&
                            newFreeRects[k].y + newFreeRects[k].height <= newFreeRects[j].y + newFreeRects[j].height
                        )) {    
                            newFreeRects[k] = null;
                        } else if ((
                            newFreeRects[j].x >= newFreeRects[k].x &&
                            newFreeRects[j].y >= newFreeRects[k].y &&
                            newFreeRects[j].x + newFreeRects[j].width <= newFreeRects[k].x + newFreeRects[k].width &&
                            newFreeRects[j].y + newFreeRects[j].height <= newFreeRects[k].y + newFreeRects[k].height
                        )) {    
                            newFreeRects[j] = null;
                            break;
                        }
                    }
                }
            }
            freeRects = [];
    
            for (let j = 0; j < newFreeRects.length; j++){
                if (newFreeRects[j] != null) freeRects.push(newFreeRects[j]);
            }
        }
        return true;
    }
    packSkyLine(size, rectsCopy){
        let skyLineNodes = [{x: 0, y: 0, width: size}]; // whole top is the sky

        for (let i = 0; i < rectsCopy.length; i++){
            const rect = rectsCopy[i];
    
            let bestIdx = -1;
            let minHeight = Infinity;

            const width = rect.width + this.padding;
            const height = rect.height + this.padding;

            for (let j = 0; j < skyLineNodes.length; j++){
                const sL = skyLineNodes[j];

                let fits = false;
                let widthLeft = width;
                let y = sL.y;
                let sLIndex = j;

                while (widthLeft > 0 && sLIndex < skyLineNodes.length){
                    y = Math.max(y, skyLineNodes[sLIndex].y);

                    if (y >= minHeight) break;

                    if (y + height > size) break;

                    widthLeft -= skyLineNodes[sLIndex].width;
                    sLIndex++;
                }

                if (widthLeft > 0) continue;

                if (y < minHeight) {
                    bestIdx = j;
                    minHeight = y;
                }
            }
            if (bestIdx === -1) {
                console.log('failed');
                return false;
            }

            // we place  
            const bestSL = skyLineNodes[bestIdx];
            
            rect.x = bestSL.x;
            rect.y = minHeight;
            
            const bestLeft = bestSL.x;
            const bestRight = bestSL.x + width;

            for (let j = 0; j < skyLineNodes.length; j++){
                const sL = skyLineNodes[j];
                const sLRight = sL.x + sL.width;

                // left overlap is impossible here i think

                if (sL.x < bestRight && sLRight > bestRight){ // right overlap
                    sL.width = sLRight - bestRight;
                    sL.x = bestRight;
                }

                if (sL.x >= bestLeft && sLRight <= bestRight){ // complete overlap
                    skyLineNodes.splice(j, 1);
                    j--;
                }
            }
            skyLineNodes.splice(bestIdx, 0, {x: bestLeft, y: rect.y + height, width: width});
        }
        this.skyLineNodes = skyLineNodes;
        return true;
    }
    packAll(size, rectsCopy, globalMinW, globalMinH, algNum){
        if (algNum == this.algs.GUILLOTINE){
            return this.packGuillotine(size, size, rectsCopy, globalMinW, globalMinH);
        }else if (algNum == this.algs.MAX_RECTS){
            return this.packMaxRects(size, size, rectsCopy, globalMinW, globalMinH);
        }else if (algNum == this.algs.SKYLINE){
            return this.packSkyLine(size,rectsCopy);
        }
    }
    async delayMs(ms){
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    /**
     * Packs an array of rectangles into the smallest possible square/bin using
     * a chosen rectangle packing algorithm (MaxRects, Guillotine, or Skyline).
     *
     * The function performs an adaptive search (binary search) to find the
     * minimum valid packing size.
     *
     * @param {Array<{width: number, height: number}>} rects
     * Array of rectangles to pack. Each rect is modified with x/y placement.
     *
     * @param {Object} [props]
     * Optional configuration object.
     *
     * @param {number} [props.forceAlg]
     * Forces a specific packing algorithm:
     * - 0 = MaxRects (best quality, slower)
     * - 1 = Guillotine (balanced speed/quality)
     * - 2 = Skyline (fastest, slightly lower efficiency)
     *
     * If omitted, the algorithm is automatically selected based on input size.
     *
     * @param {(state: {msg?: string, size?: number}) => void} [getState]
     * Optional callback invoked during packing to report progress.
     * Used for logging/debug/UI updates.
     *
     * @returns {Promise<{bestFit: number, rects: Array}>}
     * Resolves with the smallest valid bin size and the packed rectangles
     * (with x/y coordinates assigned).
    */
    async pack(rects, props = {}, getState){
        let totalArea = 0;
        let maxSide = 0;
        let minWidth = 0; // the biggest rect width is the smallest possible rect that fits all rects width
    
        this.rectLen = rects.length;
    
        rects.sort((a, b) => {
            return Math.max(b.width, b.height) - Math.max(a.width, a.height);
        });
    
        let globalMinW = Infinity;
        let globalMinH = Infinity;
    
        for (let i = 0; i < rects.length; i++){
            const rect = rects[i];
    
            const w = rects[i].width + this.padding;
            const h = rects[i].height + this.padding;
    
            totalArea += w * h;
            minWidth = Math.max(minWidth, w);
    
            maxSide = Math.max(maxSide, w, h);
            if (w < globalMinW) globalMinW = w;
            if (h < globalMinH) globalMinH = h;
    
        } 
    
        const minSidePossible = Math.ceil(Math.sqrt(totalArea));
    
        let low = minSidePossible;
        let high = low;
    
        const rectsCopy = rects.map(r => ({
            x: 0,
            y: 0,
            width: r.width,
            height: r.height,
        }));
            
        const notify = (msg) => {
            if (getState) getState(msg);
        }

        notify({msg: `Packing: ${rects.length}`});

        let delay = 1;
        let lastCorrectLow = high;
    
        let algNum = this.algs.MAX_RECTS;
        if (this.rectLen > this.guillotine_after) algNum = this.algs.GUILLOTINE;
        if (this.rectLen > this.skyline_after) algNum = this.algs.SKYLINE;

        if (props.forceAlg !== undefined) algNum = props.forceAlg;

        if (algNum == this.algs.GUILLOTINE){
            notify({msg: 'Using Guillotine packing (~85-97% coverage)'});
        }
        if (algNum == this.algs.MAX_RECTS){
            notify({msg: 'Using MaxRects packing (~90-99% coverage)'});
        }
        if (algNum == this.algs.SKYLINE){
            notify({msg: 'Using SkyLine packing (~85-92% coverage)'});
        }

        for (;!this.packAll(high, rectsCopy, globalMinW, globalMinH, algNum);){
            if (rects.length > 500) await this.delayMs(delay);
            notify({size: high, msg: `Trying ${high}x${high}...`});
            high*=2;
        }

        for (;high - low > this.accuracy;) {
            if (rects.length > 500) await this.delayMs(delay);
            let mid = Math.floor((low + high) / 2);
    
            const result = this.packAll(mid, rectsCopy, globalMinW, globalMinH, algNum); 
            notify({size: mid, msg: `Trying ${mid}x${mid}...`});
            
            if (result) {
                high = mid; // try smaller
                lastCorrectLow = mid;
            } else {
                low = mid + 1; // need bigger
            }
        }

        this.packAll(lastCorrectLow, rectsCopy, globalMinW, globalMinH, algNum); 

        notify({msg: 'Finished!'});

        return {bestFit: lastCorrectLow, rects: rectsCopy};    
    }
    checkOverlap(rects){
        let overlap = false;
        for (let i = 0; i < rects.length; i++){
            const rect = rects[i];

            for (let j = i + 1; j < rects.length; j++) {
                if (this.intersects(rects[i], rects[j])) {
                    return true;
                } 
            }
        }
        return false;
    }
    drawSkyLineNodes(){
        for (let i = this.skyLineNodes.length-1; i >= 0; i--){
            const s = this.skyLineNodes[i];
            ctx.fillStyle = 'red';
            ctx.fillRect(s.x, s.y, s.width, 5);
        }
    }
}