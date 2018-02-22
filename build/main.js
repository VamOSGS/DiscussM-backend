require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 8);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("koa-router");

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = check;
/* harmony export (immutable) */ __webpack_exports__["d"] = register;
/* harmony export (immutable) */ __webpack_exports__["c"] = login;
/* harmony export (immutable) */ __webpack_exports__["e"] = sendMessage;
/* harmony export (immutable) */ __webpack_exports__["b"] = getMessages;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bcrypt_nodejs__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bcrypt_nodejs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bcrypt_nodejs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jwt_koa__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jwt_koa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jwt_koa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_index_js__ = __webpack_require__(15);







async function check(details) {
    return __WEBPACK_IMPORTED_MODULE_2__models_index_js__["b" /* User */].findOne(details);
}

async function register(data) {
    return check({ username: data.username }).then(res => {
        if (res === null) {
            return check({ email: data.email }).then(async res2 => {
                if (res2 === null) {
                    const user = new __WEBPACK_IMPORTED_MODULE_2__models_index_js__["b" /* User */]({
                        username: data.username,
                        name: data.name,
                        age: data.age,
                        email: data.email,
                        gender: data.gender
                    });
                    user.image = data.image === '' ? '/uploads/user-default.png' : data.image;

                    const salt = __WEBPACK_IMPORTED_MODULE_0_bcrypt_nodejs___default.a.genSaltSync(10);
                    user.password = __WEBPACK_IMPORTED_MODULE_0_bcrypt_nodejs___default.a.hashSync(data.password, salt);
                    return user.save().then(user => {
                        const token = Object(__WEBPACK_IMPORTED_MODULE_1_jwt_koa__["createToken"])({ user }, '10m');
                        return { success: true, user, token };
                    });
                } else {
                    return {
                        success: false,
                        error: {
                            field: 'email',
                            message: 'Email registred!'
                        }
                    };
                }
            });
        } else {
            return {
                success: false,
                error: { field: 'username', message: 'Username taken!' }
            };
        }
    });
}

async function login(data) {
    return check({ username: data.username }).then(user => {
        if (user === null) {
            return {
                success: false,
                error: { field: 'username', message: 'User not found!' }
            };
        } else {
            const passCheck = __WEBPACK_IMPORTED_MODULE_0_bcrypt_nodejs___default.a.compareSync(data.password, user.password);
            if (passCheck === true) {
                const token = Object(__WEBPACK_IMPORTED_MODULE_1_jwt_koa__["createToken"])({ user }, '10m');
                return { success: true, user, token };
            } else {
                return {
                    success: false,
                    error: { field: 'password', message: 'Wrong password!' }
                };
            }
        }
    });
}

function sendMessage(data) {
    return new Promise((resolve, reject) => {
        check({ username: data.to.username }).then(user => {
            if (user === null) {
                reject({
                    success: false,
                    error: { field: 'user', message: 'Wrong password!' }
                });
            } else {
                __WEBPACK_IMPORTED_MODULE_2__models_index_js__["a" /* Message */].findOneAndUpdate({ user: data.to }, {
                    $push: { messages: data.message }
                }, { new: true, safe: true, upsert: true }, (err, res) => {
                    if (err) {
                        reject({
                            success: false,
                            message: 'Message isn\'t sent!'
                        });
                    }
                    resolve({ success: true, res });
                });
            }
        });
    });
}

async function getMessages(user) {
    return __WEBPACK_IMPORTED_MODULE_2__models_index_js__["a" /* Message */].findOne({ user });
}

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("koa");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("jwt-koa");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("koa-bodyparser");

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(9);


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_koa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__koa_cors__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__koa_cors___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__koa_cors__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__router__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_start__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_koa_mount__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_koa_mount___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_koa_mount__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_serveFront__ = __webpack_require__(25);







if (false) require('dotenv').config();

const app = new __WEBPACK_IMPORTED_MODULE_0_koa___default.a();
const api = new __WEBPACK_IMPORTED_MODULE_0_koa___default.a();

Object(__WEBPACK_IMPORTED_MODULE_3__utils_start__["a" /* default */])(app);
api.use(__WEBPACK_IMPORTED_MODULE_1__koa_cors___default()('*'));
api.use(__WEBPACK_IMPORTED_MODULE_2__router__["a" /* default */]);

app.use(__WEBPACK_IMPORTED_MODULE_4_koa_mount___default()('/api', api));
app.use(__WEBPACK_IMPORTED_MODULE_4_koa_mount___default()('/', __WEBPACK_IMPORTED_MODULE_5__utils_serveFront__["a" /* default */]));

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("@koa/cors");

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa_combine_routers__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa_combine_routers___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_koa_combine_routers__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__root__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__auth__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__messages__ = __webpack_require__(21);





const router = __WEBPACK_IMPORTED_MODULE_0_koa_combine_routers___default()([__WEBPACK_IMPORTED_MODULE_1__root__["a" /* default */], __WEBPACK_IMPORTED_MODULE_3__messages__["a" /* default */], __WEBPACK_IMPORTED_MODULE_2__auth__["a" /* default */]]);

/* harmony default export */ __webpack_exports__["a"] = (router);

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("koa-combine-routers");

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa_router__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_koa_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jwt_koa__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_jwt_koa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_jwt_koa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__db_methods__ = __webpack_require__(1);





const root = new __WEBPACK_IMPORTED_MODULE_0_koa_router___default.a();

root.get('/check', __WEBPACK_IMPORTED_MODULE_1_jwt_koa___default.a.middleware, ctx => {
    ctx.body = 'SECRET';
});
root.get('/user/:username', async ctx => {
    const { username } = ctx.params;
    const user = await Object(__WEBPACK_IMPORTED_MODULE_2__db_methods__["a" /* check */])({ username });
    if (user == null) {
        ctx.body = {
            success: false,
            message: 'User not found'
        };
    } else {
        ctx.body = {
            success: true,
            id: user._id,
            username: user.username,
            image: user.image,
            name: user.name,
            gender: user.gender,
            age: user.age
        };
    }
});
root.get('/', async ctx => {
    ctx.body = ` <h1>Working...</h1>`;
});

/* harmony default export */ __webpack_exports__["a"] = (root);

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("bcrypt-nodejs");

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__message__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__user__ = __webpack_require__(17);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_0__message__["a"]; });
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_1__user__["a"]; });






/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bluebird__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_bluebird__);


__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Promise = __WEBPACK_IMPORTED_MODULE_1_bluebird___default.a;

const MessageSchema = new __WEBPACK_IMPORTED_MODULE_0_mongoose__["Schema"]({
    user: {
        id: { type: String, required: true },
        username: { type: String, required: true }
    },
    messages: { type: Array }
});

const message = __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.model('Message', MessageSchema);

/* harmony default export */ __webpack_exports__["a"] = (message);

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bluebird__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_bluebird___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_bluebird__);



__WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.Promise = __WEBPACK_IMPORTED_MODULE_1_bluebird___default.a;

const UserSchema = new __WEBPACK_IMPORTED_MODULE_0_mongoose__["Schema"]({
    username: { type: String, required: true, index: { unique: true } },
    name: { type: String },
    gender: { type: String, required: true },
    image: { type: String },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    password: { type: String } // social auth will not have password
});

const user = __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.model('User', UserSchema);

/* harmony default export */ __webpack_exports__["a"] = (user);

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa_router__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_koa_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa_bodyparser__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa_bodyparser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_koa_bodyparser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__db_methods__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_upload__ = __webpack_require__(19);





const auth = new __WEBPACK_IMPORTED_MODULE_0_koa_router___default.a();

auth.post('/login', __WEBPACK_IMPORTED_MODULE_1_koa_bodyparser___default()(), async ctx => {
    if (ctx.request.body.username && ctx.request.body.password) {
        await Object(__WEBPACK_IMPORTED_MODULE_2__db_methods__["c" /* login */])(ctx.request.body).then(res => {
            ctx.response.body = res;
        });
    } else {
        ctx.response.body = { success: true, message: 'no enough data!' };
    }
});

auth.post('/register', __WEBPACK_IMPORTED_MODULE_3__utils_upload__["a" /* default */].single('file'), __WEBPACK_IMPORTED_MODULE_1_koa_bodyparser___default()(), async ctx => {
    const { username, password, email, gender, age } = ctx.req.body;
    if (username && password && email && gender && age) {
        const image = ctx.req.file ? `/uploads/${ctx.req.file.filename}` : '';
        const userBody = Object.assign({}, ctx.req.body, {
            image
        });
        await Object(__WEBPACK_IMPORTED_MODULE_2__db_methods__["d" /* register */])(userBody).then(res => {
            ctx.response.body = res;
        });
    } else {
        ctx.response.body = { success: false, message: 'no enough data!' };
    }
});

/* harmony default export */ __webpack_exports__["a"] = (auth);

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa_multer__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa_multer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_koa_multer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_path__);



const storage = __WEBPACK_IMPORTED_MODULE_0_koa_multer___default.a.diskStorage({
    destination: (req, file, cb) => {
        cb(null, __WEBPACK_IMPORTED_MODULE_1_path___default.a.resolve('./static/uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const upload = __WEBPACK_IMPORTED_MODULE_0_koa_multer___default()({ storage });

/* harmony default export */ __webpack_exports__["a"] = (upload);

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("koa-multer");

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa_router__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_koa_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa_bodyparser__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa_bodyparser___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_koa_bodyparser__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__db_methods__ = __webpack_require__(1);




const messages = new __WEBPACK_IMPORTED_MODULE_0_koa_router___default.a();

messages.post('/send', __WEBPACK_IMPORTED_MODULE_1_koa_bodyparser___default()(), async ctx => {
    await Object(__WEBPACK_IMPORTED_MODULE_2__db_methods__["e" /* sendMessage */])(ctx.request.body).then(res => {
        ctx.response.body = {
            success: res.success
        };
    }).catch(e => {
        ctx.response.body = e;
    });
});

messages.patch('/messages', __WEBPACK_IMPORTED_MODULE_1_koa_bodyparser___default()(), async ctx => {
    await Object(__WEBPACK_IMPORTED_MODULE_2__db_methods__["b" /* getMessages */])(ctx.request.body).then(res => {
        if (res === null) {
            ctx.response.body = { messages: [], success: true };
        } else {
            ctx.response.body = { messages: res.messages, success: true };
        }
    });
});

/* harmony default export */ __webpack_exports__["a"] = (messages);

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__db___ = __webpack_require__(23);
if (false) require('dotenv').config();


const { PORT, HOST } = process.env;

/* harmony default export */ __webpack_exports__["a"] = (function (app) {
    Object(__WEBPACK_IMPORTED_MODULE_0__db___["a" /* default */])();
    app.listen(PORT || 8000, () => console.log(`started in http://${HOST}:${PORT}`));
});

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mongoose___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mongoose__);
if (false) require('dotenv').config();


const { DB_USER, DB_USER_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;

/* harmony default export */ __webpack_exports__["a"] = (function () {
    __WEBPACK_IMPORTED_MODULE_0_mongoose___default.a.connect(`mongodb://${DB_USER}:${DB_USER_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`);
});

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("koa-mount");

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa_static__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_koa_static___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_koa_static__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa_send__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_koa_send___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_koa_send__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_koa__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_koa___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_koa__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_koa_router__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_koa_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_koa_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_path__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_path___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_path__);






const front = new __WEBPACK_IMPORTED_MODULE_2_koa___default.a();
const router = new __WEBPACK_IMPORTED_MODULE_3_koa_router___default.a();

front.use(__WEBPACK_IMPORTED_MODULE_0_koa_static___default()(__WEBPACK_IMPORTED_MODULE_4_path___default.a.resolve('static')));
front.use(router.routes());
front.use(router.allowedMethods());

router.get('*', async ctx => {
    const { url } = ctx;
    switch (url) {
        case '/user/style.css':
            await __WEBPACK_IMPORTED_MODULE_1_koa_send___default()(ctx, './static/style.css');
            break;
        case '/user/bundle.js':
            await __WEBPACK_IMPORTED_MODULE_1_koa_send___default()(ctx, './static/bundle.js');
            break;
        case '/user/style.css.map':
            await __WEBPACK_IMPORTED_MODULE_1_koa_send___default()(ctx, './static/style.css.map');
            break;
        default:
            await __WEBPACK_IMPORTED_MODULE_1_koa_send___default()(ctx, './static/index.html');

            break;
    }
});

/* harmony default export */ __webpack_exports__["a"] = (front);

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("koa-static");

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("koa-send");

/***/ })
/******/ ]);
//# sourceMappingURL=main.map