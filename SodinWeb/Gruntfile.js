/// <binding ProjectOpened='dev' />
/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. https://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-bower-task');

    grunt.registerTask('dev', ['clean:lib', 'clean:bower', 'browserify', 'bower', 'copy', 'eslint', 'watch']);
    grunt.registerTask('build', ['clean', 'browserify', 'bower', 'copy', 'eslint', 'uglify']);

    grunt.initConfig({
        clean: {
            bower: ['bower_components'],
            dist: ['wwwroot/dist'],
            lib: ['wwwroot/lib']
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: 'Libs',
                        src: '**',
                        dest: 'wwwroot/lib/'
                    }]
            }
        },

        /* Write ES6 today, compile it to ES5 */
        browserify: {
            dist: {
                options: {
                    transform: [
                        ['babelify', {
                            presets: ["es2015", "es2016", "es2017"],
                            plugins: ['transform-runtime']
                        }]
                    ],
                    browserifyOptions: { debug: true }
                },
                files: {
                    'wwwroot/app.js': ['Scripts/**/*.js']
                }
            }
        },

        /* Bower: Copy main files from bower packages to a specific path */
        bower: {
            install: {
                options: {
                    targetDir: "wwwroot/lib",
                    layout: "byComponent",
                    cleanTargetDir: false,
                    install: true,
                    copy: true
                }
            }
        },

        /* Uglify: Minify all javascript code */
        uglify: {
            //options: {
            //    sourceMap: true,
            //    sourceMapIn: 'wwwroot/app.js.map',
            //    sourceMapIncludeSources: true,
            //    mangle: false // To fix the bug with dependency injection and minification.
            //},
            dist: {
                src: 'wwwroot/app.js',
                dest: 'wwwroot/dist/app.min.js'
            }
        },

        /* Validates ES6 files via ESLint */
        eslint: {
            options: {
                fix: false,
                configFile: 'eslintConfig.eslintrc'
            },
            target: 'Scripts/**/*.js'
        },

        /* Concat css files in one*/
        concat_css: {
            options: {
                // task-specific options go here. 
            },
            all: {
                src: ["css/**/*.css"],
                dest: "wwwroot/dist/app.css"
            }
        },

        /* Csslint: Evaluate the css */
        csslint: {
            strict: {
                src: ['wwwroot/css/*.css']
            },
            lax: {
                src: ['wwwroot/css/*.css']
            }
        },
        /* Watch: Watch for changes in js files and launch eslint and browserify tasks */
        watch: {
            scripts: {
                files: ['Scripts/**/*.js'],
                tasks: ['browserify', 'eslint']
            }
        }
    });
};