module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			all: ['*.js']
		},
		bootlint: {
			options: {
				stoponerror: false,
				relaxerror: []
			},
			files: ['index.html']
		}
	});	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-bootlint');
	grunt.registerTask('default', ['jshint','bootlint']);
};
