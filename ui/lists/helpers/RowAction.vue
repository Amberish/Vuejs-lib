<template lang="html">
  <action
    :actions="actions"
    v-on:action-clicked="actionClicked">
  </action>
</template>

<script>
import Action from './Action.vue';
import ActionMixin from '../../mixins/ActionMixin';

export default {
  mixins: [ActionMixin],

  props: {

    itemId: {
      type: String,
    },

    buttonType: {
      type: String,
      default: 'button'
    }
  },

  data: function(){
    return {
      basicActions: [
        // View Action
        {
          label: 'View',
          type: 'view',
          icon: 'fa fa-folder',
          link: this.basePath + '/' + this.itemId
        },

        // Edit
        {
          label: 'Edit',
          type: 'edit',
          icon: 'fa fa-pencil',
          link: this.basePath + '/' + this.itemId + '/edit'
        },

        // Delete
        {
          label: 'Delete',
          type: 'delete',
          icon: 'fa fa-trash',
          link: '#',
          modal: 'modal',
          modalTarget: '#delete-item-modal',
          divider: true
        }
      ]
    };
  },

  computed: {
    actions: function(){
      let _basic_actions = this.resolveBasicActions(this.basic, this.basicActions);
      return this.mergeActions(_basic_actions, this.external);
    }
  },

  methods: {
    // Generalized action click event
    actionClicked: function(action){
      //Add item_id to action object.
      action.item_id = this.itemId;

      this.$emit('row-action-clicked', action);
    },
  },

  components: {
    'action': Action
  }
}
</script>

<style lang="css">
</style>
