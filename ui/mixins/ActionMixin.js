export default {
  props: {
    wrapperClass: {
      type: String,
      default: 'btn-group left-drop'
    },

    titleText: {
      type: String,
      default: 'Action'
    },

    titleIcon: {
      type: String,
      default: 'caret'
    },
    
    basePath: {
      type: String,
    },

    basic: {
      type: [String, Array],
      default: 'all'
    },

    external: {
      type: Array,
    }
  },

  methods: {
    resolveBasicActions: function(basic, basic_actions){
      let _basic_actions = [];

      if(basic == 'all')
        _basic_actions = basic_actions;

      else if(basic == 'null')
        _basic_actions = [];

      else if(typeof basic == 'object'){
        _basic_actions = _.filter(basic_actions, function(action){
          return basic.indexOf(action.type) != -1;
        });
      }

      return _basic_actions;
    },

    mergeActions: function(basic, external){
      let _actions = basic || [];
      _.forEach(external, function(action){
        if(
          action.position &&
          action.position != 0 &&
          action.position <= (basic.length + external.length)
        ){
          _actions.splice(action.position - 1, 0, action);
        } else {
          _actions.push(action);
        }
      });

      return _actions;
    },
  }
}
