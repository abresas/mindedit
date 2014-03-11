/** @jsx React.DOM */

WebFont.load( {
	google: {
		families: [ 'Cousine' ]
	},
	fontactive: function( family ) {
		progressBar.completed( 'WebFont.fontactive.' + family );
	}
} );

progressBar.tasks( [ 'WebFont.fontactive.Cousine', 'MindEditor.load', 'Blob.load' ] );

progressBar.onFinish( function() {
	/*
	React.renderComponent(
		<MindEditor />,
		document.body
	);
	*/
} );
