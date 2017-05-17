'use strict';

var lrSnippet = require ('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
	return connect.static (require ('path').resolve (dir));
};
var proxySnippet = require ('grunt-connect-proxy/lib/utils').proxyRequest;

module.exports = function (grunt) {

	require ('load-grunt-tasks') (grunt);

	require ('time-grunt') (grunt);

	// Configurable paths for the application
	var appConfig = {
		app: 'app',
		dist: 'public',
		tmp: '.tmp',
		html: 'html'
	};
	grunt.file.defaultEncoding = 'utf-8';

	// Define the configuration for all the tasks
	grunt.initConfig ({

		// Project settings
		project: appConfig,

		// Watches files for changes and runs tasks based on the changed files
		//监听文件变化执行，相应任务，实现文件变化后，浏览器可以及时变化
		watch: {
			bower: {
				files: ['bower.json'],
				tasks: ['wiredep']
			},
			js: {
				files: ['<%= project.app %>/**/*.js', 'bower_components/**/*.js'],
				tasks: ['newer:jshint:all'],
				//options: {
				//    livereload: '<%= connect.options.livereload %>'
				//}
			},
			loadStates: {
				files: ['<%= project.app %>/**/*-state.js'],
				tasks: ['loadStates'],
				//options: {
				//    livereload: '<%= connect.options.livereload %>'
				//}
			},
			jsTest: {
				files: ['test/spec/**/*.js'],
				tasks: ['newer:jshint:test', 'karma']
			},
			/*compass: {
			 files: ['<%= project.app %>/styles/!**!/!*.{scss,sass}'],
			 tasks: ['compass:server', 'autoprefixer']
			 },*/
			less: {
				files: ['<%= project.app %>/**/*.less'],
				tasks: ['less:dist', 'autoprefixer']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			}
			//livereload: {
			//    options: {
			//        livereload: '<%= connect.options.livereload %>'
			//    },
			//    files: [
			//        '<%= project.app %>/**/*.html',
			//        '<%= project.html %>/**/*.html',
			//        '<%= project.tmp %>/**/*.css',
			//        '<%= project.app %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
			//        '<%= project.app %>/**/js/const/*.json'
			//    ]
			//}
		},

		// The actual grunt server settings
		// 启动grunt server任务后的服务器设置,connect中不可以使用<%=%>这种变量表达式
		connect: {
			options: {
				port: 9000,
				// Change this to '0.0.0.0' to access the server from outside.
				hostname: '0.0.0.0',
				livereload: 35729
			},
			proxies: [
				{
                    context: '/FxbManager',
                    host: '192.168.1.110',
                    //host: '192.168.1.97',
                    port: 8080,
                    https: false,
					changeOrigin: true
				}],
			livereload: {
				options: {
					open: true,
					debug: true,
					middleware: function (connect) {
						return [
							lrSnippet,
							mountFolder (connect, appConfig.app),
							mountFolder (connect, appConfig.tmp),
							mountFolder (connect, './' + appConfig.app),
							mountFolder (connect, 'test'),
							connect ().use ('/bower_components', connect.static ('./bower_components')),// 静态资源目录的真实路径映射
							connect ().use ('/admin/styles', connect.static ('./admin/styles')),
							connect ().use ('/front/styles', connect.static ('./front/styles')),
							connect ().use ('/mfs', connect.static ('z:\\')),
							proxySnippet
						];
					}
				}
			},
			test: {//测试环境使用
				options: {
					port: 9001,
					middleware: function (connect) {
						return [
							connect.static ('<%= project.tmp %>'),
							connect.static ('test'),
							connect ().use ('/bower_components', connect.static ('./bower_components')),
							connect.static (appConfig.app)
						];
					}
				}
			},
			static: {//美工环境使用纯前端
				options: {
					port: 9002,
					livereload: 35721,
					middleware: function (connect) {
						return [
							connect.static (appConfig.html),
							connect.static (appConfig.tmp),
							connect.static ('./' + appConfig.app),
							connect.static ('test'),
							connect ().use ('/bower_components', connect.static ('./bower_components')),
							connect ().use ('/admin/styles', connect.static (appConfig.tmp + '/admin/styles')),
							connect ().use ('/front/styles', connect.static (appConfig.tmp + '/front/styles'))
						];
					}
				}
			},
			dist: {
				options: {
					open: true,
					base: '<%= project.dist %>',
					debug: true,
					keepalive: true,
					middleware: function (connect, options, defaultMiddleware) {
						return [
							proxySnippet,
							mountFolder (connect, './public')
						];
					}
				},
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require ('jshint-stylish')
			},
			all: {
				src: [
					'Gruntfile.js',
					'<%= project.app %>/**/*.js'
				]
			},
			test: {
				options: {
					jshintrc: 'test/.jshintrc'
				},
				src: ['test/spec/**/*.js']
			}
		},

		// grunt-contrib-less编译插件
		less: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= project.app %>',
					src: '**/*.less',
					dest: '<%= project.tmp %>',
					ext: '.css'
				}]
			},
			server: {
				options: {
					sourcemap: true
				}
			}
		},

		// Empties folders to start fresh
		// 清除编译的目录
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'<%= project.tmp %>',
						'<%= project.dist %>'
					]
				}]
			},
			server: '<%= project.tmp %>'
		},

		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: ['last 1 version']
			},
			server: {
				options: {
					map: true
				},
				files: [{
					expand: true,
					cwd: '<%= project.tmp %>',
					src: '**/*.styles',
					dest: '<%= project.tmp %>'
				}]
			},
			dist: {
				files: [{
					expand: true,
					cwd: '<%= project.tmp %>',
					src: '**/*.css',
					dest: '<%= project.tmp %>'
				}]
			}
		},


		// Automatically inject Bower components into the app
		wiredep: {
			app: {
				src: ['<%= project.app %>/**/*.html'],
				ignorePath: /\.\.\//
			},
			static: {//纯前端的环境使用,即美工环境
				src: ['<%= project.html %>/**/*.html'],
				ignorePath: /\.\.\//
			},
			sass: {
				src: ['<%= project.app %>/**/*.{scss,sass}'],
				ignorePath: /(\.\.\/){1,2}bower_components\//
			},
			less: {
				src: ['<%= project.app %>/**/*.less'],
				ignorePath: /(\.\.\/){1,2}bower_components\//
			}
		},
		// 使用grunt-contrib-compass对文件进行编译并压缩
		compass: {
			options: {
				sassDir: '<%= project.app %>/**/styles',
				cssDir: '<%= project.tmp %>/**/styles',
				generatedImagesDir: '<%= project.tmp %>/images/generated',
				imagesDir: '<%= project.app %>/**/images',
				javascriptsDir: '<%= project.app %>/**/js',
				fontsDir: '<%= project.app %>/**/fonts',
				importPath: './bower_components',
				httpImagesPath: '/images',
				httpGeneratedImagesPath: '/images/generated',
				httpFontsPath: '/styles/fonts',
				relativeAssets: false,
				assetCacheBuster: false,
				raw: 'Sass::Script::Number.precision = 10\n'
			},
			dist: {
				options: {
					generatedImagesDir: '<%= project.dist %>/images/generated'
				}
			},
			server: {
				options: {
					sourcemap: true
				}
			}
		},

		// Renames files for browser caching purposes
		filerev: {
			dist: {
				src: [
					'<%= project.dist %>/**/*.css',
					//'<%= project.dist %>/js/**/*.js',
					//'<%= project.dist %>/styles/**/*.{png,jpg,jpeg,gif,webp,svg}',
					'<%= project.dist %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
					'<%= project.dist %>/**/fonts/*'
				]
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		//useminPrepare: {
		//    a:{
		//    html: '<%= project.app %>/**/*.html',
		//    options: {
		//        dest: '<%= project.dist %>',
		//        root: '<%= project.dist %>',
		//        steps: {
		//            css: ['concat','cssmin']
		//        },
		//        post: {
		//            css: [{
		//                name: 'concat',
		//                createConfig: function (context, block) {
		//                    grunt.log.writeln(context);
		//                    context.options.generated.options = {
		//                        process: function (src, filepath) {
		//                            // options for concat:generatedCSS
		//                            grunt.log.writeln('\nfilepath: '+filepath);
		//                            return src;
		//                        }
		//                    };
		//                }
		//            }]
		//        }
		//    }
		//    }
		//},

		// Performs rewrites based on filerev and the useminPrepare configuration
		//usemin: {
		//    html: ['<%= project.dist %>/**/*.html'],
		//    css: ['<%= project.dist %>/**/*.css'],
		//    js: ['<%= project.dist %>/**/*.js'],
		//    options: {
		//        assetsDirs: [
		//            '<%= project.dist %>',
		//            '<%= project.dist %>/**/images',
		//            '<%= project.dist %>/**/styles',
		//            '<%= project.dist %>/**/js'
		//        ]
		//    }
		//},

		// The following *-min tasks will produce minified files in the dist folder
		// By default, your `index.html`'s <!-- Usemin block --> will take care of
		// minification. These next options are pre-configured if you do not wish
		// to use the Usemin blocks.
		cssmin: {
			options : {
				compatibility : 'ie8' //设置兼容模式
			},
			dist: {
				files: [{
					expand: true,
					cwd: './<%= project.tmp %>',
					src: ['**/*.css', '!bower_components/**/*.css'],
					dest: './<%= project.dist %>'
				}]
			}
		},
		// uglify: {
		// dist: {
		// files: {
		// '<%= project.dist %>/js/scripts.js': [
		// '<%= project.dist %>/js/scripts.js'
		// ]
		// }
		// }
		// },
		// concat: {
		// dist: {}
		// },

		// The following *-min tasks produce minified files in the dist folder
		// 图片压缩
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= project.app %>',
					src: '**/*.{png,jpg,jpeg,gif,ico}',
					dest: '<%= project.dist %>'
				}]
			}
		},
		// SVG图片压缩
		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= project.app %>',
					src: '**/*.svg',
					dest: '<%= project.dist %>'
				}]
			}
		},
		// html压缩
		htmlmin: {
			dist: {
				options: {
					collapseWhitespace: true,
					conservativeCollapse: true,
					collapseBooleanAttributes: true,
					removeCommentsFromCDATA: true,
					removeOptionalTags: true
				},
				files: [{
					expand: true,
					cwd: '<%= project.dist %>',
					src: ['**/*.html'],
					dest: '<%= project.dist %>'
				}]
			}
		},

		ngAnnotate: {
			dist: {
				options: {
					singleQuotes: true
				},
				files: [{
					expand: true,
					cwd: '<%= project.app %>',
					src: '**/*.js',
					dest: '<%= project.tmp %>'
				}]
			}
		},

		// Copies remaining files to places other tasks can use
		// 复制剩余的文件到目标目录以便grunt任务调用
		// cwd:相当于cd到这个目录
		// src:cd到cwd的目录后的源目录
		// dest:拷贝到目标目录,目标目录的层级会跟源目录层级(不会包括cwd的目录)一样
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: './<%= project.app %>',
					dest: './<%= project.dist %>',
					src: ['**/*.{ttf,txt,htaccess,html,json,swf}']
				}, {
					expand: true,
					cwd: './bower_components/KendoUI/dist/styles',
					src: '**/*.{ico,png,gif,jpg,ttf}',
					dest: './<%= project.dist %>/styles/kendo'
				}, {
					expand: true,
					cwd: './bower_components',
					src: '**/*.{ico,png,gif,jpg,ttf,css,js}',
					dest: './<%= project.dist %>/bower_components'
				}, {
					expand: true,
					cwd: './bower_components/',
					dest: './<%= project.dist %>/bower_components/',
					src: 'StudyLibrary/**/*.*'
				}, {
					expand: true,
					cwd: './bower_components',
					dest: './<%= project.dist %>/bower_components/',
					src: ['**/*.min.js', '**/*.swf', '**/*.css'],
					rename: function (dest, src) {
						return dest + src.replace ('.min.js', '.js');
					}
				}, {
					expand: true,
					cwd: './bower_components/KendoUI/dist/js',
					dest: './<%= project.dist %>/bower_components/KendoUI/js/',
					src: ['cultures/kendo.culture.zh-CN.min.js', 'messages/kendo.messages.zh-CN.min.js', 'kendo.web.min.js'],
					rename: function (dest, src) {
						return dest + src.replace ('.min.js', '.js');
					}
				}]
			},
			styles: {
				expand: true,
				cwd: './<%= project.app %>/**/styles',
				dest: './<%= project.tmp %>/**/styles/',
				src: '**/*.styles'
			},
			test: {
				files: [{
					expand: true,
					cwd: './bower_components',
					dest: './<%= project.dist %>/bower_components/',
					src: ['**/*.min.js', '**/*.swf', '**/*.css'],
					rename: function (dest, src) {
						return dest + src.replace ('.min.js', '.js');
					}
				}, {
					expand: true,
					cwd: './bower_components/KendoUI/dist/js',
					dest: './<%= project.dist %>/bower_components/KendoUI/js/',
					src: ['cultures/kendo.culture.zh-CN.min.js', 'messages/kendo.messages.zh-CN.min.js', 'kendo.web.min.js'],
					rename: function (dest, src) {
						return dest + src.replace ('.min.js', '.js');
					}
				}]
			}
		},

		// Run some tasks in parallel to speed up the build process
		// 并行运行一些任务加快构建过程
		concurrent: {
			server: [
				//'compass:server',
				'less:dist'
			],
			test: [
				//'compass',
				'less'
			],
			dist: [
				//'compass:dist',
				'less:dist',
				'imagemin',
				'svgmin',
			],
			uglifyDist: [
				'requirejs:dist_admin',
				'requirejs:dist_login'
			]
		},

		// 单元测试配置
		karma: {
			unit: {
				configFile: 'karma.conf.js',
				singleRun: true
			}
		},

		// Settings for grunt-bower-requirejs
		bowerRequirejs: {
			app: {
				rjsConfig: '<%= project.app %>/js/main.js',//指定requireJs的定义文件
				options: {
					exclude: ['requirejs', 'json3', 'es5-shim']//排除哪些js库
				}
			}
		},

		replace: {
			test: {
				src: '<%= project.app %>/../test/test-main.js',
				overwrite: true,
				replacements: [{
					from: /paths: {[^}]+}/,
					to: function () {
						return require ('fs').readFileSync (grunt.template.process ('<%= project.app %>') + '/js/main.js').toString ().match (/paths: {[^}]+}/);
					}
				}]
			}
		},

		uglify: { //压缩
			dist: {
				options: {
					mangle: true
					//sourceMap: true
				},
				files: [
					//{
					//    expand: true,
					//    cwd: './',
					//    src: ['bower_components/**/*.js', '!bower_components/webuploader_fex/**/*',
					// '!bower_components/**/*.min.js', '!bower_components/**/intro.js',
					// '!bower_components/**/outro.js'], dest: '<%= project.dist %>/' },
					{
						expand: true,
						cwd: './.tmp',
						src: '**/*.js',
						dest: '<%= project.dist %>/'
					}, {
						expand: true,
						cwd: './bower_components/',
						src: 'StudyLibrary/**/*.js',
						dest: '<%= project.dist %>/bower_components/'
					}
				]
			},
			test: {
				options: {
					mangle: true
				},
				files: [
					{
						expand: true,
						cwd: './',
						src: ['bower_components/**/*.js', '!bower_components/webuploader_fex/**/*', '!bower_components/**/*.min.js', '!bower_components/**/intro.js', '!bower_components/**/outro.js'],
						dest: '<%= project.dist %>/'
					}
				]
			}
		},

		// requireJs编译配置
		requirejs: {
			dist_admin: {
				options: {
					dir: '<%= project.dist %>/admin/js/',
					modules: [{
						name: 'main',
						exclude: [
							'kendo/kendo.web']
					}],
					preserveLicenseComments: false, // remove all comments
					removeCombined: true,
					baseUrl: '<%= project.tmp %>/admin/js',
					mainConfigFile: '<%= project.tmp %>/admin/js/main.js',
					optimize: 'uglify2',
					uglify2: {
						compress: {
							dead_code: true,
							unused: true,
							sequences: false,
							global_defs: {
								DEBUG: false
							}
						},
						warnings: true,
						mangle: true
					}
				}
			},
			dist_login: {
				options: {
					dir: '<%= project.dist %>/login/js/',
					modules: [{
						name: 'main',
					}],
					preserveLicenseComments: false, // remove all comments
					removeCombined: true,
					baseUrl: '<%= project.tmp %>/login/js',
					mainConfigFile: '<%= project.tmp %>/login/js/main.js',
					optimize: 'uglify2',
					uglify2: {
						compress: {
							dead_code: true,
							unused: true,
							sequences: false,
							global_defs: {
								DEBUG: false
							}
						},
						warnings: true,
						mangle: true
					}
				}
			}
		}
	});

	var statePrefix = "app.states.";
	/**
	 * 获取各个应用所有的路由配置,生成各个应用对应futureState需要的数组信息
	 * 状态路由的配置规则为"模块名-state.js"
	 * 状态路由的模块名规则为:"app.states.模块名."
	 * 此任务会"app.states."+按js的文件名"-state"之前的名称作为状态路由的模块名
	 * 状态的名规则为:"states."+模块名
	 * 子模块的路由url规则为"/模块名"
	 **/
	grunt.registerTask ('loadStates', function () {
		var apps = {},
			modulesFile = '/js/const/modules.js',
			futureStatesFile = '/js/const/futureStates.js',
			stateFiles = grunt.file.expand ({
				cwd: appConfig.app + ''
			}, "**/js/states/**/*-state.js");

		for (var i in stateFiles) {
			var file = stateFiles[i],
				fileName = file.substring (file.lastIndexOf ('/') + 1),
				appName = file.substring (0, file.indexOf ('/'));
			apps[appName] = apps[appName] || {};
			apps[appName]['futureStates'] = apps[appName]['futureStates'] || [];
			apps[appName]['modules'] = apps[appName]['modules'] || [];

			var moduleName = file.substring (file.lastIndexOf ('/') + 1, file.lastIndexOf ('-state'));
			//console.warn (file + ',' + fileName + ',' + appName + ',' + moduleName);
			//grunt.log.errorlns (file + "," + fileName + "," + appName + "," + moduleName);
			if (moduleName !== 'home') {
				var stateName = "states." + moduleName, /*+ 'State'*/
					stateModuleName = statePrefix + moduleName;
				apps[appName].futureStates.push ({
					module: stateModuleName,
					stateName: stateName,
					url: '/' + moduleName,
					type: 'ocLazyLoad'
				});
				apps[appName].modules.push ({
					reconfig: true,
					name: stateModuleName,
					files: ['states/' + fileName.replace ('.js', '')]
				});
			}
		}
		for (appName in apps) {
			if (apps[appName].futureStates) {
				var fileContent = 'define(function(){' +
					'"use strict";' +
					'return {futureStates:' + JSON.stringify (apps[appName].futureStates) + '}});';

				grunt.file.write (appConfig.app + '/' + appName + futureStatesFile, fileContent, {encoding: 'utf8'});
				//grunt.file.write (appConfig.app + '/' + appName + modulesFile, JSON.stringify
				// (apps[appName].futureStates), {encoding: 'utf8'});
			}
			if (apps[appName].modules) {
				var fileContent = 'define(function(){' +
					'"use strict";' +
					'return {modules:' + JSON.stringify (apps[appName].modules) + '}});';

				grunt.file.write (appConfig.app + '/' + appName + modulesFile, fileContent, {encoding: 'utf8'});
				//grunt.file.write (appConfig.app + '/' + appName + modulesFile, JSON.stringify
				// (apps[appName].modules), {encoding: 'utf8'});
			}
		}
	});


	/**
	 *
	 *
	 * 初衷为在每次创建一个state的时候都会很麻烦的去创建各种文件，
	 * 创建的这个任务是为了 在state那边配置一下就可以链式创建各种的文件
	 *
	 */
	grunt.registerTask ('createNewRouter', function (app) {

		function controllerJScontent () {
			var result = [];
			result.push ("define(function () {");
			result.push ("'use strict';");
			result.push ("return ['$scope', function ($scope) {");
			result.push ("}];");
			result.push ("});");
			return result.join ('');
		}

		function mainJsContent (fileState) {
			var result = [];
			result.push ("define(['angular', 'modules/" + fileState + "/controllers/" + fileState + "-ctrl'], function (angular, " + fileState + "Ctrl) {");
			result.push ("'use strict';");
			result.push ("return angular.module('app." + fileState + "', [])");
			result.push (".controller('app." + fileState + "." + fileState + "Ctrl', " + fileState + "Ctrl);");
			result.push ("}); ");
			return result.join ('');
		}

		function stateJsContent (fileState) {
			var result = [];
			result.push ("define(['angularUiRouter', 'modules/" + fileState + "/main'], function () {");
			result.push ("'use strict';");
			result.push ("return angular.module('app.states." + fileState + "', ['ui.router'])");
			result.push (".config(function ($stateProvider, $urlRouterProvider, $urlMatcherFactoryProvider) {");
			result.push ("$stateProvider");
			result.push (".state('states." + fileState + "', {");
			result.push ("url: '/" + fileState + "',");
			result.push ("sticky: true,");
			result.push ("views: {");
			result.push ("'states." + fileState + "@': {");
			result.push ("templateUrl: 'views/" + fileState + "/" + fileState + ".html',");
			result.push ("controller: 'app." + fileState + "." + fileState + "Ctrl'");
			result.push ("}");
			result.push ("}");
			result.push ("});");
			result.push ("});");
			result.push ("});");
			return result.join ('');
		}

		var stateDefineFiles = appConfig.app + '/admin/js/const/states.json',
			stateToWritePath = appConfig.app + '/admin/js/states',
			returnResult = grunt.file.readJSON (stateDefineFiles),
			modulesDir = appConfig.app + '/' + app + '/js/modules';

		for (var state in returnResult) {
			var fileState = returnResult[state],
				fileName = fileState + '-state.js';
			if (fileState === '') {
				grunt.log.warn ('没有找到状态文件');
				return false;
			}
			var value = grunt.file.exists (stateToWritePath + '/' + fileName);
			if (!value) {
				//
				grunt.file.write (stateToWritePath + '/' + returnResult[state] + '-state.js', stateJsContent (fileState));

				var dirPath = modulesDir + '/' + fileState;

				grunt.file.mkdir (dirPath);
				grunt.file.mkdir (dirPath + '/const');
				grunt.file.mkdir (dirPath + '/controllers');
				grunt.file.mkdir (dirPath + '/directives');
				grunt.file.mkdir (dirPath + '/filters');
				grunt.file.mkdir (dirPath + '/services');
				grunt.file.mkdir (dirPath + '/utils');
				grunt.file.write (dirPath + '/main.js', mainJsContent (fileState));
				grunt.file.write (dirPath + '/controllers/' + fileState + '-ctrl.js', controllerJScontent ());

				grunt.file.mkdir (appConfig.app + '/' + app + '/views/' + fileState);
				grunt.file.write (appConfig.app + '/' + app + '/views/' + fileState + '/' + fileState + '.html', fileState);
			} else {
				grunt.log.warn ('存在相同的目录');
			}
		}
	});

	grunt.registerTask ('serve', 'Compile then start a connect web server', function (target) {
		if (target === 'dist') {
			return grunt.task.run (['build', 'configureProxies', 'connect:dist']);
		} else if (target === 'static') {
			return grunt.task.run ([
				'clean:server',
				'loadStates',
				'wiredep:sass',
				'wiredep:less',
				'wiredep:static',
				'concurrent:server',
				'autoprefixer:server',
				'connect:static',
				'watch'
			]);
		}

		grunt.task.run ([
			'clean:server',
			'loadStates',
			'wiredep:sass',
			'wiredep:less',
			'wiredep:app',
			//'bowerRequirejs:app',
			'concurrent:server',
			'autoprefixer:server',
			'configureProxies',
			'connect:livereload',
			'watch'
		]);
	});

	grunt.registerTask ('server', 'DEPRECATED TASK. Use the "serve" task instead', function (target) {
		grunt.log.warn ('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run (['serve:' + target]);
	});

	grunt.registerTask ('test', [
		'clean:server',
		'loadStates',
		//'bowerRequirejs:app',
		'wiredep:sass',
		'wiredep:app',
		'concurrent:test',
		'autoprefixer',
		'connect:test',
		'karma'
	]);

	grunt.registerTask ('build', [
		'clean:dist',
		'loadStates',
		'wiredep:less',
		'wiredep:app',
		//'bowerRequirejs:app',
		//'useminPrepare',
		'concurrent:dist',
		'autoprefixer',
		//'concat',
		'ngAnnotate',
		//'filerev',
		//'usemin',
		//'concurrent:uglifyDist',
		'copy:dist',
		'cssmin:dist',
		'uglify:dist',
		'htmlmin'
	]);
	grunt.registerTask ('default', [
		//'newer:jshint',
		//'test',
		'build'
	]);
};
