App = Ember.Application.create();

App.Router.map(function() {
  // put your routes here
});

App.Square = Ember.Object.extend({
  selected: false,
  owner: '',
  ownerColor: '333',
  homeRow: Ember.computed.equal('row', 0),
  awayCol: Ember.computed.equal('col', 0),
  playableRow: Ember.computed.not('homeRow'),
  playableCol: Ember.computed.not('awayCol'),
  selectable: Ember.computed.and('playableRow', 'playableCol'),
  corner: Ember.computed.and('homeRow', 'awayCol'),
  color: function(){
    if (this.get('owned')) {
      return this.get('ownerColor') + '/&text=' + this.get('owner')
    } else if (this.get('selected'))  {
      return '333/&text=owner'
    } else {
      return '/&text=open'
    }
  }.property('selected', 'ownerColor'),

  imageSrc: function() {
    if (this.get('homeRow')) {
      return 'images/Denver_Broncos_logo.svg'
    } else if (this.get('awayCol')) {
      return 'images/Seattle_Seahawks_Vector_Logo.svg'
    } else {
      return 'http://placehold.it/100/' +  this.get('color');
    }
  }.property('selected')
});

App.IndexController = Ember.ArrayController.extend({
  needs: ['application'],
  owner: '',
  color: '',
  actions: {
    select: function(square) {
      if (square.get('selectable')) {
        square.toggleProperty('selected');
        square.toggleProperty('owned');
        square.set('owner', this.get('controllers.application.owner'));
        square.set('ownerColor', this.get('controllers.application.color').replace('#',''));
      }
    }
  }
});

App.ColorPicker = Em.TextField.extend({
  type: 'minicolors',
  attributeBindings: ['name'],

  didInsertElement: function() {
    this.$().minicolors({
      inline: false,
      defaultValue: '#e88133',
      position: 'left',
      textfield: false
    }).hide();
  }
});

App.IndexRoute = Ember.Route.extend({

  model: function() {
    var squares = [];
    _(11).times(function(row) {
      _(11).times(function(col) {
        squares.push(App.Square.create({ row: row, col: col}));
      });
    });
    return squares;
  }
});
