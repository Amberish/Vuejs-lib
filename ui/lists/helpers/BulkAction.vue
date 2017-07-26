<template lang="html">
  <action
    button-type="anchor"
    wrapper-class="dropdown"
    title-text=""
    title-icon="fa fa-bars"
    :actions="actions"
    v-on:action-clicked="actionClicked">
  </action>
</template>

<script>
import ActionMixin from '../../mixins/ActionMixin';
import Action from './Action.vue';
export default {
  mixins: [ActionMixin],

  data: function(){
    return {
      basicActions: [
        {
          label: 'Delete Selected',
          type: 'delete',
          action: this.basePath + '/selected/mass-delete'
        }
      ]
    };
  },

  computed: {
    actions: function(){
      let _basic_actions = this.resolveBasicActions(this.basic, this.basicActions);
      let _actions = this.mergeActions(_basic_actions, this.external);
      // Emit bulk action loaded, in case action not provided.
      this.$emit('bulk-actions-loaded', _actions);
      return _actions;
    },
  },

  methods: {
    actionClicked: function(action){
      this.$emit('bulk-action-clicked', action);
    },
  },

  components: {
    'action': Action,
  }
}
</script>

<style lang="css">
</style>
