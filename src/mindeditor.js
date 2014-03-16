/** @jsx React.DOM */

var MindEditor = React.createClass( {
	dragBlobId: null,
	getInitialState: function() {
		window.editor = this;
		if ( typeof( Storage ) == "undefined" ) {
			console.log( "Browser does not support localstorage." );
		}
		if ( typeof( Storage ) !== "undefined" && localStorage.getItem( "mindEditor.blobs" ) ) {
			return { 
				blobs: JSON.parse( localStorage.getItem( "mindEditor.blobs" ) ), 
				nextBlobId: JSON.parse( localStorage.getItem( "mindEditor.nextBlobId" ) ) 
			};
		}
		else {
			var intro = "Welcome to MindEdit! Click anywhere to start writing.\n\n";
			if ( typeof( Storage ) !== "undefined" ) {
				intro += "Your browser supports localStorage. Great!\nYour text will be automatically saved on your browser.\n";
			}
			else {
				intro += "Your browser does not support localStorage.\nYour text will be lost after you reload or leave this page.\n";
			}
			return { 
				blobs: {
					1: {
						id: 1,
						x: 100,
						y: 100,
						text: intro
					}
				},
				nextBlobId: 2
			}
		}
	},
	componentWillUpdate: function() {
		if ( typeof( Storage ) !== "undefined" ) {
			localStorage.setItem( "mindEditor.blobs", JSON.stringify( this.state.blobs ) );
			localStorage.setItem( "mindEditor.nextBlobId", JSON.stringify( this.state.nextBlobId ) );
		}
	},
	handleClick: function( event ) {
		console.log( 'mindEditor: click', event.pageX, event.pageY );
		var id = this.state.nextBlobId;
		this.state.nextBlobId++;
		var blob = {
			x: event.pageX,
			y: event.pageY,
			text: '',
			id: id
		};
		this.state.blobs[ id ] = blob;
		this.setState( {
			nextBlobId: this.state.nextBlobId,
			blobs: this.state.blobs
		} );
	},
	handleBlobTextChange: function( blobId, event ) {
		console.log( 'mindEditor: text change', event.target.value );
		var blobs = this.state.blobs;
		var blob = blobs[ blobId ];
		blob.text = event.target.value;
		if ( !blob.text ) {
			delete this.state.blobs[ blobId ];
		}
		this.setState( {
			nextBlobId: this.state.nextBlobId,
			blobs: this.state.blobs
		} );
	},
	handleStopEditing: function( blobId, event ) {
		var blob = this.state.blobs[ blobId ];
		if ( !blob.text ) {
			delete this.state.blobs[ blobId ];
		}
		this.setState( {
			nextBlobId: this.state.nextBlobId,
			blobs: this.state.blobs
		} );
	},
	handleDragStart: function( blobId, event ) {
		console.log( 'mindEditor: drag start', blobId );
		this.dragBlobId = blobId;
		var blob = this.state.blobs[ blobId ];
		this.dragOffsetX = blob.x - event.pageX;
		this.dragOffsetY = blob.y - event.pageY;
	},
	handleMouseMove: function( event ) {
		if ( this.dragBlobId ) {
			var blobId = this.dragBlobId;
			var blob = this.state.blobs[ blobId ];
			blob.x = event.pageX + this.dragOffsetX;
			blob.y = event.pageY + this.dragOffsetY;
			this.setState( {
				nextBlobId: this.state.nextBlobId,
				blobs: this.state.blobs
			} );
		}
	},
	handleDragEnd: function( event ) {
		this.dragBlobId = null;
	},
	render: function() {
		var divStyle = {
			width: screen.width,
			height: screen.height
		};
		var blobs = {};
		for ( var i in this.state.blobs ) {
			var data = this.state.blobs[ i ];
			blobs[ 'blob-' + data.id ] = ( 
				<Blob id={data.id} pageX={data.x} pageY={data.y} text={data.text} 
					onTextChange={this.handleBlobTextChange.bind( this, data.id )} 
					onStopEditing={this.handleStopEditing.bind( this, data.id )} 
					onDragStart={this.handleDragStart.bind( this, data.id )} 
					onDragEnd={this.handleDragEnd}>
				</Blob>
			);
		}
		return (
			<div id="canvas" style={divStyle} onClick={this.handleClick} onMouseMove={this.handleMouseMove}>{blobs}</div>
		);
	}
} );

progressBar.completed( 'MindEditor.load' );
