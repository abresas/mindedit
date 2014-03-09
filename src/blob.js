/** @jsx React.DOM */

var Blob = React.createClass( {
	areaWidth: null,
	areaHeight: null,
	propTypes: {
		text: React.PropTypes.string.isRequired,
		pageX: React.PropTypes.number.isRequired,
		pageY: React.PropTypes.number.isRequired,
		onClick: React.PropTypes.func,
		onTextChange: React.PropTypes.func
	},
	getDefaultProps: function() {
		return {
			onClick: function() {},
			onTextChange: function() {}
		};
	},
	handleClick: function( event ) {
		// stop propagation, otherwise a new blob will be created on top of this
		this.props.onClick( event );
		event.stopPropagation();
	},
	componentDidMount: function() {
		var node = this.getDOMNode();
		node.children[ 0 ].focus(); // focus textarea when element ready
	},
	measureText: function( text ) {
		// create a test div to measure the optimal width and height for the textarea
		// these measurements will later be used to resize textarea
		var lines = text.split( '\n' );
		var testNode = document.createElement( 'div' );
		testNode.className = 'texttest';
		var textNode = document.createTextNode( '' );
		lines.forEach( function( line ) {
			if ( line.length > textNode.nodeValue.length ) {
				textNode.nodeValue = line.replace( / /g, '_' ); // fix for whitespace not computed correctly
			}
		} );
		testNode.appendChild( textNode );
		document.body.appendChild( testNode );
		var width = testNode.clientWidth;

		testNode.innerHTML = text.replace( /\n/g, '<br>_' );
		var height = testNode.clientHeight;
		document.body.removeChild( testNode );

		return { width: width, height: height };
	},
	handleTextClick: function( event ) {
		// This allows selecting text (otherwise blob moves instead)
		event.stopPropagation();
	},
	render: function() {
		var divStyle = {
			left: this.props.pageX,
			top: this.props.pageY,
		};
		var text = this.props.text;
		var textSize = this.measureText( text );
		var areaWidth = Math.max( textSize.width + 20, 100 );
		var areaHeight = Math.max( textSize.height + 5, 16 );

		var textareaStyle = {
			width: areaWidth + 'px',
			height: areaHeight + 'px'
		};
		return (
			<div className="blob movable" style={divStyle} onMouseDown={this.props.onDragStart} onMouseUp={this.props.onDragEnd} onClick={this.handleClick}>
				<textarea style={textareaStyle} onMouseDown={this.handleTextClick} onChange={this.props.onTextChange} onFocus={this.props.onStartEditing} onBlur={this.props.onStopEditing} value={this.props.text}></textarea>
			</div>
		);
	}
} );
