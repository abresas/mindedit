var progressBar = {
	callbacks: { 'finish': [] },
	waitList: [],
	tasks: function( tasks ) {
		var progressDiv = document.getElementById( 'progress' );
		progressDiv.style.width = '0px';
		this.taskList = tasks.slice();
		tasks.forEach( function( task ) {
			progressBar.wait( task );
		} );
	},
	wait: function( task ) {
		this.waitList.push( task );
		this.callbacks[ task ] = [];
	},
	completed: function( task ) {
		console.log( 'ProgressBar: task completed', task );
		this.waitList.splice( this.waitList.indexOf( task ), 1 );
		var progress = 100 - ( this.waitList.length * 100 / this.taskList.length );
		var progressDiv = document.getElementById( 'progress' );
		progressDiv.style.width = parseInt( progress ) + '%';
		console.log( 'progress: ' + progress + '%', progressDiv.style.width );
		console.log( 'ProgressBar: waiting', this.waitList );
		this.callbacks[ task ].forEach( function( cb ) {
			cb();
		} );
		if ( this.waitList.length == 0 ) {
			console.log( 'ProgressBar: finish' );
			this.callbacks[ 'finish' ].forEach( function( cb ) {
				cb();
			} );
		}
	},
	onTaskComplete: function( task, callback ) {
		this.callbacks[ task ].push( callback );
	},
	onFinish: function( callback ) {
		this.callbacks[ 'finish' ].push( callback );
	}
};
