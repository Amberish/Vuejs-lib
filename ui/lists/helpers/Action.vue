<template lang="html">
  <div :class="wrapperClass">
      <template>
        <a
          v-if="buttonType == 'anchor'"
          data-toggle="dropdown"
          class="btn-link dropdown-toggle"
          v-html="titleText + `<span class='` + titleIcon + `'></span>`">
        </a>

        <button
          v-else-if="buttonType == 'button'"
          data-toggle="dropdown"
          class="btn-link dropdown-toggle"
          v-html="titleText + `<span class='` + titleIcon + `'></span>`">
        </button>

      </template>

      <ul class="dropdown-menu">
          <template v-for="action in actions">
            <li v-if="action.divider" class="divider"></li>
            <li>
              <a
                :href="action.link"
                :data-toggle="action.modal"
                :data-target="action.modalTarget"
                @click="actionClicked(action)">
                <i :class="action.icon"></i> {{action.label}}
              </a>
            </li>
          </template>
      </ul>
  </div>
</template>

<script>
import ActionMixin from '../../mixins/ActionMixin';

export default {
  mixins: [ActionMixin],

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

    itemId: {
      type: String,
    },

    buttonType: {
      type: String,
      default: 'button'
    },

    actions: {
      type: Array
    }
  },

  methods: {
    // Generalized action click event
    actionClicked: function(action){
      this.$emit('action-clicked', action);
    },
  }
}
</script>

<style lang="css">
</style>
