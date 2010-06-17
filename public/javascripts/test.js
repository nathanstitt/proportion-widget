jsUnity.attachAssertions();

Test = {
    init: function(){


	this.log = $('test-logs');
	jsUnity.log = function (s) {
	    this.log.insert({'top': '<li>' + s + '</li>' } );
	}.bind(this);

	this.container = $('slider');

	this.proportion=new S2.UI.Proportion( this.container,{
						  'labelValueFormatFunc': function(val){
						      return ( val || 0 );
						  }
					      } );

	this.proportion.addValue( { 'value': 50, 'caption': 'one' } );
	this.proportion.addValue( { 'value': 50, 'caption': 'two' } );


	( new S2.UI.Button('add') ).observe('click',function(){
						this.proportion.addValue( { 'value': 100 / this.proportion.labels.length,
									    'caption': 'caption-'+this.proportion.labels.length });
						}.bind(this));
	(new S2.UI.Button('rm')).observe('click',function(){
						this.proportion.rmValue( this.proportion.labels.last() );
						}.bind(this));
    }

};