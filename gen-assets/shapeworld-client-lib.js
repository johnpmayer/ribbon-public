
let wasm;

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

let cachegetUint8Memory0 = null;
function getUint8Memory0() {
    if (cachegetUint8Memory0 === null || cachegetUint8Memory0.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory0;
}

function getStringFromWasm0(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}

const heap = new Array(32).fill(undefined);

heap.push(undefined, null, true, false);

let heap_next = heap.length;

function addHeapObject(obj) {
    if (heap_next === heap.length) heap.push(heap.length + 1);
    const idx = heap_next;
    heap_next = heap[idx];

    heap[idx] = obj;
    return idx;
}

function getObject(idx) { return heap[idx]; }

function dropObject(idx) {
    if (idx < 36) return;
    heap[idx] = heap_next;
    heap_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropObject(idx);
    return ret;
}

let WASM_VECTOR_LEN = 0;

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length);
        getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len);

    const mem = getUint8Memory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3);
        const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachegetInt32Memory0 = null;
function getInt32Memory0() {
    if (cachegetInt32Memory0 === null || cachegetInt32Memory0.buffer !== wasm.memory.buffer) {
        cachegetInt32Memory0 = new Int32Array(wasm.memory.buffer);
    }
    return cachegetInt32Memory0;
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

let cachegetFloat64Memory0 = null;
function getFloat64Memory0() {
    if (cachegetFloat64Memory0 === null || cachegetFloat64Memory0.buffer !== wasm.memory.buffer) {
        cachegetFloat64Memory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachegetFloat64Memory0;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_2.get(state.dtor)(a, state.b);

            } else {
                state.a = a;
            }
        }
    };
    real.original = state;

    return real;
}
function __wbg_adapter_30(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hc4bb03b740c90b9d(arg0, arg1);
}

function __wbg_adapter_33(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hb1f10c7a33b42adb(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_36(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h1c46b079b5c5d42c(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_39(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hc4f97f69227a09a0(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_42(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h084f4d41f7d17036(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_45(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hd309c1e9853ddf91(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_48(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h5f42dcdce1623593(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_51(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hef0fe7e493777d5d(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_54(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h388e7973d033aa82(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_57(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hc87d8ef5132a29bd(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_60(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h8d092f3408cae971(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_63(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h25ac38e4fb337a91(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_66(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__hbb602a354a8ee6c7(arg0, arg1, addHeapObject(arg2));
}

function __wbg_adapter_69(arg0, arg1) {
    wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h643ddec409477727(arg0, arg1);
}

function __wbg_adapter_72(arg0, arg1, arg2) {
    wasm._dyn_core__ops__function__FnMut__A____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h9719fd7bdc6832bd(arg0, arg1, addHeapObject(arg2));
}

/**
* @param {string} server_socket_addr
* @param {string} name
*/
export function run(server_socket_addr, name) {
    var ptr0 = passStringToWasm0(server_socket_addr, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len0 = WASM_VECTOR_LEN;
    var ptr1 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    wasm.run(ptr0, len0, ptr1, len1);
}

function handleError(f) {
    return function () {
        try {
            return f.apply(this, arguments);

        } catch (e) {
            wasm.__wbindgen_exn_store(addHeapObject(e));
        }
    };
}

function getArrayU8FromWasm0(ptr, len) {
    return getUint8Memory0().subarray(ptr / 1, ptr / 1 + len);
}

function notDefined(what) { return () => { throw new Error(`${what} is not defined`); }; }

async function load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {

        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {

        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

async function init(input) {
    if (typeof input === 'undefined') {
        input = import.meta.url.replace(/\.js$/, '_bg.wasm');
    }
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        var ret = getStringFromWasm0(arg0, arg1);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_Window_f826a1dec163bacb = function(arg0) {
        var ret = getObject(arg0).Window;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_WorkerGlobalScope_967d186155183d38 = function(arg0) {
        var ret = getObject(arg0).WorkerGlobalScope;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        var ret = getObject(arg0) === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = takeObject(arg0).original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        var ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_json_parse = function(arg0, arg1) {
        var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_json_serialize = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = JSON.stringify(obj === undefined ? null : obj);
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_object_clone_ref = function(arg0) {
        var ret = getObject(arg0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_mark_e32edf3b52687c6a = function(arg0, arg1) {
        performance.mark(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_measure_0c2a5c5e55e16643 = function(arg0, arg1, arg2, arg3) {
        performance.measure(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_log_75fc43480a5907a7 = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_log_a73f6bdd88fae982 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        console.log(getStringFromWasm0(arg0, arg1), getStringFromWasm0(arg2, arg3), getStringFromWasm0(arg4, arg5), getStringFromWasm0(arg6, arg7));
    };
    imports.wbg.__wbindgen_object_drop_ref = function(arg0) {
        takeObject(arg0);
    };
    imports.wbg.__wbg_error_4bb6c2a97407129a = function(arg0, arg1) {
        try {
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(arg0, arg1);
        }
    };
    imports.wbg.__wbg_new_59cb74e423758ede = function() {
        var ret = new Error();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_stack_558ba5917b466edd = function(arg0, arg1) {
        var ret = getObject(arg1).stack;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_self_86b4b13392c7af56 = handleError(function() {
        var ret = self.self;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_msCrypto_9ad6677321a08dd8 = function(arg0) {
        var ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_crypto_b8c92eaac23d0d80 = function(arg0) {
        var ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getRandomValues_dd27e6b0652b3236 = function(arg0) {
        var ret = getObject(arg0).getRandomValues;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getRandomValues_e57c9b75ddead065 = function(arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    };
    imports.wbg.__wbg_randomFillSync_d2ba53160aec6aba = function(arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
    };
    imports.wbg.__wbg_static_accessor_MODULE_452b4680e8614c81 = function() {
        var ret = module;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_require_f5521a5b85ad2542 = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_self_f865985e662246aa = handleError(function() {
        var ret = self.self;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_msCrypto_f6dddc6ae048b7e2 = function(arg0) {
        var ret = getObject(arg0).msCrypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_crypto_bfb05100db79193b = function(arg0) {
        var ret = getObject(arg0).crypto;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getRandomValues_57e4008f45f0e105 = handleError(function(arg0, arg1) {
        getObject(arg0).getRandomValues(getObject(arg1));
    });
    imports.wbg.__wbg_static_accessor_MODULE_39947eb3fe77895f = function() {
        var ret = module;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_require_c59851dfa0dc7e78 = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).require(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_randomFillSync_d90848a552cbd666 = handleError(function(arg0, arg1, arg2) {
        getObject(arg0).randomFillSync(getArrayU8FromWasm0(arg1, arg2));
    });
    imports.wbg.__wbg_instanceof_WebGl2RenderingContext_f259b779e8a37d5d = function(arg0) {
        var ret = getObject(arg0) instanceof WebGL2RenderingContext;
        return ret;
    };
    imports.wbg.__wbg_bindBufferRange_f36fd4c53eb35923 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).bindBufferRange(arg1 >>> 0, arg2 >>> 0, getObject(arg3), arg4, arg5);
    };
    imports.wbg.__wbg_bindVertexArray_1c571a32554cb96d = function(arg0, arg1) {
        getObject(arg0).bindVertexArray(getObject(arg1));
    };
    imports.wbg.__wbg_bufferData_34c52c73f3b3f15e = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
    };
    imports.wbg.__wbg_bufferData_2a78fbf7d4f9a2f9 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).bufferData(arg1 >>> 0, getArrayU8FromWasm0(arg2, arg3), arg4 >>> 0);
    };
    imports.wbg.__wbg_bufferSubData_65e1f757c823368b = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        getObject(arg0).bufferSubData(arg1 >>> 0, arg2, getArrayU8FromWasm0(arg3, arg4), arg5 >>> 0, arg6 >>> 0);
    };
    imports.wbg.__wbg_copyBufferSubData_cad321e4c82ac541 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).copyBufferSubData(arg1 >>> 0, arg2 >>> 0, arg3, arg4, arg5);
    };
    imports.wbg.__wbg_createVertexArray_51acb43e08d168a2 = function(arg0) {
        var ret = getObject(arg0).createVertexArray();
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_drawElementsInstanced_567e09ca4d0b8f70 = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        getObject(arg0).drawElementsInstanced(arg1 >>> 0, arg2, arg3 >>> 0, arg4, arg5);
    };
    imports.wbg.__wbg_getActiveUniformBlockName_b5b90228462943fa = function(arg0, arg1, arg2, arg3) {
        var ret = getObject(arg1).getActiveUniformBlockName(getObject(arg2), arg3 >>> 0);
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_getActiveUniformBlockParameter_18a75d30b3578599 = handleError(function(arg0, arg1, arg2, arg3) {
        var ret = getObject(arg0).getActiveUniformBlockParameter(getObject(arg1), arg2 >>> 0, arg3 >>> 0);
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_getUniformBlockIndex_388cc41680f0b812 = function(arg0, arg1, arg2, arg3) {
        var ret = getObject(arg0).getUniformBlockIndex(getObject(arg1), getStringFromWasm0(arg2, arg3));
        return ret;
    };
    imports.wbg.__wbg_texImage2D_0aaccdea12ea6081 = handleError(function(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        getObject(arg0).texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    });
    imports.wbg.__wbg_uniformBlockBinding_62c081f3c2803efd = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).uniformBlockBinding(getObject(arg1), arg2 >>> 0, arg3 >>> 0);
    };
    imports.wbg.__wbg_activeTexture_ce973e4a1ff281c1 = function(arg0, arg1) {
        getObject(arg0).activeTexture(arg1 >>> 0);
    };
    imports.wbg.__wbg_attachShader_435c833d3ca8f564 = function(arg0, arg1, arg2) {
        getObject(arg0).attachShader(getObject(arg1), getObject(arg2));
    };
    imports.wbg.__wbg_bindBuffer_b45faf4508424c2a = function(arg0, arg1, arg2) {
        getObject(arg0).bindBuffer(arg1 >>> 0, getObject(arg2));
    };
    imports.wbg.__wbg_bindTexture_13c5db7bd22b86cd = function(arg0, arg1, arg2) {
        getObject(arg0).bindTexture(arg1 >>> 0, getObject(arg2));
    };
    imports.wbg.__wbg_blendEquation_8d3f0c5a72f9c07b = function(arg0, arg1) {
        getObject(arg0).blendEquation(arg1 >>> 0);
    };
    imports.wbg.__wbg_blendFuncSeparate_0cede3ddb2462689 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_clear_e3b5c108ec1393b3 = function(arg0, arg1) {
        getObject(arg0).clear(arg1 >>> 0);
    };
    imports.wbg.__wbg_clearColor_816770046d61cafd = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).clearColor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_compileShader_d9cf97450ba46b86 = function(arg0, arg1) {
        getObject(arg0).compileShader(getObject(arg1));
    };
    imports.wbg.__wbg_createBuffer_34aca55d34936cb7 = function(arg0) {
        var ret = getObject(arg0).createBuffer();
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_createProgram_7f512be46ef2090e = function(arg0) {
        var ret = getObject(arg0).createProgram();
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_createShader_c08686de7661eff0 = function(arg0, arg1) {
        var ret = getObject(arg0).createShader(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_createTexture_2e23958a641af64b = function(arg0) {
        var ret = getObject(arg0).createTexture();
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_cullFace_5c5866af3997fe0b = function(arg0, arg1) {
        getObject(arg0).cullFace(arg1 >>> 0);
    };
    imports.wbg.__wbg_deleteBuffer_f10f1dd760bb72fb = function(arg0, arg1) {
        getObject(arg0).deleteBuffer(getObject(arg1));
    };
    imports.wbg.__wbg_deleteTexture_25d82ac6b74470b3 = function(arg0, arg1) {
        getObject(arg0).deleteTexture(getObject(arg1));
    };
    imports.wbg.__wbg_depthFunc_1a3340a964da766f = function(arg0, arg1) {
        getObject(arg0).depthFunc(arg1 >>> 0);
    };
    imports.wbg.__wbg_disable_5a475e28b2154fa9 = function(arg0, arg1) {
        getObject(arg0).disable(arg1 >>> 0);
    };
    imports.wbg.__wbg_drawArrays_c98946b902ad6be5 = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).drawArrays(arg1 >>> 0, arg2, arg3);
    };
    imports.wbg.__wbg_enable_93767887882fa986 = function(arg0, arg1) {
        getObject(arg0).enable(arg1 >>> 0);
    };
    imports.wbg.__wbg_enableVertexAttribArray_bb2bba2941e17b92 = function(arg0, arg1) {
        getObject(arg0).enableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_generateMipmap_1bfea84cda0b5c28 = function(arg0, arg1) {
        getObject(arg0).generateMipmap(arg1 >>> 0);
    };
    imports.wbg.__wbg_getActiveAttrib_6a8797b7ce109806 = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getActiveAttrib(getObject(arg1), arg2 >>> 0);
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_getActiveUniform_d20d74f99fd35e8f = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getActiveUniform(getObject(arg1), arg2 >>> 0);
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_getAttribLocation_b3fc46ba5862fead = function(arg0, arg1, arg2, arg3) {
        var ret = getObject(arg0).getAttribLocation(getObject(arg1), getStringFromWasm0(arg2, arg3));
        return ret;
    };
    imports.wbg.__wbg_getParameter_0e429e1c094b1b10 = handleError(function(arg0, arg1) {
        var ret = getObject(arg0).getParameter(arg1 >>> 0);
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_getProgramInfoLog_41d3ebfde4246fd9 = function(arg0, arg1, arg2) {
        var ret = getObject(arg1).getProgramInfoLog(getObject(arg2));
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_getProgramParameter_4e13e6daab89623e = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getProgramParameter(getObject(arg1), arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getShaderInfoLog_c9bbabb140e03d0f = function(arg0, arg1, arg2) {
        var ret = getObject(arg1).getShaderInfoLog(getObject(arg2));
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_getShaderParameter_05fa9af4df7ed8dd = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getShaderParameter(getObject(arg1), arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_getUniformLocation_39124d965f679564 = function(arg0, arg1, arg2, arg3) {
        var ret = getObject(arg0).getUniformLocation(getObject(arg1), getStringFromWasm0(arg2, arg3));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_linkProgram_8bc3021aa40f0948 = function(arg0, arg1) {
        getObject(arg0).linkProgram(getObject(arg1));
    };
    imports.wbg.__wbg_scissor_19ca00c5404b43a5 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).scissor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_shaderSource_2dcc20f3552ae568 = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).shaderSource(getObject(arg1), getStringFromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_texParameteri_c36a2e80bbd50560 = function(arg0, arg1, arg2, arg3) {
        getObject(arg0).texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
    };
    imports.wbg.__wbg_uniform1i_5e235ac3cc8f8e9f = function(arg0, arg1, arg2) {
        getObject(arg0).uniform1i(getObject(arg1), arg2);
    };
    imports.wbg.__wbg_useProgram_e1334a2752ff3d80 = function(arg0, arg1) {
        getObject(arg0).useProgram(getObject(arg1));
    };
    imports.wbg.__wbg_vertexAttribPointer_8781b6e5c846817e = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        getObject(arg0).vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
    };
    imports.wbg.__wbg_viewport_7e9633b09867dbf5 = function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).viewport(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_instanceof_Window_fbe0320f34c4cd31 = function(arg0) {
        var ret = getObject(arg0) instanceof Window;
        return ret;
    };
    imports.wbg.__wbg_document_2b44f2a86e03665a = function(arg0) {
        var ret = getObject(arg0).document;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_innerWidth_c4fa0fec0fd477b8 = handleError(function(arg0) {
        var ret = getObject(arg0).innerWidth;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_innerHeight_6344b1c89c013158 = handleError(function(arg0) {
        var ret = getObject(arg0).innerHeight;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_devicePixelRatio_36c226e2b5d4b9c7 = function(arg0) {
        var ret = getObject(arg0).devicePixelRatio;
        return ret;
    };
    imports.wbg.__wbg_cancelAnimationFrame_594443705ec1f21d = handleError(function(arg0, arg1) {
        getObject(arg0).cancelAnimationFrame(arg1);
    });
    imports.wbg.__wbg_matchMedia_033fe3caf7d12eb5 = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).matchMedia(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    });
    imports.wbg.__wbg_requestAnimationFrame_65ebf8f2415064e2 = handleError(function(arg0, arg1) {
        var ret = getObject(arg0).requestAnimationFrame(getObject(arg1));
        return ret;
    });
    imports.wbg.__wbg_get_8d1433ebd6a5186d = function(arg0, arg1, arg2) {
        var ret = getObject(arg0)[getStringFromWasm0(arg1, arg2)];
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_clearTimeout_691ea78b4285bbea = function(arg0, arg1) {
        getObject(arg0).clearTimeout(arg1);
    };
    imports.wbg.__wbg_fetch_76b1744c97486cd4 = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).fetch(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_setTimeout_62ddbd1dbc58b759 = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).setTimeout(getObject(arg1), arg2);
        return ret;
    });
    imports.wbg.__wbg_data_b59dd3983cd7c614 = function(arg0) {
        var ret = getObject(arg0).data;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_now_5ae3d18d57dd226f = function(arg0) {
        var ret = getObject(arg0).now();
        return ret;
    };
    imports.wbg.__wbg_addEventListener_63378230aa6735d7 = handleError(function(arg0, arg1, arg2, arg3) {
        getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
    });
    imports.wbg.__wbg_addEventListener_e8fdfac380f9ea25 = handleError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).addEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3), getObject(arg4));
    });
    imports.wbg.__wbg_removeEventListener_19da1e4551104118 = handleError(function(arg0, arg1, arg2, arg3) {
        getObject(arg0).removeEventListener(getStringFromWasm0(arg1, arg2), getObject(arg3));
    });
    imports.wbg.__wbg_status_ce8daa58eb4f7423 = handleError(function(arg0) {
        var ret = getObject(arg0).status;
        return ret;
    });
    imports.wbg.__wbg_responseText_c10e86274e44cd7f = handleError(function(arg0, arg1) {
        var ret = getObject(arg1).responseText;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    });
    imports.wbg.__wbg_new_96f2b9d79dce4775 = handleError(function() {
        var ret = new XMLHttpRequest();
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_open_d25020990de2729c = handleError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).open(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    });
    imports.wbg.__wbg_send_9bf4b6fc30c45d19 = handleError(function(arg0, arg1, arg2) {
        getObject(arg0).send(arg1 === 0 ? undefined : getStringFromWasm0(arg1, arg2));
    });
    imports.wbg.__wbg_charCode_c6dcb643d56248cd = function(arg0) {
        var ret = getObject(arg0).charCode;
        return ret;
    };
    imports.wbg.__wbg_keyCode_9de4c14bf3d88f3c = function(arg0) {
        var ret = getObject(arg0).keyCode;
        return ret;
    };
    imports.wbg.__wbg_altKey_9a5448cda4b8c161 = function(arg0) {
        var ret = getObject(arg0).altKey;
        return ret;
    };
    imports.wbg.__wbg_ctrlKey_3b651d58cff29579 = function(arg0) {
        var ret = getObject(arg0).ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_shiftKey_64fbb7a0afa8c5fa = function(arg0) {
        var ret = getObject(arg0).shiftKey;
        return ret;
    };
    imports.wbg.__wbg_metaKey_4a44b03d9be0f1aa = function(arg0) {
        var ret = getObject(arg0).metaKey;
        return ret;
    };
    imports.wbg.__wbg_key_3cc6551a67a37a79 = function(arg0, arg1) {
        var ret = getObject(arg1).key;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_code_5f0608a8d1b7d1db = function(arg0, arg1) {
        var ret = getObject(arg1).code;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_getModifierState_1eeb36fe47208eb3 = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).getModifierState(getStringFromWasm0(arg1, arg2));
        return ret;
    };
    imports.wbg.__wbg_new_f447844bee2d63ec = handleError(function(arg0) {
        var ret = new RTCIceCandidate(getObject(arg0));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_instanceof_RtcSessionDescription_08d92e473321bc3b = function(arg0) {
        var ret = getObject(arg0) instanceof RTCSessionDescription;
        return ret;
    };
    imports.wbg.__wbg_type_a1253f761730c77c = function(arg0) {
        var ret = getObject(arg0).type;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_sdp_9abb5a396c3abf37 = function(arg0, arg1) {
        var ret = getObject(arg1).sdp;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_type_1239cde25586fcab = function(arg0) {
        var ret = getObject(arg0).type;
        return ret;
    };
    imports.wbg.__wbg_name_ad1ecd078b0a7b97 = function(arg0, arg1) {
        var ret = getObject(arg1).name;
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbg_target_62e7aaed452a6541 = function(arg0) {
        var ret = getObject(arg0).target;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_cancelBubble_a4349da6fa1d1e4f = function(arg0) {
        var ret = getObject(arg0).cancelBubble;
        return ret;
    };
    imports.wbg.__wbg_preventDefault_4eb36ec8e5563ad6 = function(arg0) {
        getObject(arg0).preventDefault();
    };
    imports.wbg.__wbg_stopPropagation_a8397a950849e3f6 = function(arg0) {
        getObject(arg0).stopPropagation();
    };
    imports.wbg.__wbg_instanceof_HtmlCanvasElement_bd2459c62d076bcd = function(arg0) {
        var ret = getObject(arg0) instanceof HTMLCanvasElement;
        return ret;
    };
    imports.wbg.__wbg_width_8225e9e48185d280 = function(arg0) {
        var ret = getObject(arg0).width;
        return ret;
    };
    imports.wbg.__wbg_setwidth_80b60efe20240a3e = function(arg0, arg1) {
        getObject(arg0).width = arg1 >>> 0;
    };
    imports.wbg.__wbg_height_c55678b905b560e1 = function(arg0) {
        var ret = getObject(arg0).height;
        return ret;
    };
    imports.wbg.__wbg_setheight_5c308278bb4139ed = function(arg0, arg1) {
        getObject(arg0).height = arg1 >>> 0;
    };
    imports.wbg.__wbg_getContext_11f724663952b3c1 = handleError(function(arg0, arg1, arg2, arg3) {
        var ret = getObject(arg0).getContext(getStringFromWasm0(arg1, arg2), getObject(arg3));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    });
    imports.wbg.__wbg_matches_cfe9c516ae19f39b = function(arg0) {
        var ret = getObject(arg0).matches;
        return ret;
    };
    imports.wbg.__wbg_addListener_4dbcd9f3252931c8 = handleError(function(arg0, arg1) {
        getObject(arg0).addListener(getObject(arg1));
    });
    imports.wbg.__wbg_removeListener_8e03ee7295ded298 = handleError(function(arg0, arg1) {
        getObject(arg0).removeListener(getObject(arg1));
    });
    imports.wbg.__wbg_x_11fb85648a0b7137 = function(arg0) {
        var ret = getObject(arg0).x;
        return ret;
    };
    imports.wbg.__wbg_y_b7910e55f598e1dc = function(arg0) {
        var ret = getObject(arg0).y;
        return ret;
    };
    imports.wbg.__wbg_appendChild_98dedaeac24501f2 = handleError(function(arg0, arg1) {
        var ret = getObject(arg0).appendChild(getObject(arg1));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_clientX_df24871aabb01061 = function(arg0) {
        var ret = getObject(arg0).clientX;
        return ret;
    };
    imports.wbg.__wbg_clientY_b91be9a030c7bd7c = function(arg0) {
        var ret = getObject(arg0).clientY;
        return ret;
    };
    imports.wbg.__wbg_offsetX_94c9b1e16e81033a = function(arg0) {
        var ret = getObject(arg0).offsetX;
        return ret;
    };
    imports.wbg.__wbg_offsetY_7a5e47fc44c400e9 = function(arg0) {
        var ret = getObject(arg0).offsetY;
        return ret;
    };
    imports.wbg.__wbg_ctrlKey_eb7dba635c32dc7f = function(arg0) {
        var ret = getObject(arg0).ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_shiftKey_31c1bdd985f9be8e = function(arg0) {
        var ret = getObject(arg0).shiftKey;
        return ret;
    };
    imports.wbg.__wbg_altKey_a40ec4c5074686f1 = function(arg0) {
        var ret = getObject(arg0).altKey;
        return ret;
    };
    imports.wbg.__wbg_metaKey_d67dff8c6652544a = function(arg0) {
        var ret = getObject(arg0).metaKey;
        return ret;
    };
    imports.wbg.__wbg_button_d650056716876a47 = function(arg0) {
        var ret = getObject(arg0).button;
        return ret;
    };
    imports.wbg.__wbg_buttons_7c50ee2fdde8e486 = function(arg0) {
        var ret = getObject(arg0).buttons;
        return ret;
    };
    imports.wbg.__wbg_body_08ba7a3043ff8e77 = function(arg0) {
        var ret = getObject(arg0).body;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_fullscreenElement_c5e89c878e199ef8 = function(arg0) {
        var ret = getObject(arg0).fullscreenElement;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_createElement_7cbe07ad3289abea = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).createElement(getStringFromWasm0(arg1, arg2));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_exitFullscreen_dfc8bfbc2f8c8caa = function(arg0) {
        getObject(arg0).exitFullscreen();
    };
    imports.wbg.__wbg_querySelector_be2514e5de79507f = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).querySelector(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    });
    imports.wbg.__wbg_getBoundingClientRect_813f74e2f4f344e2 = function(arg0) {
        var ret = getObject(arg0).getBoundingClientRect();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_requestFullscreen_3908b12ff707a58a = handleError(function(arg0) {
        getObject(arg0).requestFullscreen();
    });
    imports.wbg.__wbg_setAttribute_b638fce95071fff6 = handleError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    });
    imports.wbg.__wbg_setPointerCapture_32e6c85c6de6003f = handleError(function(arg0, arg1) {
        getObject(arg0).setPointerCapture(arg1);
    });
    imports.wbg.__wbg_debug_6caa7e8684a5b22d = function(arg0) {
        console.debug(getObject(arg0));
    };
    imports.wbg.__wbg_error_9783be44659339ea = function(arg0) {
        console.error(getObject(arg0));
    };
    imports.wbg.__wbg_error_b0449737f51f454d = function(arg0, arg1) {
        console.error(getObject(arg0), getObject(arg1));
    };
    imports.wbg.__wbg_info_d458d4c6ed836a93 = function(arg0) {
        console.info(getObject(arg0));
    };
    imports.wbg.__wbg_log_2e875b1d2f6f87ac = function(arg0) {
        console.log(getObject(arg0));
    };
    imports.wbg.__wbg_warn_632e55193637edf0 = function(arg0) {
        console.warn(getObject(arg0));
    };
    imports.wbg.__wbg_style_854f82bcc16efd28 = function(arg0) {
        var ret = getObject(arg0).style;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_clearTimeout_e97232387865edcf = function(arg0, arg1) {
        getObject(arg0).clearTimeout(arg1);
    };
    imports.wbg.__wbg_setTimeout_e5c727d4159ae515 = handleError(function(arg0, arg1, arg2) {
        var ret = getObject(arg0).setTimeout(getObject(arg1), arg2);
        return ret;
    });
    imports.wbg.__wbindgen_number_new = function(arg0) {
        var ret = arg0;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_setProperty_e3d42ccff5ebac2f = handleError(function(arg0, arg1, arg2, arg3, arg4) {
        getObject(arg0).setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    });
    imports.wbg.__wbg_localDescription_9f673e999215f075 = function(arg0) {
        var ret = getObject(arg0).localDescription;
        return isLikeNone(ret) ? 0 : addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithconfiguration_caa5923929082ab4 = handleError(function(arg0) {
        var ret = new RTCPeerConnection(getObject(arg0));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_addIceCandidate_73516b870e52bb77 = function(arg0, arg1, arg2, arg3) {
        var ret = getObject(arg0).addIceCandidate(getObject(arg1), getObject(arg2), getObject(arg3));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createDataChannel_c882671e496f8b98 = function(arg0, arg1, arg2, arg3) {
        var ret = getObject(arg0).createDataChannel(getStringFromWasm0(arg1, arg2), getObject(arg3));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_createOffer_adb198d221754b2c = function(arg0) {
        var ret = getObject(arg0).createOffer();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_setLocalDescription_7a6f3a7f7b17b0c2 = function(arg0, arg1) {
        var ret = getObject(arg0).setLocalDescription(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_setRemoteDescription_c3de2e9a23167e7b = function(arg0, arg1, arg2, arg3) {
        var ret = getObject(arg0).setRemoteDescription(getObject(arg1), getObject(arg2), getObject(arg3));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_deltaX_6db9b75fa9a51024 = function(arg0) {
        var ret = getObject(arg0).deltaX;
        return ret;
    };
    imports.wbg.__wbg_deltaY_f2e82bfd030f24e4 = function(arg0) {
        var ret = getObject(arg0).deltaY;
        return ret;
    };
    imports.wbg.__wbg_deltaMode_6e3c8d5ed2afcaf8 = function(arg0) {
        var ret = getObject(arg0).deltaMode;
        return ret;
    };
    imports.wbg.__wbg_setonload_8bafcddcb9002f04 = function(arg0, arg1) {
        getObject(arg0).onload = getObject(arg1);
    };
    imports.wbg.__wbg_matches_b0b5c3f4db00c9b8 = function(arg0) {
        var ret = getObject(arg0).matches;
        return ret;
    };
    imports.wbg.__wbg_pointerId_3d3249dda347fa45 = function(arg0) {
        var ret = getObject(arg0).pointerId;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Response_692fcbbfbfd64a77 = function(arg0) {
        var ret = getObject(arg0) instanceof Response;
        return ret;
    };
    imports.wbg.__wbg_arrayBuffer_02aa93c3b506b861 = handleError(function(arg0) {
        var ret = getObject(arg0).arrayBuffer();
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_setonopen_bc16d187717c350a = function(arg0, arg1) {
        getObject(arg0).onopen = getObject(arg1);
    };
    imports.wbg.__wbg_setonerror_4e593f238d95e908 = function(arg0, arg1) {
        getObject(arg0).onerror = getObject(arg1);
    };
    imports.wbg.__wbg_setonmessage_baeed4628b372784 = function(arg0, arg1) {
        getObject(arg0).onmessage = getObject(arg1);
    };
    imports.wbg.__wbg_setbinaryType_c868214e97689752 = function(arg0, arg1) {
        getObject(arg0).binaryType = takeObject(arg1);
    };
    imports.wbg.__wbg_send_c72a10f4fa86140a = handleError(function(arg0, arg1, arg2) {
        getObject(arg0).send(getArrayU8FromWasm0(arg1, arg2));
    });
    imports.wbg.__wbg_instanceof_ArrayBuffer_c1c493728d7c2825 = function(arg0) {
        var ret = getObject(arg0) instanceof ArrayBuffer;
        return ret;
    };
    imports.wbg.__wbg_newnoargs_ab5e899738c0eff4 = function(arg0, arg1) {
        var ret = new Function(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_call_ab183a630df3a257 = handleError(function(arg0, arg1) {
        var ret = getObject(arg0).call(getObject(arg1));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_now_c110383288150953 = function() {
        var ret = Date.now();
        return ret;
    };
    imports.wbg.__wbg_is_e8ad5aa6da4b8c83 = function(arg0, arg1) {
        var ret = Object.is(getObject(arg0), getObject(arg1));
        return ret;
    };
    imports.wbg.__wbg_new_dc5b27cfd2149b8f = function() {
        var ret = new Object();
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_resolve_9b0f9ddf5f89cb1e = function(arg0) {
        var ret = Promise.resolve(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_b4358f6ec1ee6657 = function(arg0, arg1) {
        var ret = getObject(arg0).then(getObject(arg1));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_then_3d9a54b0affdf26d = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).then(getObject(arg1), getObject(arg2));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_globalThis_34bac2d08ebb9b58 = handleError(function() {
        var ret = globalThis.globalThis;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_self_77eca7b42660e1bb = handleError(function() {
        var ret = self.self;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_window_51dac01569f1ba70 = handleError(function() {
        var ret = window.window;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_global_1c436164a66c9c22 = handleError(function() {
        var ret = global.global;
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_instanceof_Int32Array_3106a47118c82967 = function(arg0) {
        var ret = getObject(arg0) instanceof Int32Array;
        return ret;
    };
    imports.wbg.__wbg_getindex_1ed98ad816479f7f = function(arg0, arg1) {
        var ret = getObject(arg0)[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_new_22a33711cf65b661 = function(arg0) {
        var ret = new Uint8Array(getObject(arg0));
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_newwithlength_48451d71403bfede = function(arg0) {
        var ret = new Uint8Array(arg0 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_subarray_6b2dd31c84ee881f = function(arg0, arg1, arg2) {
        var ret = getObject(arg0).subarray(arg1 >>> 0, arg2 >>> 0);
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_length_e9f6f145de2fede5 = function(arg0) {
        var ret = getObject(arg0).length;
        return ret;
    };
    imports.wbg.__wbg_set_b29de3f25280c6ec = function(arg0, arg1, arg2) {
        getObject(arg0).set(getObject(arg1), arg2 >>> 0);
    };
    imports.wbg.__wbg_parse_58b7cdbfa2b3e55a = handleError(function(arg0, arg1) {
        var ret = JSON.parse(getStringFromWasm0(arg0, arg1));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_buffer_bc64154385c04ac4 = function(arg0) {
        var ret = getObject(arg0).buffer;
        return addHeapObject(ret);
    };
    imports.wbg.__wbg_get_4bab9404e99a1f85 = handleError(function(arg0, arg1) {
        var ret = Reflect.get(getObject(arg0), getObject(arg1));
        return addHeapObject(ret);
    });
    imports.wbg.__wbg_set_3afd31f38e771338 = handleError(function(arg0, arg1, arg2) {
        var ret = Reflect.set(getObject(arg0), getObject(arg1), getObject(arg2));
        return ret;
    });
    imports.wbg.__wbg_random_eb1fab8e1db2d9d1 = typeof Math.random == 'function' ? Math.random : notDefined('Math.random');
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = typeof(obj) === 'number' ? obj : undefined;
        getFloat64Memory0()[arg0 / 8 + 1] = isLikeNone(ret) ? 0 : ret;
        getInt32Memory0()[arg0 / 4 + 0] = !isLikeNone(ret);
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = getObject(arg1);
        var ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr0 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = getObject(arg0);
        var ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        var ret = debugString(getObject(arg1));
        var ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        getInt32Memory0()[arg0 / 4 + 1] = len0;
        getInt32Memory0()[arg0 / 4 + 0] = ptr0;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbindgen_memory = function() {
        var ret = wasm.memory;
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper12150 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 669, __wbg_adapter_30);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper13284 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 852, __wbg_adapter_33);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper13286 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 858, __wbg_adapter_36);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper13288 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 854, __wbg_adapter_39);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper13290 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 856, __wbg_adapter_42);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper16192 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 1112, __wbg_adapter_45);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper16194 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 1102, __wbg_adapter_48);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper16196 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 1108, __wbg_adapter_51);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper16198 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 1104, __wbg_adapter_54);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper16200 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 1116, __wbg_adapter_57);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper16202 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 1110, __wbg_adapter_60);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper16204 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 1114, __wbg_adapter_63);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper16206 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 1106, __wbg_adapter_66);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper97747 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 7684, __wbg_adapter_69);
        return addHeapObject(ret);
    };
    imports.wbg.__wbindgen_closure_wrapper102909 = function(arg0, arg1, arg2) {
        var ret = makeMutClosure(arg0, arg1, 7839, __wbg_adapter_72);
        return addHeapObject(ret);
    };

    if (typeof input === 'string' || (typeof Request === 'function' && input instanceof Request) || (typeof URL === 'function' && input instanceof URL)) {
        input = fetch(input);
    }

    const { instance, module } = await load(await input, imports);

    wasm = instance.exports;
    init.__wbindgen_wasm_module = module;

    return wasm;
}

export default init;

