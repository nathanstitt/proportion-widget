

(function(UI) {

S2.UI.Proportion = Class.create( S2.UI.Slider,{
    NAME: "S2.UI.Proportion",

    initialize: function( $super, box, options ) {
	this.proportion_container = $(box);
	this.proportion_container.addClassName('proportion ui-widget');
	var bar = new Element('div');
	this.proportion_container.update( bar );
	$super( bar,{
	    value: { min: 0, max: 100, initial: [], step: null },
	    onSlide:  this._onSlide.bind(this)
		}  );

	var opt = this.setOptions(options);
	this.maximum = opt['maximum'];
	this.labels = [];
    },

    rmHandle: function(handle){
	this.handles = this.handles.without(handle);
	handle.remove();
	return this.handles;
    },

    rmValue: function( label ){
	if ( "string" == typeof(label) ){
	    label = this.labels.detect(function(l){
			return ( l.getName() == name );
	    });
	}
	if ( label ){
	    label.remove();
	}
	var oldlen = this.labels.length;
	this.labels = this.labels.without( label );

	if ( oldlen != this.labels.length && oldlen > 1 ){
	    this.rmHandle( this.handles.last() );
	}
	this._balance();
	return label;
    },

    getValues: function( ){
	return this.labels.invoke('asObject');
    },

    setValues: function( values ){
      this.clear();
      var last = 0;
      this.initialized = false;
      values.each(function( val,index){
		    var perc = [ 100-last, ( val.value / this.maximum * 100 ) ].min();
		    var middle = perc ? ( perc + last - perc / 2 ) : last;
		    val.value = perc ? ( ( perc / 100 ) * this.maximum  ) : 0;
		    var label = new S2.UI.Proportion.Label( val, { 'labelFormatFunc': this.options['labelValueFormatFunc'] } );
		    this.labels.push( label );
		    label.moveTo( middle );
		    label.setIndex( index );

		    this.element.insert( label.element );

		    if ( index ){
		      this.addHandle( last );
		    }
		    last = perc;
	},this);
	this.initialized = true;
    },

    addValue: function( val ){
	var label = new S2.UI.Proportion.Label( val, { 'labelFormatFunc': this.options['labelValueFormatFunc'] } );
	if ( this.labels.length ) {
	    this.addHandle();
	}
	this.element.insert( label.element );
	this.labels.push( label );
	this._balance();
	label.setIndex( this.labels.length );
	return label;
    },

    setMaximum: function( max ){
	max = parseFloat( max );
	if ( this.labels.length > 1 ) {
	    this.labels.each( function(label,index){
		label.setValue( label.value / this.maximum * max );
	    }, this );
	    this.maximum = max;
	} else {
	    this.maximum = max;
	    this._balance();
	}
    },

    clear: function($super){
	$super();
	this.labels.invoke('remove');
	this.labels = [];
    },

    _balance: function(){
	if ( ! this.labels.length ){
	    return ;
	}
	if ( this.labels.length > 1 ) {
	    var each_size = 100 / this.labels.length;
	    var half_size = each_size / 2;
 	    this.handles.each( function(handle,index){
 		var current_pos = ((index+1)*each_size);
 		this.setValue( current_pos, index );
 	    }, this );
	} else {
	    this.labels[0].setValue( this.maximum ).moveTo( 50 );
	}
    },

    _onSlide:function(values,slider){
	var last = 0;
	values.each( function( value, index){
	    this.labels[index].
		setValue( (value/100*this.maximum)-last/100*this.maximum).
		moveTo( ( value - ( ( value - last ) / 2 ) )  );
	    last = value;
 	}, this );

	this.labels[ this.labels.length-1 ].
	    setValue( this.maximum - (last/100*this.maximum) ).
	    moveTo( 100 - ( ( 100 - last ) / 2 ) );
    }
});


S2.UI.Proportion.Label = Class.create({
    initialize: function( val, opts ){
	this._format = opts['labelFormatFunc'] || this._format;
	this.element = new Element('div', { className: 'ui-proportion-span' } );
	this.label = new Element('p', { className: 'ui-proportion-label' } );
	this.cel = new Element('span', { className: 'caption' } );
	this.cel.update( val.caption );
	this.label.insert( this.cel );
	this.vel = new Element('span', { className: 'value' } );
	this.vel.update( this._format( val.value ) );
	this.label.insert( this.vel );
	this.value = val.value;
	this.element.insert( this.label );
    },
    getName: function(){
	return this.cel.innerHTML;
    },
    getValue: function(){
	return parseFloat( this.vel.innerHTML );
    },
    asObject: function(){
	    return { value: this.getValue(),
		     caption: this.getName()
	    };
    },
    setValue:function( value ){	this.vel.update( this._format( value ) );
	return this;
    },
    moveTo:function( pos ){
	this.element.setStyle({'left': pos + '%' } );
	return this;
    },
    setIndex: function( index ){
    	var ht=(12*(index+1));
    	this.element.setStyle({
    	    height: ht+'px',
    	    marginTop: (ht*-1)+'px'
    	});
    },
    remove: function(){
	if ( this.element.parentNode ){
	    this.element.remove();
	}
    },
    _format:function( val ){
	return parseFloat( val ).toFixed(2);
    }

});

    Object.extend(UI.Proportion, {
	DEFAULT_OPTIONS: {
	    maximum: 100
	}
    });

})(S2.UI);

